"use client";

import { useMemo, useState } from "react";
import DashboardCard from "../shared/DashboardCard";
import AppRow from "./AppRow";
import { Box, Button, Typography } from "@mui/material";

export default function ApkManifestUploader({ log }: { log: any[] }) {
  const [manifest, setManifest] = useState<any>(null);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [sha256, setSha256] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !file.name.endsWith(".apk")) {
      alert("Please upload a valid APK file.");
      return;
    }
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/parse-apk", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      setManifest(data.manifest);
      setSha256(data.sha256);
    } catch (error) {
      console.error("Error uploading file:", error);
      setManifest("Error retrieving manifest");
    }
  };

  let apps = useMemo(() => {
    console.log(manifest);
    if (!manifest) return [];
    return log.filter(
      (apk) =>
        apk[1].version_code === manifest.versionCode &&
        apk[1].version_name === manifest.versionName
    );
  }, [log, manifest]);

  let noApps = useMemo(
    () =>
      "No logs found for this APK. Package: " +
      manifest?.package +
      ", Version: " +
      manifest?.versionName +
      ", Version Code: " +
      manifest?.versionCode +
      ". We do not support this application, or we might not have updated to the latest release yet.",
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
      return "Your APK declares it is a version from the above logs, but none of our logs have the corresponding checksum. Your APK might be compormised, or it might be signed with a key unknown to us. Be careful!";
    } else if (found[1].reproducible) {
      return "Your APK matches the above succesfully reproduced APK!";
    } else if (found[1].upstream_signed_apk_sha256 === sha256) {
      return "Your APK matches the source APK from the above log. Be careful, we were not able to reproduce it succesfully!";
    } else if (found[1].signature_copied_apk_sha256 === sha256) {
      return "Your APK matches the APK we built from the source code. This APK faithufully reflects the source code. However, its signature seems to be invalid.";
    } else {
      return "Your APK matches the APK we built from the source code. This APK faithufully reflects the source code. However, it might not be usable as it is not signed.";
    }
  }, [apps, manifest, sha256]);

  return (
    <DashboardCard title="Check your APK">
      <div className="flex flex-col items-center p-4 border rounded-lg shadow-lg max-w-md mx-auto">
        <input
          type="file"
          accept=".apk"
          id="upload-button"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <label htmlFor="upload-button">
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap={2}>
            <Button variant="contained" component="span">
              Upload APK
            </Button>
            {fileName && <Typography variant="body2">{fileName}</Typography>}
          </Box>
        </label>
        {manifest &&
          apps.map((app) => (
            <AppRow
              key={`${app[1].appid}:${app[1].version_code}`}
              row={app[1]}
              appid={app[1].appid}
              version={app[0]}
            />
          ))}
        {manifest && apps.length == 0 && (
          <div className="text-center text-lg text-red-500">{noApps}</div>
        )}
        {match && (
          <div className="text-center text-lg text-red-500">{match}</div>
        )}
      </div>
    </DashboardCard>
  );
}
