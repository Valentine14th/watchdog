"use client";

import { useMemo, useState } from "react";
import DashboardCard from "../shared/DashboardCard";
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import AppRow from "./AppRow";
import { Box, Button, CircularProgress, Icon, Typography } from "@mui/material";
import LogTableHead from "./LogTableHead";
import ApkUploadInfoDropdown from "./ApkUploadInfoDropdown";
import { upload } from "@vercel/blob/client";

export default function ApkManifestUploader({ log }: { log: any[] }) {
  const [manifest, setManifest] = useState<any>(null);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [sha256, setSha256] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !file.name.endsWith(".apk")) {
      alert("Please upload a valid APK file.");
      return;
    }

    setFileName(file.name);
    setLoading(true);

    try {
      // Step 1: Upload the file to Vercel Blob
      const blob = await upload(file.name, file, {
        access: "public", // Allows fetching the file after upload
        handleUploadUrl: "/api/upload-apk",
      });
      console.log("APK uploaded successfully:", blob.url);

      // Step 2: Fetch and parse the uploaded APK
      const response = await fetch("/api/parse-apk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: blob.url }), // Send URL to backend
      });

      if (!response.ok) {
        throw new Error("Failed to parse APK");
      }

      const data = await response.json();
      setManifest(data.manifest);
      setSha256(data.sha256);

      // Step 3: Delete the file after processing
      await fetch("/api/delete-apk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: blob.url }), // Request file deletion
      });

    } catch (error) {
      console.error("Error handling APK: ", error);
      setManifest(null);
    } finally {
      setLoading(false);
    }
  };

  let apps = useMemo(() => {
    if (!manifest) return [];
    return log.filter(
      (apk) =>
        apk[1].version_code === manifest.versionCode &&
        apk[1].version_name === manifest.versionName
    );
  }, [log, manifest]);

  let displayApps = useMemo(
    () => apps.length > 0 && manifest,
    [apps, manifest]
  );

  let displayNoApps = useMemo(
    () => apps.length == 0 && manifest,
    [apps, manifest]
  );

  let noAppsText = useMemo(
    () =>
      `No logs found for this APK. \n
        Package: ${manifest?.package}
        Version: ${manifest?.versionName}
        Version Code: ${manifest?.versionCode} \n
        We do not support this application, or we might not have updated to the latest release yet.`,
    [manifest]
  );

  let match = useMemo(() => {
    if (!manifest || !sha256 || !apps || apps.length == 0) return null;
    let found = apps.find(
      (app) =>
        app[1].upstream_signed_apk_sha256 === sha256 ||
        app[1].built_unsigned_apk_sha256 === sha256 ||
        app[1].signature_copied_apk_sha256 === sha256
    );
    if (!found) {
      return (
        <>
          <Typography variant="h6">
            {`Your APK declares it is a version from the below logs, but none of our logs have the corresponding checksum. 
      Your APK might be signed by an entity unknown to us, 
      or, more critically, the application's functionality might have been compromised.
      Be careful!`}
          </Typography>
          <WarningAmberRoundedIcon
            color="warning"
            sx={{ fontSize: "35px", marginTop: "20px" }}
          />
        </>
      );
    } else if (found[1].built_unsigned_apk_sha256 === sha256) {
      return (
        <>
          <Typography variant="h6">
            {`Your APK matches the APK we built from the source code. This APK faithufully reflects the source code. 
          However, it might not be usable as it is not signed.`}
          </Typography>
          <WarningAmberRoundedIcon
            color="warning"
            sx={{ fontSize: "35px", marginTop: "20px" }}
          />
        </>
      );
    } else if (found[1].reproducible) {
      return (
        <>
          <Typography variant="h6">
            {`Your APK matches the below succesfully reproduced APK! 
            This means that the APK you uploaded is the same as the one we built from the source code.`}
          </Typography>
          <CheckCircleOutlineRoundedIcon
            color="success"
            sx={{ fontSize: "35px", marginTop: "20px" }}
          />
        </>
      );
    } else if (found[1].upstream_signed_apk_sha256 === sha256) {
      return (
        <>
          <Typography variant="h6">
            {`Your APK matches the source APK from the below log. 
            Be careful, we were not able to reproduce it succesfully!`}
          </Typography>
          <WarningAmberRoundedIcon
            color="error"
            sx={{ fontSize: "35px", marginTop: "20px" }}
          />
        </>
      );
    } else if (found[1].signature_copied_apk_sha256 === sha256) {
      return (
        <>
          <Typography variant="h6">
            {`Did you try to copy the signature of the official release on an unsigned APK?
                You APK matches our failed reproduction attempt.
                Be careful, it does not match the official release!`}
          </Typography>
          <WarningAmberRoundedIcon
            color="error"
            sx={{ fontSize: "35px", marginTop: "20px" }}
          />
        </>
      );
    }
  }, [apps, manifest, sha256]);

  return (
    <DashboardCard title="Check your application">
      <>
        <ApkUploadInfoDropdown />
        <input
          type="file"
          accept=".apk"
          id="upload-button"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <Box sx={{ marginTop: "20px" }}>
          <label htmlFor="upload-button">
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              gap={2}
            >
              <Button variant="contained" component="span" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Upload APK"}
              </Button>
              {fileName && <Typography variant="body1">{fileName}</Typography>}
            </Box>
          </label>
        </Box>
        {displayNoApps && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              marginTop: "20px",
            }}
          >
            <Typography
              sx={{
                marginTop: "10px",
                whiteSpace: "pre-line",
                textAlign: "center",
              }}
              variant="body1"
              className="text-center text-lg"
            >
              {noAppsText}
            </Typography>
            <DangerousOutlinedIcon sx={{ fontSize: "35px", color: "grey" }} />
          </Box>
        )}
        {match && (
          <Box>
            <Typography
              sx={{
                whiteSpace: "pre-line",
                textAlign: "center",
                marginTop: "20px",
                marginBottom: "20px",
              }}
              className="text-center text-lg"
            >
              {match}
            </Typography>
          </Box>
        )}
        <>
          {displayApps && (
            <DashboardCard>
              <>
                <LogTableHead />
                {apps.map((app) => (
                  <AppRow
                    key={`${app[1].appid}:${app[1].version_code}`}
                    row={app[1]}
                    appid={app[1].appid}
                    version={app[0]}
                  />
                ))}
              </>
            </DashboardCard>
          )}
        </>
      </>
    </DashboardCard>
  );
}
