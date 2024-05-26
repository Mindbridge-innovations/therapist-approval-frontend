import * as React from "react";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import ArrowForward from "@mui/icons-material/ArrowForward";
import TwoSidedLayout from "../components/TwoSidedLayout";
import { useNavigate } from "react-router-dom";

export default function HeroLeft01() {
  const navigate = useNavigate();
  return (
    <TwoSidedLayout>
      <Typography color="primary" fontSize="lg" fontWeight="lg">
        Empower Your Connections
      </Typography>
      <Typography
        level="h1"
        fontWeight="xl"
        fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
      >
        Streamlining Customer Engagement
      </Typography>
      <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg">
      Secure and efficient way to access and manage customer contact information, enhancing collaboration and customer service excellence.
      </Typography>
      <Button
        size="lg"
        onClick={() => navigate("/login")}
        endDecorator={<ArrowForward fontSize="xl" />}
      >
        Log In
      </Button>
      <Typography
        level="body-xs"
        sx={{
          position: "absolute",
          top: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        Cente Contacts
      </Typography>
    </TwoSidedLayout>
  );
}
