import { Box, IconButton, Table, TableBody, Typography } from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)//components/shared/DashboardCard";
import AppRow from "./AppRow";
import { useState, useMemo } from "react";
import LogTableHead from "./LogTableHead";
import FilterDropdown from "./FilterDropdown";
import ReplayIcon from '@mui/icons-material/Replay';

const allArchitectures = [
  "universal",
  "arm64-v8a",
  "armeabi-v7a",
  "x86_64",
  "x86",
  "unknown"
];

const parseArchitecture = (apk: any) => {
  let abi = allArchitectures.find((arch) => apk.recipe.apk_pattern.includes(arch));
  if (!abi){
    let uni = ["enable true"].find((arch) => apk.recipe.build.includes(arch));
    abi = uni ? "universal" : undefined
  }
  return abi ? abi : "unknown";
};

const allApplications: Record<string, string> = {
  "ch.threema.app.libre": "Threema",
  "ch.threema.app.work": "Threema Work",
  "ch.threema.app.onprem": "Threema OnPrem",
};
const allReproducible: Record<string, boolean | null> = {
  Success: true,
  Failure: false,
  Error: null,
};

const filterQuery = (
  version: string,
  architecture: string,
  application: string,
  reproducible: boolean | null,
  filterVersion: string[],
  filterApplications: string[],
  filterArch: string[],
  filterReproducible: string[]
) => {
  return (
    filterVersion.includes(version) &&
    filterApplications.includes(application) &&
    filterArch.includes(architecture) &&
    filterReproducible.map((rep) => allReproducible[rep]).includes(reproducible)
  );
};

const LogTable = ({ log }: { log: any[] }) => {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [selectedArch, setSelectedArch] = useState<string[]>([]);
  const [selectedApp, setSelectedApp] = useState<string[]>([]);
  const [selectedReproducible, setSelectedReproducible] = useState<string[]>(
    []
  );

  const handleReset = () => {
    setSelectedVersions([]);
    setSelectedArch([]);
    setSelectedApp([]);
    setSelectedReproducible([]);
  };

  const allVersions = useMemo(() => {
    let out = new Set<string>();
    for (const app of log) {
      for (const [version, apks] of Object.entries(app.tags)) {
        out.add(version);
      }
    }
    return Array.from(out);
  }, [log]);

  const filteredLogs: any[] = useMemo(() => {
    let out: [string, any][] = [];
    for (const app of log) {
      for (const [version, apks] of Object.entries(app.tags) as [
        string,
        any[]
      ][]) {
        for (const apk of apks) {
          out.push([version, apk]);
        }
      }
    }
    out = out.filter(([version, apk]: [string, any]) =>
      filterQuery(
        version,
        parseArchitecture(apk),
        allApplications[apk.appid],
        apk.reproducible,
        selectedVersions.length == 0 ? allVersions : selectedVersions,
        selectedApp.length == 0 ? Object.values(allApplications) : selectedApp,
        selectedArch.length == 0 ? allArchitectures : selectedArch,
        selectedReproducible.length == 0
          ? Object.keys(allReproducible)
          : selectedReproducible
      )
    );
    return out;
  }, [
    allVersions,
    log,
    selectedApp,
    selectedArch,
    selectedReproducible,
    selectedVersions,
  ]);

  return (
    <DashboardCard title="Reproducible Build Log">
      <>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Filter the logs by using the options below:
        </Typography>
        <Box
          display="flex"
          flexDirection="row"
          sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}
        >
          <FilterDropdown
            description="Applications"
            allOptions={Object.values(allApplications)}
            selectedOptions={selectedApp}
            setSelectedoptions={setSelectedApp}
          />
          <FilterDropdown
            description="Versions"
            allOptions={allVersions}
            selectedOptions={selectedVersions}
            setSelectedoptions={setSelectedVersions}
          />
          <FilterDropdown
            description="Architectures"
            allOptions={allArchitectures}
            selectedOptions={selectedArch}
            setSelectedoptions={setSelectedArch}
          />
          <FilterDropdown
            description="Reproducibility"
            allOptions={Object.keys(allReproducible)}
            selectedOptions={selectedReproducible}
            setSelectedoptions={setSelectedReproducible}
          />
          <IconButton sx={{marginY: "40px"}} size="small" onClick={handleReset}>
            <ReplayIcon />
          </IconButton>
        </Box>
        <DashboardCard >
          <Table stickyHeader aria-label="logs">
            <LogTableHead log={log} />
            <TableBody>
              {filteredLogs.length != 0 ? (
                filteredLogs.map(([version, apk]: [string, any]) => (
                  <AppRow
                    key={`${apk.appid}:${apk.version_code}`}
                    row={apk}
                    appid={apk.appid}
                    version={version}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center" }}>
                    No corresponding logs found. Try another filter.
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </DashboardCard>
      </>
    </DashboardCard>
  );
};

export default LogTable;
