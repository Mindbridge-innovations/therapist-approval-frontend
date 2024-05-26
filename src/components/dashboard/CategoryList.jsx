import * as React from "react";
import axios from "axios";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import Stack from "@mui/joy/Stack";
import LinearProgress from "@mui/joy/LinearProgress";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { useSnackbar } from "notistack";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export default function CategoryList(props) {
    const [order, setOrder] = React.useState("desc");
    const [categories, setCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [constactData, setCategoryData] = React.useState({});
    const [errors, setErrors] = React.useState({});
    const { enqueueSnackbar } = useSnackbar();
    const [cv, setCV] = React.useState('');
    const [cvopen, setCVOpen] = React.useState(false);
    const { open, setOpen } = props;

    // Function to fetch categories data
    const fetchCategories = async () => {
        try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');

            const response = await axios.get(import.meta.env.VITE_API_URL + '/categories', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data.categories;
        } catch (error) {
            return [];
        }
    };

    const captureInput = (event) => {
        let details = constactData;
        details[event.target.name] = event.target.value;

        setCategoryData(details);
    };

    const validateForm = () => {
        let valid = true;
        let errorFields = {};
        if (!constactData.name) {
            valid = false;
            errorFields['name'] = 'Name is required';
        }

        if (!constactData.description) {
            valid = false;
            errorFields['description'] = 'Description is required';
        }

        setErrors(errorFields);
        return valid;
    };

    const handleSubmit = async () => {
        try {
            if (validateForm()) {
                setLoading(true);

                const token = localStorage.getItem('token');
                await axios.post(
                    import.meta.env.VITE_API_URL + "/add-category",
                    constactData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    }
                );
                enqueueSnackbar("Category added successfully", { variant: "success" });
                fetchAndSetCategories();
                setOpen(false);
            }
        } catch (error) {
            enqueueSnackbar("Error registering category", { variant: "error" });
        }
        setLoading(false);
    }

    const fetchAndSetCategories = async () => {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
    };

    React.useEffect(() => {
        fetchAndSetCategories();
    }, []);

    const renderFilters = () => (
        <React.Fragment>
            <FormControl size="sm">
                <FormLabel>Status</FormLabel>
                <Select
                    size="sm"
                    placeholder="Filter by status"
                    slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
                >
                    <Option value="active">Active</Option>
                    <Option value="deactivated">Deactivated</Option>
                </Select>
            </FormControl>
        </React.Fragment>
    );
    return (
        <React.Fragment>
            <Sheet
                className="SearchAndFilters-mobile"
                sx={{
                    display: { xs: "flex", sm: "none" },
                    my: 1,
                    gap: 1,
                }}
            >
                <Input
                    size="sm"
                    placeholder="Search"
                    startDecorator={<SearchIcon />}
                    sx={{ flexGrow: 1 }}
                />
                <IconButton
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    onClick={() => setOpen(true)}
                >
                    <FilterAltIcon />
                </IconButton>
                <Modal className="add-contact-model" open={open} onClose={() => setOpen(false)}>
                    <ModalDialog aria-labelledby="filter-modal">
                        <ModalClose />
                        <Typography id="filter-modal" level="h2">
                            Create Category
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Stack gap={4} sx={{ mt: 2 }}>
                                <form>
                                    <FormControl required>
                                        <FormLabel>Category</FormLabel>
                                        <Input type="text" name="name" onInput={captureInput} />
                                        <small className="text-danger">{errors.name}</small>
                                    </FormControl><br />
                                    <FormControl required>
                                        <FormLabel>Description</FormLabel>
                                        <textarea name="description" rows='5' required onInput={captureInput}></textarea>
                                        <small className="text-danger">{errors.description}</small>
                                    </FormControl><br />
                                    <Button onClick={handleSubmit} fullWidth disabled={loading}>
                                        Save Category Details
                                    </Button>
                                </form>
                                {loading && <LinearProgress />}
                            </Stack>
                        </Sheet>
                    </ModalDialog>
                </Modal>
                <Modal className="cv-file-model" open={cvopen} onClose={() => setCVOpen(false)}>
                    <ModalDialog aria-labelledby="filter-modal">
                        <ModalClose />
                        <Typography id="filter-modal" level="h2">
                            Contact CV
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Stack gap={4} sx={{ mt: 2 }}>
                                <iframe className='dialog-content' src={cv} />
                            </Stack>
                        </Sheet>
                    </ModalDialog>
                </Modal>
            </Sheet>
            <Box
                className="SearchAndFilters-tabletUp"
                sx={{
                    borderRadius: "sm",
                    py: 2,
                    display: { xs: "none", sm: "flex" },
                    flexWrap: "wrap",
                    gap: 1.5,
                    "& > *": {
                        minWidth: { xs: "120px", md: "160px" },
                    },
                }}
            >
                <FormControl sx={{ flex: 1 }} size="sm">
                    <FormLabel>Search for contact</FormLabel>
                    <Input
                        size="sm"
                        placeholder="Search"
                        startDecorator={<SearchIcon />}
                    />
                </FormControl>
                {renderFilters()}
            </Box>
            <Sheet
                className="OrderTableContainer"
                variant="outlined"
                sx={{
                    display: { xs: "none", sm: "initial" },
                    width: "100%",
                    borderRadius: "sm",
                    flexShrink: 1,
                    overflow: "auto",
                    minHeight: 0,
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    stickyHeader
                    hoverRow
                    sx={{
                        "--TableCell-headBackground":
                            "var(--joy-palette-background-level1)",
                        "--Table-headerUnderlineThickness": "1px",
                        "--TableRow-hoverBackground":
                            "var(--joy-palette-background-level1)",
                        "--TableCell-paddingY": "4px",
                        "--TableCell-paddingX": "8px",
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ width: 30, padding: '12px 6px' }}>
                                <Link
                                    underline="none"
                                    color="primary"
                                    component="button"
                                    onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                                    fontWeight="lg"
                                    endDecorator={<ArrowDropDownIcon />}
                                    sx={{
                                        '& svg': {
                                            transition: '0.2s',
                                            transform:
                                                order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                                        },
                                    }}
                                >
                                    #
                                </Link>
                            </th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>No. of Consultants</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stableSort(categories, getComparator(order, 'id')).map((category, key) => (
                            <tr key={category.id}>
                                <td>
                                    <Typography level="body-xs">{key + 1}</Typography>
                                </td>
                                <td>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <div>
                                            <Typography level="body-xs">{category.name}</Typography>
                                        </div>
                                    </Box>
                                </td>
                                <td>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <div>
                                            <Typography level="body-xs">{category.description}</Typography>
                                        </div>
                                    </Box>
                                </td>
                                <td>
                                    <Chip variant="soft" size="m" color='info'>
                                        {category.contacts.length}
                                    </Chip>
                                </td>
                                <td>
                                    <Chip variant="soft" size="sm" startDecorator={<AutorenewRoundedIcon />} color={category.status === 'active' ? 'success' : 'danger'}>
                                        {category.status === 'active' ? 'Active' : 'Deactivated'}
                                    </Chip>
                                </td>
                                <td>
                                    <Typography level="body-xs">{new Date(category.createdAt).toLocaleDateString()}</Typography>
                                </td>
                                <td>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Link level="body-xs" component="button"> Action </Link>
                                        <Dropdown>
                                            <MenuButton
                                                slots={{ root: IconButton }}
                                                slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
                                            >
                                                <MoreHorizRoundedIcon />
                                            </MenuButton>
                                            <Menu size="sm" sx={{ minWidth: 140 }}>
                                                <MenuItem>Edit</MenuItem>
                                                <Divider />
                                                <MenuItem color="danger">Deactivate</MenuItem>
                                            </Menu>
                                        </Dropdown>
                                    </Box>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Sheet>
        </React.Fragment>
    );
}
