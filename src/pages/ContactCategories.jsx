import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import '../App.css';

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { CreateRounded } from "@mui/icons-material";

import Sidebar from "../components/dashboard/SideBar";
import CategoryList from "../components/dashboard/CategoryList";
import Header from "../components/dashboard/Header";

export default function ContactCategories() {
    const [open, setOpen] = React.useState(false);

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
                                Contact Categories
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
                        <Typography level="h2" component="h1">
                            Contact Categories
                        </Typography>
                        <Button
                            color="primary"
                            startDecorator={<CreateRounded />}
                            size="sm"
                            onClick={() => { setOpen(true) }}
                        >
                            Create Category
                        </Button>
                    </Box>
                    <CategoryList
                        setOpen={setOpen}
                        open={open}
                    />
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
