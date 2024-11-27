
import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)//components/shared/DashboardCard';

// GitHub repo details
const GITHUB_API_URL = 'https://api.github.com/repos/obfusk/rbtlog/contents/logs';
const GITHUB_RAW_BASE_URL = 'https://raw.githubusercontent.com/obfusk/rbtlog/log/';
const files = ['https://raw.githubusercontent.com/obfusk/rbtlog/log/logs/ch.threema.app.libre.json']

// Fetch product data from the GitHub repo
const fetchProducts = async () => {
    // const response = await fetch(GITHUB_API_URL, {
    //     headers: { Accept: 'application/vnd.github.v3+json' },
    // });

    // if (!response.ok) {
    //     throw new Error('Failed to fetch GitHub files');
    // }

    // const files = await response.json();

    // Fetch content of each JSON file
    const productPromises = files
        .map((file) => fetch(`${file}`, {
            headers: { 
            Accept: 'application/vnd.github.v3+json' },
            cache: 'force-cache', // Ensure the data is cached
            next: {revalidate: 86400}
        }).then((res) => res.json()));

    return Promise.all(productPromises); // Return all parsed JSON
};


const ProductPerformance = async () => {
    const log = await fetchProducts();
    const threema = log[0];
    console.log("Fetched data:", log); // Logs in the terminal
    console.log("keys:", Object.entries(log[0].tags)); // Logs in the terminal
    return (
        <DashboardCard title="Product Performance">
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                <Table
                    aria-label="simple table"
                    sx={{
                        whiteSpace: "nowrap",
                        mt: 2
                    }}
                >
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
                                    APK source
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
                            <TableCell align="right">
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Build recipe
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Source code
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {log.map((app) => (
                            Object.entries(app.tags).map(([version, value] : [string, any]) => (
                            <TableRow key={version}>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            fontSize: "15px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        {app.appid}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            fontSize: "15px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        {version}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            fontSize: "15px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        {value[0].recipe.apk_url}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Chip
                                        sx={{
                                            px: "4px",
                                            backgroundColor: value[0].reproducible ? "#4caf50" : "#f44336",
                                            color: "#fff",
                                        }}
                                        size="small"
                                        label={value[0].reproducible ? "Sucess" : "Failure"}
                                    ></Chip>
                                </TableCell>
                                <TableCell align="right">
                                <Typography
                                        sx={{
                                            fontSize: "15px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        {new Date(parseInt(value[0].timestamp)*1000).toLocaleDateString()}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))))}
                    </TableBody>
                </Table>
            </Box>
        </DashboardCard>
    );
};

export default ProductPerformance;
