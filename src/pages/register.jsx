import * as React from "react";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
//import Checkbox from "@mui/joy/Checkbox";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel, { formLabelClasses } from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import GoogleIcon from "./GoogleIcon";
//import Key from "@mui/icons-material/Key";
import LinearProgress from "@mui/joy/LinearProgress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSnackbar } from "notistack";

/* eslint-disable react/prop-types */
function ColorSchemeToggle(props) {
  const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <IconButton size="sm" variant="outlined" color="neutral" disabled />;
  }
  return (
    <IconButton
      id="toggle-mode"
      size="sm"
      variant="outlined"
      color="neutral"
      aria-label="toggle light/dark mode"
      {...other}
      onClick={(event) => {
        if (mode === "light") {
          setMode("dark");
        } else {
          setMode("light");
        }
        onClick?.(event);
      }}
    >
      {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

export default function RegistrationPage() {
  const minLength = 12;
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const token = urlSearchParams.get("token");
  const [value, setValue] = React.useState("");
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get("email"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      username: formData.get("username"),
      password: formData.get("password"),
      token: formData.get("token"),
    };

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/register",
        data
      );
      setLoading(false); // Stop loading
      enqueueSnackbar("Registered Successfully", { variant: "success" });
      enqueueSnackbar("Check email for account confirmation", {
        variant: "info",
      });
      console.log(response.data);
      navigate("/login");
      // Handle success - you might want to redirect to the login page or show a success message
    } catch (error) {
      setLoading(false); // Stop loading
      enqueueSnackbar("Error registering user", { variant: "error" });
      console.error("Error registering user:", error.response.data);
      // Handle errors - you might want to show an error message to the user
    }
  };
  return (
    <CssVarsProvider defaultMode="dark" disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Collapsed-breakpoint": "769px",
            "--Cover-width": "50vw",
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s",
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width:
            "clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) -   100vw) *   999,   100vw)",
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) +   0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255   255   255 /   0.2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19   19   24 /   0.4)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width:
              "clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) -   100vw) *   999,   100%)",
            maxWidth: "100%",
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{
              py: 3,
              display: "flex",
              alignItems: "left",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
              <IconButton variant="soft" color="primary" size="sm">
                <BadgeRoundedIcon />
              </IconButton>
              <Typography level="title-lg">Cente Contacts</Typography>
            </Box>
            <ColorSchemeToggle />
          </Box>
          <Box
            component="main"
            sx={{
              my: "auto",
              py: 2,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "sm",
              "& form": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
              },
              [`& .${formLabelClasses.asterisk}`]: {
                visibility: "hidden",
              },
            }}
          >
            <Stack gap={4} sx={{ mb: 2 }}>
              <Stack gap={1}>
                <Typography component="h1" level="h3">
                  Sign Up
                </Typography>
                <Typography level="body-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    style={{ textDecoration: "none", color: "blue" }}
                  >
                    Sign in!
                  </Link>
                </Typography>
              </Stack>
              <Button
                variant="soft"
                color="neutral"
                fullWidth
                startDecorator={<GoogleIcon />}
              >
                Continue with Google
              </Button>
            </Stack>
            <Divider
              sx={(theme) => ({
                [theme.getColorSchemeSelector("light")]: {
                  color: { xs: "#FFF", md: "text.tertiary" },
                  "--Divider-lineColor": {
                    xs: "#FFF",
                    md: "var(--joy-palette-divider)",
                  },
                },
              })}
            >
              or
            </Divider>
            <Stack gap={4} sx={{ mt: 2 }}>
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="token" value={token} />
                <FormControl required>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" name="email" />
                </FormControl>
                <FormControl required>
                  <FormLabel>First Name</FormLabel>
                  <Input type="text" name="firstName" />
                </FormControl>
                <FormControl required>
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text" name="lastName" />
                </FormControl>
                <FormControl required>
                  <FormLabel>Username</FormLabel>
                  <Input type="text" name="username" />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Stack
                    spacing={0.5}
                    sx={{
                      "--hue": Math.min(value.length * 10, 120),
                    }}
                  >
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      onChange={(e) => setValue(e.target.value)}
                      endDecorator={
                        <IconButton
                          size="sm"
                          variant="outlined"
                          color="neutral"
                          onClick={togglePasswordVisibility}
                          sx={{ border: "none" }}
                        >
                          {passwordVisible ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      }
                    />

                    <LinearProgress
                      determinate
                      size="sm"
                      value={Math.min((value.length * 100) / minLength, 100)}
                      sx={{
                        bgcolor: "background.level3",
                        color: "hsl(var(--hue) 80% 40%)",
                      }}
                    />
                    <Typography
                      level="body-xs"
                      sx={{
                        alignSelf: "flex-end",
                        color: "hsl(var(--hue) 80% 30%)",
                      }}
                    >
                      {value.length < 3 && "Very weak"}
                      {value.length >= 3 && value.length < 6 && "Weak"}
                      {value.length >= 6 && value.length < 10 && "Strong"}
                      {value.length >= 10 && "Very strong"}
                    </Typography>
                  </Stack>
                </FormControl>
                <Button type="submit" fullWidth disabled={loading}>
                  Sign Up
                </Button>
              </form>
              {loading && <LinearProgress />}
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" textAlign="center">
              © Cente Tech {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: "clamp(0px, (100vw - var(--Collapsed-breakpoint)) *   999,   100vw - var(--Cover-width))",
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) +   0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage:
              "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)",
          },
        })}
      />
    </CssVarsProvider>
  );
}
