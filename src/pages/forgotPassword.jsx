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
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import axios from "axios";
import { useSnackbar } from "notistack";

export default function ForgotPassword() {
  const [email, setEmail] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/request-password-reset`,
        { email }
      );
      enqueueSnackbar("Email sent successfully!", { variant: "success" });
      setEmail(""); // Clear the input after successful operation
    } catch (error) {
      enqueueSnackbar("Failed to send email.", { variant: "error" });
      console.error(
        "Error sending email:",
        error.response?.data || error.message
      );
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
          Reset your password by entering your email address below. You will receive a link to create a new password via email.
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
            <Button type="submit" size="sm" variant="solid">
              Send
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
