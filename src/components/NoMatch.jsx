import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const NoMatch = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Roboto, sans-serif", // Use Roboto font
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p:  4,
          backgroundColor: "white",
          borderRadius:  4,
          boxShadow: "0px  4px  10px rgba(0,  0,  0,  0.1)",
          width: { xs: "80%", sm: "60%", md: "40%" }, // Responsive width
        }}
      >
        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="Page does not exist"
          width={280}
          height={280}
        />
        <Typography variant="h5" component="h1" align="center">
          404
        </Typography>
        <Typography variant="body1" align="center" my={2}>
          Looks like the page you are looking for has already been removed or has been replaced.
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate(-1)}
          aria-label="Go Back"
          sx={{
            mt:  2, // Add margin-top to the button
          }}
        >
          Go Back
        </Button>
      </Box>
    </Box>
  );
};

export default NoMatch;
