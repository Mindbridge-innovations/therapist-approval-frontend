import { Box, Typography, CircularProgress } from "@mui/material";
// trigger

export default function MaintenancePage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
          backgroundColor: "white",
          borderRadius: 4,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img
          src="https://cdn.pixabay.com/photo/2012/04/16/11/39/plumber-35611__340.png"
          alt="Maintenance"
          width={280}
          height={280}
        />
        <Typography variant="h5" component="h1" align="center">
          Maintenance in Progress
        </Typography>
        <Typography variant="body1" align="center" my={2}>
          We apologize for the inconvenience. The website is currently
          undergoing maintenance. Please check back later.
        </Typography>
        <CircularProgress color="primary" />
      </Box>
    </Box>
  );
}