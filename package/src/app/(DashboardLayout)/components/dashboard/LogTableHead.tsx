import {
  TableHead,
  TableRow,
  TableCell,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import HelpOutline from "@mui/icons-material/HelpOutline";

const HelpButton = ({ explanation }: { explanation: string }) => {
  return (
    <Tooltip title={explanation} arrow>
      <IconButton color="primary">
        <HelpOutline/>
      </IconButton>
    </Tooltip>
  );
};

const LogTableHead = ({ log }: { log: any }) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell width={"2000px"} align="center"></TableCell>
        <TableCell align="center">
          <Typography variant="subtitle2" fontWeight={600}>
            Application
            <HelpButton explanation="The application type (Libre, Work, onPrem)." />
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="subtitle2" fontWeight={600}>
            Version
            <HelpButton
              explanation="The version of the application. 
                        This can be found in Settings>About Threema>Version."
            />
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="subtitle2" fontWeight={600}>
            Architecture
            <HelpButton explanation="The type of device architecture the application is built for." />
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="subtitle2" fontWeight={600}>
            Version Code
            <HelpButton
              explanation="The specific version of the binary. 
                        This can be found at Settings>About Threema>Version (double-click)"
            />
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="subtitle2" fontWeight={600}>
            Reproducibility
            <HelpButton
              explanation="Whether the reproduction attempt was succesful. 
                        Although there could be harmless reasons why this happened, if the reproduction fails, it means the app might be compromised. 
                        To be safe, it is best to stop using the app while furhter investigation is made. 
                        If the apk could not build at all, you can look at the 'Build Log' command to try to figure out the reason"
            />
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="subtitle2" fontWeight={600}>
            Checksum
            <HelpButton
              explanation="A SHA-256 checksum is a sequence of 64 hex values derived from a file that should be unique.
                        If your binary has the same checksum as a sucessfully reproduced build, you can be sure you have the same application.
                        If the reproduction failed, the checksum is that of our reproduction attempt, that does not match the official one."
            />
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="subtitle2" fontWeight={600}>
            Build date
            <HelpButton explanation="The date of the last reproduction attempt." />
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="subtitle2" fontWeight={600}>
            APK source
            <HelpButton
              explanation="An APK is the executable used to run application on Android devices.
                        The source APK is the binary published by Threema we use to compare against the version we independently reproduce."
            />
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="subtitle2" fontWeight={600}>
            Source code
            <HelpButton explanation="The publicly available code from which the APK should be built in a deterministic way." />
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="subtitle2" fontWeight={600}>
            Commit Hash
            <HelpButton explanation="The specific commit the binary was reproduced from" />
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="subtitle2" fontWeight={600}>
            Build recipe
            <HelpButton explanation="The commands used to build the APK from the source code." />
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="subtitle2" fontWeight={600}>
            Build log
            <HelpButton explanation="The information generated during the build process." />
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default LogTableHead;
