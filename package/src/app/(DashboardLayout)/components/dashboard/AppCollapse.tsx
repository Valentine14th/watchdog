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
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
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
      <TableRow
        sx={{
          backgroundColor: "#f9f9f9",
          borderRadius: "50px",
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => apkOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography
            sx={{
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
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Version
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Architecture
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Reproducibility
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Last Build date
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        APK source
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Source code
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Build recipe
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Build log
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
