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

export default function ContactsList(props) {
  const [order, setOrder] = React.useState("desc");
  const [contacts, setContacts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [constactData, setContactData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [cv, setCV] = React.useState("");
  const [cvopen, setCVOpen] = React.useState(false);
  const [categorisationOpen, setCategorisationOpen] = React.useState(false);
  const [status, setStatus] = React.useState("active");
  const [categories, setCategories] = React.useState({
    active: "all",
    list: [],
  });
  const [selected, setSelected] = React.useState([]);
  const [activeContact, setActiveContact] = React.useState({});
  const { open, setOpen } = props;

  // Function to fetch contacts data
  const fetchContacts = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/contacts?status=${status}&category=${
          categories.active
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.contacts);
      return response.data.contacts;
    } catch (error) {
      return [];
    }
  }, [status, categories.active]);

  const handleCVUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCV(file);
    }
  };

  const captureInput = (event) => {
    let details = constactData;
    details[event.target.name] = event.target.value;

    setContactData(details);
  };

  const validateForm = () => {
    let valid = true;
    let errorFields = {};
    if (!constactData.name) {
      valid = false;
      errorFields["name"] = "Name is required";
    }

    if (!constactData.email) {
      valid = false;
      errorFields["email"] = "Email address is required";
    }

    if (!constactData.telephone) {
      valid = false;
      errorFields["telephone"] = "Telephone no is required";
    }

    if (!constactData.address) {
      valid = false;
      errorFields["address"] = "Address is required";
    }

    if (cv === "") {
      valid = false;
      errorFields["cv"] = "CV is required";
    }

    setErrors(errorFields);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("name", constactData.name);
    formData.append("email", constactData.email);
    formData.append("telephone", constactData.telephone);
    formData.append("address", constactData.address);
    formData.append("cv", cv); // Append the file

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/add-contact`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      enqueueSnackbar("Contact added successfully", { variant: "success" });
      fetchAndSetContacts();
      setOpen(false);
    } catch (error) {
      enqueueSnackbar("Error registering contact", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchAndSetContacts = React.useCallback(async () => {
    const fetchedContacts = await fetchContacts();
    setContacts(fetchedContacts);
  }, [fetchContacts]);

  const fetchCategories = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/categories`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.categories;
    } catch (error) {
      return [];
    }
  }, []);

  const fetchAndSetCategories = React.useCallback(async () => {
    const categoryList = await fetchCategories();
    setCategories({
      active: "all",
      list: categoryList,
    });
  }, [fetchCategories]);

  React.useEffect(() => {
    fetchAndSetContacts();
    fetchAndSetCategories();
  }, [fetchAndSetContacts, fetchAndSetCategories]);

  const openCV = (contact) => {
    for (var index in contact.files) {
      if (contact.files[index]["file_type"] === "CV") {
        setCV(
          `${import.meta.env.VITE_FILES_SERVER}/${
            contact.files[index]["file_url"]
          }`
        );
        setCVOpen(true);
        break;
      }
    }
  };

  const deactivateContact = async (contact) => {
    const token = localStorage.getItem("token");
    await axios.post(
      import.meta.env.VITE_API_URL + "/deactivate-contact",
      { id: contact.id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    enqueueSnackbar("Contact deactivated successfully", { variant: "warning" });
    fetchAndSetContacts();
  };

  const getValues = (value) => {
    if (selected.includes(value)) {
      let newVals = [];
      let currentSelection = selected;
      currentSelection.forEach((categoryId) => {
        if (categoryId !== value) {
          newVals.push(categoryId);
        }
      });

      setSelected(newVals);
    } else {
      let currentSelection = selected;
      currentSelection.push(value);
      setSelected(currentSelection);
    }
  };

  const openCategorisationForm = (contact) => {
    let currentSelection = [];
    contact.categories.forEach((category) => {
      currentSelection.push(category.id);
    });
    setSelected(currentSelection);

    setCategorisationOpen(true);
    setActiveContact(contact);
  };

  const submitCategorisation = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      await axios.post(
        import.meta.env.VITE_API_URL + "/add-contact-categorisation",
        {
          id: activeContact.id,
          categories: selected,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      enqueueSnackbar("Categorisation updated successfully", {
        variant: "success",
      });
      fetchAndSetContacts();
      setCategorisationOpen(false);
    } catch (error) {
      enqueueSnackbar("Error saving categorisation", { variant: "error" });
    }
    setLoading(false);
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
      <FormControl size="sm">
        <FormLabel>Category</FormLabel>
        <Select size="sm" placeholder="All">
          <Option
            value="all"
            onClick={() => setCategories({ ...categories, active: "all" })}
          >
            All
          </Option>
          {stableSort(categories["list"], getComparator(order, "name")).map(
            (category) => (
              <Option
                key={category.id}
                value={category.id}
                onClick={() =>
                  setCategories({ ...categories, active: category.id })
                }
              >
                {category.name}
              </Option>
            )
          )}
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
          className="add-contact-model"
          open={open}
          onClose={() => setOpen(false)}
        >
          <ModalDialog aria-labelledby="filter-modal">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Create Contact
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Stack gap={4} sx={{ mt: 2 }}>
                <form>
                  <FormControl required>
                    <FormLabel>Contact Names</FormLabel>
                    <Input type="text" name="name" onInput={captureInput} />
                    <small className="text-danger">{errors.name}</small>
                  </FormControl>
                  <br />
                  <FormControl required>
                    <FormLabel>Email address</FormLabel>
                    <Input type="email" name="email" onInput={captureInput} />
                    <small className="text-danger">{errors.email}</small>
                  </FormControl>
                  <br />
                  <FormControl required>
                    <FormLabel>Telephone</FormLabel>
                    <Input
                      type="text"
                      name="telephone"
                      onInput={captureInput}
                    />
                    <small className="text-danger">{errors.telephone}</small>
                  </FormControl>
                  <br />
                  <FormControl required>
                    <FormLabel>Physical address</FormLabel>
                    <textarea
                      name="address"
                      rows="5"
                      required
                      onInput={captureInput}
                    ></textarea>
                    <small className="text-danger">{errors.address}</small>
                  </FormControl>
                  <br />
                  <FormControl required>
                    <FormLabel>Upload CV</FormLabel>
                    <input
                      type="file"
                      onChange={handleCVUpload}
                      accept="application/pdf"
                      name="cv"
                      required
                    />
                    <small className="text-danger">{errors.cv}</small>
                  </FormControl>
                  <br />
                  <Button onClick={handleSubmit} fullWidth disabled={loading}>
                    Save Contact Details
                  </Button>
                </form>
                {loading && <LinearProgress />}
              </Stack>
            </Sheet>
          </ModalDialog>
        </Modal>
        <Modal
          className="cv-file-model"
          open={cvopen}
          onClose={() => setCVOpen(false)}
        >
          <ModalDialog aria-labelledby="filter-modal">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Contact CV
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Stack gap={4} sx={{ mt: 2 }}>
                <iframe className="dialog-content" src={cv} />
              </Stack>
            </Sheet>
          </ModalDialog>
        </Modal>
        <Modal
          className="add-contact-model"
          open={categorisationOpen}
          onClose={() => setCategorisationOpen(false)}
        >
          <ModalDialog aria-labelledby="filter-modal">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Contact Categorisation -- {activeContact.name}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Stack gap={4} sx={{ mt: 2 }}>
                <Select
                  multiple
                  defaultValue={selected}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", gap: "0.25rem" }}>
                      {selected.map((selectedOption) => (
                        <Chip
                          key={selectedOption.id}
                          variant="soft"
                          color="primary"
                        >
                          {selectedOption.label}
                        </Chip>
                      ))}
                    </Box>
                  )}
                  sx={{
                    minWidth: "15rem",
                  }}
                  slotProps={{
                    listbox: {
                      sx: {
                        width: "100%",
                      },
                    },
                  }}
                >
                  {categories["list"].map((category) => (
                    <Option
                      key={category.id}
                      value={category.id}
                      onClick={() => getValues(category.id)}
                    >
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Stack>
              <Button
                onClick={submitCategorisation}
                fullWidth
                disabled={loading}
              >
                Save Details
              </Button>
              {loading && <LinearProgress />}
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
              <th style={{ width: 30, padding: "12px 6px" }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                  fontWeight="lg"
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    "& svg": {
                      transition: "0.2s",
                      transform:
                        order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
                    },
                  }}
                >
                  #
                </Link>
              </th>
              <th>Names</th>
              <th>Contacts</th>
              <th>Address</th>
              <th>Status</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stableSort(contacts, getComparator(order, "id")).map(
              (contact, key) => (
                <tr key={contact.id}>
                  <td>
                    <Typography level="body-xs">{key + 1}</Typography>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <div>
                        <Typography level="body-xs">{contact.name}</Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <div>
                        <Typography level="body-xs">
                          {contact.telephone}
                        </Typography>
                        <Typography level="body-xs">
                          <a href={`mailto:${contact.email}`}>
                            {contact.email}
                          </a>
                        </Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <div>
                        <Typography level="body-xs">
                          {contact.address}
                        </Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Chip
                      variant="soft"
                      size="sm"
                      startDecorator={<AutorenewRoundedIcon />}
                      color={contact.status === "active" ? "success" : "danger"}
                    >
                      {contact.status === "active" ? "Active" : "Deactivated"}
                    </Chip>
                  </td>
                  <td>
                    <Typography level="body-xs">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </Typography>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Link level="body-xs" component="button">
                        {" "}
                        Action{" "}
                      </Link>
                      <Dropdown>
                        <MenuButton
                          slots={{ root: IconButton }}
                          slotProps={{
                            root: {
                              variant: "plain",
                              color: "neutral",
                              size: "sm",
                            },
                          }}
                        >
                          <MoreHorizRoundedIcon />
                        </MenuButton>
                        <Menu size="sm" sx={{ minWidth: 140 }}>
                          <MenuItem
                            onClick={() => {
                              openCV(contact);
                            }}
                          >
                            CV
                          </MenuItem>
                          <MenuItem
                            onClick={() => openCategorisationForm(contact)}
                          >
                            Categorisation
                          </MenuItem>
                          <Divider />
                          <MenuItem
                            color="danger"
                            onClick={() => {
                              deactivateContact(contact);
                            }}
                          >
                            Deactivate
                          </MenuItem>
                        </Menu>
                      </Dropdown>
                    </Box>
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

ContactsList.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
