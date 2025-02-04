import {
  Box,
  Button,
  Chip,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import BuildIcon from "@mui/icons-material/Build";
import SourceIcon from "@mui/icons-material/Source";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import Image from "next/image";
import { Content } from "next/font/google";

// Display constants
const APPS: Record<string, string> = {
  "ch.threema.app.libre": "Threema Libre",
  "ch.threema.app.work": "Threema Work",
  "ch.threema.app.onprem": "Threema OnPrem",
};
const APP_IMAGES: Record<string, string> = {
  "ch.threema.app.libre": "/images/logos/threema-libre.png",
  "ch.threema.app.work": "/images/logos/threema-work.png",
  "ch.threema.app.onprem": "/images/logos/threema-onprem.png",
};
const ARCHITECTURES = [
  "enable true",
  "arm64-v8a",
  "armeabi-v7a",
  "x86_64",
  "x86",
];

const parseArchitecture = (apk: any) => {
  let abi = ARCHITECTURES.find((arch) => apk.recipe.build.includes(arch));
  return abi == "enable true" ? "universal" : abi;
};

const openPlainTextWindow = (text: string) => {
  const newWindow = window.open("", "_blank");
  if (newWindow) {
    newWindow.document.open();
    newWindow.document.write(`<pre>${text}</pre>`);
    newWindow.document.close();
  } else {
    console.error(
      "Failed to open a new window. Make sure pop-ups are not blocked."
    );
  }
};

const getReproduciblilityText = (reproducible: any) => {
  return reproducible == null ? "Error" : reproducible ? "Success" : "Failure";
};

const getReproduciblilityColor = (reproducible: any) => {
  return reproducible == null
    ? "#a7aaab"
    : reproducible
    ? "#4caf50"
    : "#f44336";
};

const InfoButton = ({ explanation }: { explanation: string }) => {
  return (
    <Tooltip title={explanation} arrow>
      <IconButton color="error">
        <WarningAmberRoundedIcon />
      </IconButton>
    </Tooltip>
  );
};

function AppRow({
  row,
  appid,
  version,
}: {
  row: any;
  appid: string;
  version: string;
}) {
  return (
    <TableRow>
      <TableCell align="center">
        {
          row["notes"] && row["notes"].length > 0 ? (
            <InfoButton explanation={row["notes"].join(",")}/>
          ) : ""
        }

      </TableCell>
      <TableCell align="center">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            <Image
              src={APP_IMAGES[appid]}
              alt={`${APPS[appid]} logo`}
              width={40}
              height={40}
              style={{
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
          </Typography>
          <Typography sx={{ ml: "10px" }}>{APPS[appid]}</Typography>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: "500",
          }}
        >
          {version}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: "500",
          }}
        >
          {parseArchitecture(row)}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: "500",
          }}
        >
          {row.version_code}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Chip
          sx={{
            px: "4px",
            backgroundColor: getReproduciblilityColor(row.reproducible),
            color: "#fff",
          }}
          size="small"
          label={getReproduciblilityText(row.reproducible)}
        ></Chip>
      </TableCell>
      <TableCell align="center">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            direction: "row",
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            {row["signature_copied_apk_sha256"].substring(0, 8)}
          </Typography>
          <IconButton
            sx={{ marginLeft: "2px" }}
            size="small"
            onClick={() =>
              navigator.clipboard.writeText(row["signature_copied_apk_sha256"])
            }
          >
            <ContentCopyIcon sx={{ width: "20px" }} />
          </IconButton>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: "500",
          }}
        >
          {new Date(parseInt(row.timestamp) * 1000).toLocaleDateString("en-US")}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Button
          sx={{
            borderRadius: "50px",
            minWidth: "20px",
          }}
          size="small"
          variant="contained"
          color="primary"
          onClick={() => window.open(row.recipe.apk_url)}
          style={{ textTransform: "none" }}
        >
          <DownloadIcon />
        </Button>
      </TableCell>
      <TableCell align="center">
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: "500",
          }}
        >
          <Button
            sx={{
              borderRadius: "50px",
              minWidth: "20px",
            }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() =>
              window.open(
                row.recipe.repository.replace(".git", "") + "/tree/" + version
              )
            }
            style={{ textTransform: "none" }}
          >
            <SourceIcon />
          </Button>
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            direction: "row",
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            {row["commit"].substring(0, 8)}
          </Typography>
          <IconButton
            sx={{ marginLeft: "2px" }}
            size="small"
            onClick={() => navigator.clipboard.writeText(row["commit"])}
          >
            <ContentCopyIcon sx={{ width: "20px" }} />
          </IconButton>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: "500",
          }}
        >
          <Button
            sx={{
              borderRadius: "50px",
              minWidth: "20px",
            }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => openPlainTextWindow(row.recipe.build)}
            style={{ textTransform: "none" }}
          >
            <BuildIcon />
          </Button>
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: "500",
          }}
        >
          <Button
            sx={{
              borderRadius: "50px",
              minWidth: "20px",
            }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => openPlainTextWindow(row.build_log)}
            style={{ textTransform: "none" }}
          >
            <ManageSearchIcon />
          </Button>
        </Typography>
      </TableCell>
    </TableRow>
  );
}

export default AppRow;
