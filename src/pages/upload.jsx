import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
// import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
// import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import Sidebar from "../components/dashboard/SideBar";
import Header from "../components/dashboard/Header";
import axios from "axios";
import { useSnackbar } from "notistack";
import { LinearProgress } from "@mui/joy";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";



export default function Upload() {
    const [file, setFile] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();
  
    const handleUpload = async (event) => {
      event.preventDefault();
      if (!file) {
        enqueueSnackbar("Please select a file to upload.", { variant: "warning" });
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
  
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `${import.meta.env.VITE_API_URL}/upload-credentials`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setLoading(false);
        enqueueSnackbar("File uploaded successfully!", { variant: "success" });
        setFile(null); // Clear the file after upload
      } catch (error) {
        setLoading(false);
        enqueueSnackbar("Failed to upload file.", { variant: "error" });
        console.error("Error uploading file:", error.response?.data || error.message);
      }
    };



  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: "calc(12px + var(--Header-height))",
              sm: "calc(12px + var(--Header-height))",
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon fontSize="sm" />}
              sx={{ pl: 0 }}
            >
              <Link
                underline="none"
                color="neutral"
                href="#some-link"
                aria-label="Home"
              >
                <HomeRoundedIcon />
              </Link>
              <Link
                underline="hover"
                color="neutral"
                href="#some-link"
                fontSize={12}
                fontWeight={500}
              >
                Dashboard
              </Link>
              <Typography color="primary" fontWeight={500} fontSize={12}>
                Upload
              </Typography>
            </Breadcrumbs>
          </Box>

          <Box
            sx={{
              display: "flex",
              mb: 1,
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "start", sm: "center" },
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Card sx={{ width: "100%", maxWidth: "800px" }}>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">Upload</Typography>
                <Typography level="body-sm">
                  Combine your credentials in one pdf file and upload
                  <br />
                  Your pdf should include:
                  <List>
                    <ListItem>
                      National ID or Driving License or Passport
                    </ListItem>
                    <ListItem>Medical License</ListItem>
                    <ListItem>Resume</ListItem>
                    <ListItem>Professional Photo</ListItem>
                    <ListItem>Recommendation Letter</ListItem>
                  </List>
                </Typography>
              </Box>
              <Divider />
              <form onSubmit={handleUpload}>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <FormControl>
                <FormLabel>Upload File</FormLabel>
                <Button
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  variant="outlined"
                >
                  Choose File
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </Button>
                {file && <Typography>{file.name}</Typography>}
              </FormControl>
              <CardActions>
                <Button type="submit" variant="solid" disabled={loading}>
                  Upload
                </Button>
              </CardActions>
            </Stack>
          </form>
              {loading && <LinearProgress />}
            </Card>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
