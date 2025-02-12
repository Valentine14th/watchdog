import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function ApkUploadInfoDropdown() {
  return (
    <>
      <Typography
        variant="body1"
        sx={{ marginBottom: "10px", whiteSpace: "pre-line" }}
      >
        {`An APK (Android PacKage) is the file format used to distribute and install applications on Android devices.
          If you have an application installed on your device, you can extract its APK and upload it here to check if it matches the APKs in any of our reproduction attempts.
          This can help you assess the authenticity of the application you have installed.`}
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body1" fontWeight={"bold"}>
            Instructions to extract your APK
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontWeight: "bold", marginBottom: "10px" }}>
            {`To be able to pull APKs from your device, you first need to enable developer options and USB debugging on your device.`}
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginBottom: "20px", whiteSpace: "pre-line" }}
          >
            {`1. Go to Settings > About <device>
          2. Tap on 'Build number' 7 times.
          3. Go back to Settings and find Developer options.
          4. Enable USB debugging.`}
          </Typography>
          <Typography sx={{ fontWeight: "bold", marginBottom: "10px" }}>
            Now you can pull the APK from your device using adb (Android Debug
            Bridge):
          </Typography>
          <Typography sx={{ whiteSpace: "pre-line" }}>
            {`1. Connect your device to your computer using a USB cable.
            2. Determine the application id of the app you want to extract. You can find the package names of the apps we reproduce in the log below. For example, for Threema Libre, it is ch.threema.app.libre.`}
          </Typography>
          {`3. Open a terminal and run the following commands, replacing <your-app-id> with the one you found in 2. Make sure to accept any request on your device.`}
          <Box sx={{ whiteSpace: "pre-line", marginLeft: "20px" }}>
            <Typography sx={{ fontWeight: "bold", marginTop: "10px" }}>
              Linux:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "monospace",
                bgcolor: "grey.100",
                p: 1,
                borderRadius: 1,
                whiteSpace: "pre-line",
                marginBottom: "0px",
              }}
            >
              {`sudo apt install adb
          export APP_ID=<your-app-id>
          adb pull $(adb shell pm path $APP_ID | grep "/base.apk" | sed 's/^package://') extracted-app.apk`}
            </Typography>
            <Typography sx={{ fontWeight: "bold", marginTop: "10px" }}>
              Mac OS:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "monospace",
                bgcolor: "grey.100",
                p: 1,
                borderRadius: 1,
                whiteSpace: "pre-line",
                marginBottom: "0px",
              }}
            >
              {`brew install android-platform-tools
          export APP_ID=<your-app-id>
          adb pull $(adb shell pm path $APP_ID | grep "/base.apk" | sed 's/^package://') extracted-app.apk`}
            </Typography>
            <Typography sx={{ whiteSpace: "pre-line" }}>
              <Typography sx={{ fontWeight: "bold", marginTop: "10px" }}>
                Windows:
              </Typography>
              {`a. Download the platform-tools from the `}
              <Link
                href="https://developer.android.com/tools/releases/platform-tools"
                target="_blank"
                rel="noopener noreferrer"
              >
                Android Developers website
              </Link>
              {`
          b. Extract the zip file in a folder of your choice
          c. Right click anywhere in the folder and choose "Open in Terminal"
          d. Run the following commands in the Windows PowerShell.`}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "monospace",
                bgcolor: "grey.100",
                p: 1,
                borderRadius: 1,
                whiteSpace: "pre-line",
                marginBottom: "0px",
              }}
            >
              {`$APP_ID = "<your-app-id>"
$APK_PATH = .\\adb shell pm path $APP_ID | Select-String "/base.apk" | ForEach-Object { $_ -replace "package:", "" }
.\\adb pull $APK_PATH extracted-app.apk`}
            </Typography>
          </Box>
          <Typography sx={{ whiteSpace: "pre-line" }}>
            {`
          3. You will now have an apk in your current directory. Upload the extracted-app.apk file here.`}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
