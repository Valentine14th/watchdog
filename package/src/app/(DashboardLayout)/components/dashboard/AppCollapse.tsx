import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useMemo, useState } from "react";
import AppRow from "./AppRow";

// Display constants
const APPS: Record<string, string> = {
  "ch.threema.app.libre": "Threema Libre",
  "ch.threema.app.work": "Threema Work",
  "ch.threema.app.onprem": "Threema OnPrem",
};

const filterQuery = (version: string, searchQuery: string) => {
  const numbers = searchQuery.match(/\d/g);
  if (!numbers) return true;
  return numbers.every((num) => version.includes(num));
};

const HelpButton = ({ explanation} : {explanation: string}) => {
  return (
    <Tooltip title={explanation} arrow>
      <IconButton>
        <HelpOutlineIcon />
      </IconButton>
    </Tooltip>
  );
};

function AppCollapse({ log }: { log: any }) {
  const [open, apkOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchLogs = useMemo(() => {
    if (!searchQuery) return Object.entries(log.tags);
    return Object.entries(log.tags).filter(([version, apks]: [string, any]) =>
      filterQuery(version, searchQuery)
    );
  }, [log.tags, searchQuery]);

  return (
    <>
      <TableRow>
        <TableCell
        sx={{
          backgroundColor: "primary.main",
          borderTopLeftRadius: "30px",
          borderBottomLeftRadius: "30px",
        }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => apkOpen(!open)}
            sx={{color: "black"}}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row"
        sx={{
          backgroundColor: "primary.main",
          borderTopRightRadius: "30px",
          borderBottomRightRadius: "30px"
        }}>
          <Typography
            sx={{
              color: "black",
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            {APPS[log.appid]}
          </Typography>
        </TableCell>
      </TableRow>
      <TableBody>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Box sx={{ padding: 2 }}>
                <TextField
                  label="Search for a version"
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ marginBottom: 3 }}
                />
              </Box>
              <Table aria-label="logs">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Application
                        <HelpButton explanation="The application type (Libre, Work, onPrem)."/>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Version
                        <HelpButton explanation="The version of the application. 
                        This can be found in Settings>About Threema>Version."/>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Architecture
                        <HelpButton explanation="The type of device architecture the application built for."/>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Version Code
                        <HelpButton explanation="The specific version of the binary. 
                        This can be found at Settings>About Threema>Version (double-click)"/>
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Reproducibility
                        <HelpButton explanation="Whether the reproduction attempt was succesful. 
                        Although there could be harmless reasons why this happened, if the reproduction fails, it means the app might be compromised. 
                        To be safe, it is best to stop using the app while furhter investigation is made. 
                        If the apk could not build at all, you can look at the 'Build Log' command to try to figure out the reason"/>
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Last Build date
                        <HelpButton explanation="The date of the last reproduction attempt."/>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        APK source
                        <HelpButton explanation="An APK is the executable used to run application on Android devices.
                        The source APK is the binary published by Threema we use to compare against the version we independently reproduce."/>
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Source code
                        <HelpButton explanation="The publicly available code from which the APK should be built in a deterministic way."/>
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Build recipe
                        <HelpButton explanation="The commands used to build the APK from the source code."/>
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Build log
                        <HelpButton explanation="The information generated during the build process."/>
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchLogs.map(([version, apks]: [string, any]) =>
                    apks.map((apk: any) => (
                      <AppRow
                        key={apk.version_code}
                        row={apk}
                        appid={log.appid}
                        version={version}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableBody>
    </>
  );
}

export default AppCollapse;
