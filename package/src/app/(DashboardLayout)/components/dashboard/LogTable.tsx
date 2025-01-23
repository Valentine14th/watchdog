import { Box, Table } from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)//components/shared/DashboardCard";
import AppCollapse from "./AppCollapse";

const LogTable = ({ log }: { log: any[] }) => {
  return (
    <DashboardCard title="Reproducible Build Log">
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        <Table
          aria-label="collapsible table"
          sx={{
            whiteSpace: "nowrap",
            mt: 2,
          }}
        >
          {log.map((app: any) => (
            <AppCollapse key={app.appid} log={app} />
          ))}
        </Table>
      </Box>
    </DashboardCard>
  );
};

export default LogTable;
