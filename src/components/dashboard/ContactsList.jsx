/* eslint-disable no-unused-vars */
import * as React from "react";
import axios from "axios";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
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
import LinearProgress from "@mui/joy/LinearProgress";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import Chip from "@mui/joy/Chip";
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
  const [reason, setReason] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedTherapist, setSelectedTherapist] = React.useState(null);
  const { open, setOpen } = props;
  const [documentModalOpen, setDocumentModalOpen] = React.useState(false);
  const [documentUrl, setDocumentUrl] = React.useState("");

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

  const handleActionClick = (therapist, action) => {
    setSelectedTherapist({ ...therapist, action: action });
    setModalOpen(true);
  };

  const handleModalSubmit = async () => {
    if (!selectedTherapist) return;

    const token = localStorage.getItem("token");
    const approve = selectedTherapist.action === "approve";

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/therapist-approval/${selectedTherapist.userId}`,
        {
          approve: approve,
          reason: reason,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      enqueueSnackbar(
        `Therapist ${selectedTherapist.action}d successfully`,
        { variant: "success" }
      );
      fetchAndSetTherapists();
      setModalOpen(false);
      setReason(""); // Reset the reason after submission
    } catch (error) {
      enqueueSnackbar(`Error during ${selectedTherapist.action}`, {
        variant: "error",
      });
      console.error(`Error updating therapist approval status: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentClick = (url) => {
    setDocumentUrl(url);
    setDocumentModalOpen(true);
  };

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
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <ModalDialog aria-labelledby="reason-modal">
            <ModalClose onClick={() => setModalOpen(false)} />
            <Typography id="reason-modal" level="h2">
              {selectedTherapist?.action === "approve" ? "Approve" : "Reject"} Therapist
            </Typography>
            <Divider sx={{ my: 2 }} />
            <FormControl required>
              <FormLabel>Reason</FormLabel>
              <Input
                type="text"
                name="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </FormControl>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", pt: 2 }}>
              <Button variant="plain" color="neutral" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleModalSubmit}>Send</Button>
            </Box>
          </ModalDialog>
        </Modal>
      </Sheet>
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
              <th style={{ width: "30%", paddingLeft: 0 }}>Therapist</th>
              <th style={{ width: "20%", paddingLeft: 0 }}>Approved</th>
              <th style={{ width: "20%", paddingLeft: 0 }}>
                Actions
              </th>
              <th style={{ width: "20%", paddingLeft: 0 }}>View Credential</th>
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
                    <Typography level="body2">{row.email}</Typography>
                    <Typography level="body2">{row.phoneNumber}</Typography>
                  </td>
                  <td>
                    <Chip
                      variant="outlined"
                      color={row.isApproved ? "success" : "danger"}
                    >
                      {row.isApproved ? "Approved" : "Not Approved"}
                    </Chip>
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
                            color="success"
                            onClick={() => handleActionClick(row, "approve")}
                          >
                            Approve
                          </Button>
                        </MenuItem>
                        <MenuItem>
                          <Button
                            variant="outlined"
                            color="danger"
                            onClick={() => handleActionClick(row, "reject")}
                          >
                            Reject
                          </Button>
                        </MenuItem>
                      </Menu>
                    </Dropdown>
                  </td>
                  <td>
                    <Button
                      level="body2"
                      onClick={() => handleDocumentClick(row.fileUrl)}
                    >
                      View Credential
                    </Button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </Sheet>

      <Modal open={documentModalOpen} onClose={() => setDocumentModalOpen(false)}>
        <ModalDialog
          aria-labelledby="document-modal"
          sx={{
            maxWidth: { xs: "100%", sm: "100%", md: "100%" },
            height: { xs: "100%", sm: "100%", md: "100%" },
          }}
        >
          <ModalClose />
          <Typography id="document-modal" level="h2">
            Credential Document
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
            <iframe
              src={documentUrl}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Credential Document"
            />
          </Box>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}

TherapistsList.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
