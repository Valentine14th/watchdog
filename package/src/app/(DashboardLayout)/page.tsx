"use client";
import { Grid, Box, Typography } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import Log from "@/app/(DashboardLayout)/components/dashboard/Log";
import DashboardCard from "./components/shared/DashboardCard";

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <DashboardCard title="What is a Reproducible Build?">
              <Box
                sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}
              >
                <Typography variant="body1">
                  Reproducible Builds are a set of software development practices that create an independently-verifiable path from source code to the binary code used by computers. 
                  This means that anyone can reproduce the build process and get the same results.
                </Typography>
                <Typography variant="body1">
                  Reproducible Builds ensure that the software you trust is both safe and verifiable. 
                  They do this by verifying that the binaries that you download match the original, untampered source code. 
                  For security-related tools, like secure messaging apps, this means high confidence that your data and communications are protected against hidden backdoors or vulnerabilities.
                </Typography>
                <Typography sx={{paddingTop: "20px"}} variant="body2">
                  <a href="https://reproducible-builds.org/">
                    Learn more about Reproducible Builds
                  </a>
                </Typography>

              </Box>
            </DashboardCard>
            <Log />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
