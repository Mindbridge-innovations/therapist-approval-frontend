import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import Sidebar from "../components/dashboard/SideBar";
import Header from "../components/dashboard/Header";
import axios from "axios";
import { useSnackbar } from "notistack";
import { LinearProgress } from "@mui/joy";

export default function Invite() {
  const [email, setEmail] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);


  const handleInvite = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/invite`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false); // Stop loading
      enqueueSnackbar("Invitation sent successfully!", { variant: "success" });
      setEmail(""); // Clear the input after successful operation
    } catch (error) {
      setLoading(false); // Stop loading
      enqueueSnackbar("Failed to send invitation.", { variant: "error" });
      console.error(
        "Error sending invitation:",
        error.response?.data || error.message
      );
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
                Users
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
                <Typography level="title-md">Invite new team member</Typography>
                <Typography level="body-sm">
                  Invite a new user by sending an email Invitation
                </Typography>
              </Box>
              <Divider />
              <form onSubmit={handleInvite}>
                <Stack
                  direction="row"
                  spacing={3}
                  sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
                >
                  <Stack spacing={2} sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={2}>
                      <FormControl sx={{ flexGrow: 1 }}>
                        <FormLabel>Email</FormLabel>
                        <Input
                          size="sm"
                          type="email"
                          startDecorator={<EmailRoundedIcon />}
                          placeholder="email"
                          value={email} // Keep this prop for controlled component
                          onChange={(e) => setEmail(e.target.value)} // Update the state on change
                          required
                          sx={{ flexGrow: 1 }}
                        />
                      </FormControl>
                    </Stack>
                  </Stack>
                </Stack>
                <CardOverflow
                  sx={{ borderTop: "1px solid", borderColor: "divider" }}
                >
                  <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
                    <Button type="submit" size="sm" variant="solid" disabled={loading}>
                      Invite
                    </Button>
                  </CardActions>
                </CardOverflow>
              </form>
              {loading && <LinearProgress />}
            </Card>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
