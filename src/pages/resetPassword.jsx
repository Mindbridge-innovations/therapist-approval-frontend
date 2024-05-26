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
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate

export default function ResetPassword() {
  const [password, setPassword] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate(); // Create an instance of useNavigate
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      enqueueSnackbar("Invalid or missing token.", { variant: "error" });
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/reset-password`,
        { token, newPassword: password }
      );
      enqueueSnackbar("Password Reset successfully!", { variant: "success" });
      setPassword("");
      navigate('/login');
    } catch (error) {
      enqueueSnackbar("Failed to reset password.", { variant: "error" });
      console.error("Error resetting password:", error.response?.data || error.message);
    }
  };

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
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
            height: "100vh",
            justifyContent: "center", // Centers content vertically
            alignItems: "center", // Centers content horizontally
          }}
        >
          <Card sx={{ width: "100%", maxWidth: "800px" }}>
            <Box sx={{ mb: 1 }}>
              <Typography level="title-md">Reset Password</Typography>
              <Typography level="body-sm">
                Reset your password by entering a new password.
              </Typography>
            </Box>
            <Divider />
            <form onSubmit={handleSubmit}>
              <Stack
                direction="row"
                spacing={3}
                sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
              >
                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                  <Stack direction="row" spacing={2}>
                    <FormControl sx={{ flexGrow: 1 }}>
                      <FormLabel>Password</FormLabel>
                      <Input
                        size="sm"
                        type="password"
                        startDecorator={<PasswordRoundedIcon />}
                        placeholder="password"
                        value={password} // Keep this prop for controlled component
                        onChange={(e) => setPassword(e.target.value)} // Update the state on change
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
                  <Button type="submit" size="sm" variant="solid">
                    Reset
                  </Button>
                </CardActions>
              </CardOverflow>
            </form>
          </Card>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}