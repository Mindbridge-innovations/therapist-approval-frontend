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
import PropTypes from "prop-types";

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

export default function TherapistsList(props) {
  const [order, setOrder] = React.useState("desc");
  const [therapists, setTherapists] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [therapistData, setTherapistData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [credential, setCredential] = React.useState("");
  const [credentialOpen, setCredentialOpen] = React.useState(false);
  const [status, setStatus] = React.useState("active");
  const { open, setOpen } = props;

  // Function to fetch therapists data
  const fetchTherapists = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/therapists`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return [];
    }
  }, []);

  const handleCredentialUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCredential(file);
    }
  };

  const captureInput = (event) => {
    let details = therapistData;
    details[event.target.name] = event.target.value;

    setTherapistData(details);
  };

  const validateForm = () => {
    let valid = true;
    let errorFields = {};
    if (!therapistData.firstName) {
      valid = false;
      errorFields["firstName"] = "First name is required";
    }

    if (!therapistData.lastName) {
      valid = false;
      errorFields["lastName"] = "Last name is required";
    }

    if (!therapistData.email) {
      valid = false;
      errorFields["email"] = "Email address is required";
    }

    if (!therapistData.phoneNumber) {
      valid = false;
      errorFields["phoneNumber"] = "Phone number is required";
    }

    if (credential === "") {
      valid = false;
      errorFields["credential"] = "Credential is required";
    }

    setErrors(errorFields);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("firstName", therapistData.firstName);
    formData.append("lastName", therapistData.lastName);
    formData.append("email", therapistData.email);
    formData.append("phoneNumber", therapistData.phoneNumber);
    formData.append("credential", credential); // Append the file

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/add-therapist`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      enqueueSnackbar("Therapist added successfully", { variant: "success" });
      fetchAndSetTherapists();
      setOpen(false);
    } catch (error) {
      enqueueSnackbar("Error registering therapist", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchAndSetTherapists = React.useCallback(async () => {
    const fetchedTherapists = await fetchTherapists();
    setTherapists(fetchedTherapists);
  }, [fetchTherapists]);

  React.useEffect(() => {
    fetchAndSetTherapists();
  }, [fetchAndSetTherapists]);

  const openCredential = (therapist) => {
    setCredential(therapist.fileUrl);
    setCredentialOpen(true);
  };

  const deactivateTherapist = async (therapist) => {
    const token = localStorage.getItem("token");
    await axios.post(
      import.meta.env.VITE_API_URL + "/deactivate-therapist",
      { id: therapist.userId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    enqueueSnackbar("Therapist deactivated successfully", {
      variant: "warning",
    });
    fetchAndSetTherapists();
  };

  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <FormLabel>Status</FormLabel>
        <Select
          size="sm"
          placeholder="Filter by status"
          slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
          value={status}
        >
          <Option value="active" selected onClick={() => setStatus("active")}>
            Active
          </Option>
          <Option value="deactivated" onClick={() => setStatus("deactivated")}>
            Deactivated
          </Option>
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
        <Modal
          className="add-therapist-model"
          open={open}
          onClose={() => setOpen(false)}
        >
          <ModalDialog aria-labelledby="filter-modal">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Create Therapist
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Stack gap={4} sx={{ mt: 2 }}>
                <form>
                  <FormControl required>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type="text"
                      name="firstName"
                      onInput={captureInput}
                    />
                    <small className="text-danger">{errors.firstName}</small>
                  </FormControl>
                  <br />
                  <FormControl required>
                    <FormLabel>Last Name</FormLabel>
                    <Input type="text" name="lastName" onInput={captureInput} />
                    <small className="text-danger">{errors.lastName}</small>
                  </FormControl>
                  <br />
                  <FormControl required>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" name="email" onInput={captureInput} />
                    <small className="text-danger">{errors.email}</small>
                  </FormControl>
                  <br />
                  <FormControl required>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      type="tel"
                      name="phoneNumber"
                      onInput={captureInput}
                    />
                    <small className="text-danger">{errors.phoneNumber}</small>
                  </FormControl>
                  <br />
                  <FormControl required>
                    <FormLabel>Credential</FormLabel>
                    <Input
                      type="file"
                      name="credential"
                      onChange={handleCredentialUpload}
                    />
                    <small className="text-danger">{errors.credential}</small>
                  </FormControl>
                </form>
              </Stack>
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button
                  variant="plain"
                  color="neutral"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Submit</Button>
              </Box>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "xs",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": { minWidth: { xs: "120px", md: "160px" } },
        }}
      >
        <FormControl size="sm" sx={{ flexGrow: 1 }}>
          <FormLabel>Search therapists</FormLabel>
          <Input placeholder="Search" startDecorator={<SearchIcon />} />
        </FormControl>
        {renderFilters()}
        <Dropdown>
          <MenuButton
            variant="outlined"
            color="neutral"
            size="sm"
            startDecorator={<FilterAltIcon />}
            endDecorator={<ArrowDropDownIcon />}
          >
            Filters
          </MenuButton>
          <Menu
            size="sm"
            aria-labelledby="filter-button"
            sx={{ minWidth: 180 }}
          >
            <MenuItem>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  size="sm"
                  placeholder="Filter by status"
                  slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
                  value={status}
                >
                  <Option
                    value="active"
                    selected
                    onClick={() => setStatus("active")}
                  >
                    Active
                  </Option>
                  <Option
                    value="deactivated"
                    onClick={() => setStatus("deactivated")}
                  >
                    Deactivated
                  </Option>
                </Select>
              </FormControl>
            </MenuItem>
          </Menu>
        </Dropdown>
      </Box>
      <Sheet
        className="TherapistTableContainer"
        variant="outlined"
        sx={{
          width: "100%",
          flex: 1,
          borderRadius: "md",
          height: "auto",
          overflow: "auto",
          minHeight: 0,
        }}
      >
        {loading && (
          <LinearProgress
            sx={{ width: "100%", position: "absolute", top: "-2px" }}
          />
        )}
        <Table
          aria-labelledby="tableTitle"
          hoverRow
          sx={{
            "--TableCell-headBackground": (theme) =>
              theme.vars.palette.background.level1,
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground": (theme) =>
              theme.vars.palette.background.level1,
            "--TableRow-selectedBackground": (theme) =>
              theme.vars.palette.background.level1,
          }}
        >
          <thead>
            <tr>
              <th style={{ width: "20%", paddingLeft: 0 }}>Therapist</th>
              <th style={{ width: "20%", paddingLeft: 0 }}>Email</th>
              <th style={{ width: "20%", paddingLeft: 0 }}>Phone Number</th>
              <th style={{ width: "10%", textAlign: "center", paddingLeft: 0 }}>
                Actions
              </th>
              <th style={{ width: "10%", paddingLeft: 0 }}>View Credential</th>
            </tr>
          </thead>
          <tbody>
            {stableSort(therapists, getComparator(order, "createdAt")).map(
              (row) => (
                <tr key={row.therapistId}>
                  <td>
                    <Typography
                      fontWeight="md"
                      textColor="text.primary"
                      sx={{ display: "block" }}
                    >
                      {row.firstName} {row.lastName}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body2">{row.email}</Typography>
                  </td>
                  <td>
                    <Typography level="body2">{row.phoneNumber}</Typography>
                  </td>
                  <td>
                    <Dropdown>
                      <MenuButton
                        variant="plain"
                        color="neutral"
                        size="sm"
                        startDecorator={<MoreHorizRoundedIcon />}
                      />
                      <Menu
                        size="sm"
                        aria-labelledby="more-button"
                        sx={{ minWidth: 180 }}
                      >
                        <MenuItem>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => openCredential(row)}
                          >
                            View Credential
                          </Button>
                        </MenuItem>
                        <MenuItem>
                          <Button
                            variant="outlined"
                            color="danger"
                            onClick={() => deactivateTherapist(row)}
                          >
                            Deactivate Therapist
                          </Button>
                        </MenuItem>
                      </Menu>
                    </Dropdown>
                  </td>
                  <td>
                    <Link
                      level="body2"
                      href={row.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()} // Prevents opening the menu when clicking the link
                    >
                      View Credential
                    </Link>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </Sheet>
    </React.Fragment>
  );
}

TherapistsList.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
