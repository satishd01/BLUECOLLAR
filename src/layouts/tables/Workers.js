import { useEffect, useState } from "react";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Grid,
  Card,
  Box,
  IconButton,
  InputAdornment,
  Checkbox,
  ListItemText,
  Autocomplete,
} from "@mui/material";

// BLISSIQ ADMIN React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// BLISSIQ ADMIN React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newWorker, setNewWorker] = useState({
    name: "",
    image: null,
    service_charge: 0,
    category_id: null,
    services: [],
    available_slots: [], // Ensure this is initialized as an empty array
    vendor_id: null,
  });
  const [servicesOptions, setServicesOptions] = useState([
    "plumber", "electric", "cleaning", "furniture", "wiring", "Car Repairing", "Bike Repairing", "cleaner"
  ]);

  // Fetch workers data
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch("https://bluecollar.sndktech.online/worker/list");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data && data.totalWorkers) {
          setWorkers(data.workers);
        }
      } catch (error) {
        console.error("Error fetching workers:", error);
        alert("Failed to fetch workers. Please check your network connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const handleCreateWorker = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newWorker.name);
      formData.append('service_charge', newWorker.service_charge);
      formData.append('category_id', newWorker.category_id);
      if (newWorker.image) {
        formData.append('image', newWorker.image);
      }
      formData.append('services', JSON.stringify(newWorker.services));
      formData.append('available_slots', JSON.stringify(newWorker.available_slots));
      formData.append('vendor_id', newWorker.vendor_id);

      const response = await fetch("https://bluecollar.sndktech.online/worker/save", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();

      if (response.ok) {
        setWorkers((prev) => [
          ...prev,
          {
            ...result.data,
          },
        ]);
        setOpenModal(false);
        setNewWorker({
          name: "",
          image: null,
          service_charge: 0,
          category_id: null,
          services: [],
          available_slots: [],
          vendor_id: null,
        });
        alert("Worker created successfully!");
      } else {
        alert(result.error || "Failed to create worker");
      }
    } catch (error) {
      console.error("Error creating worker:", error);
      alert("Failed to create worker. Please check your network connection and try again.");
    }
  };

  const handleUpdateWorker = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newWorker.name);
      formData.append('service_charge', newWorker.service_charge);
      formData.append('category_id', newWorker.category_id);
      if (newWorker.image) {
        formData.append('image', newWorker.image);
      }
      formData.append('services', JSON.stringify(newWorker.services));
      formData.append('available_slots', JSON.stringify(newWorker.available_slots));
      formData.append('vendor_id', newWorker.vendor_id);

      const response = await fetch(
        `https://bluecollar.sndktech.online/worker/list/${newWorker.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();

      if (response.ok) {
        setWorkers((prevWorkers) =>
          prevWorkers.map((worker) =>
            worker.id === newWorker.id ? { ...worker, ...newWorker } : worker
          )
        );
        setOpenModal(false);
        setNewWorker({
          name: "",
          image: null,
          service_charge: 0,
          category_id: null,
          services: [],
          available_slots: [],
          vendor_id: null,
        });
        alert("Worker updated successfully!");
      } else {
        alert(result.error || "Failed to update worker");
      }
    } catch (error) {
      console.error("Error updating worker:", error);
      alert("Failed to update worker. Please check your network connection and try again.");
    }
  };

  const handleDeleteWorker = async (workerId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this worker?");
    if (confirmDelete) {
      try {
        const response = await fetch(
          `https://bluecollar.sndktech.online/worker/delete/${workerId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        if (result.message) {
          setWorkers((prevWorkers) =>
            prevWorkers.filter((worker) => worker.id !== workerId)
          );
          alert("Worker deleted successfully!");
        } else {
          alert(result.error || "Failed to delete worker");
        }
      } catch (error) {
        console.error("Error deleting worker:", error);
        alert("Failed to delete worker. Please check your network connection and try again.");
      }
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'image') {
      setNewWorker({ ...newWorker, [e.target.name]: e.target.files[0] });
    } else {
      setNewWorker({ ...newWorker, [e.target.name]: e.target.value });
    }
  };

  const handleOpenModal = (worker = null) => {
    if (worker) {
      setNewWorker({
        ...worker,
        available_slots: worker.available_slots || [], // Ensure available_slots is an array
      });
    } else {
      setNewWorker({
        name: "",
        image: null,
        service_charge: 0,
        category_id: null,
        services: [],
        available_slots: [],
        vendor_id: null,
      });
    }
    setOpenModal(true);
  };

  const handleServiceChange = (event, value) => {
    setNewWorker({ ...newWorker, services: value });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                  <MDTypography variant="h6" color="white">
                    Loading Workers Data...
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "name" },
    {
      Header: "Image",
      accessor: "image",
      Cell: ({ row }) => (
        <img
          src={row.original.image}
          alt={row.original.name}
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
        />
      ),
    },
    { Header: "Service Charge", accessor: "service_charge" },
    { Header: "Category ID", accessor: "category_id" },
    {
      Header: "Services",
      accessor: "services",
      Cell: ({ row }) => (
        <span>{row.original.services.join(', ')}</span>
      ),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
          {/* <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setNewWorker(row.original);
              setOpenModal(true);
            }}
          >
            Edit
          </Button> */}
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteWorker(row.original.id)}
            sx={{ marginLeft: 1 }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h6" color="white">
                  Workers Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <DataTable table={{ columns, rows: workers }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
                </MDBox>
                <Button
                  variant="contained"
                  color="white"
                  sx={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    backgroundColor: "#f44336",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#d32f2f",
                    },
                  }}
                  onClick={() => handleOpenModal()}
                >
                  Create Worker
                </Button>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Modal for creating or editing worker */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{newWorker.id ? "Edit Worker" : "Create Worker"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            name="name"
            value={newWorker.name}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Service Charge"
            fullWidth
            name="service_charge"
            type="number"
            value={newWorker.service_charge}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Category ID"
            fullWidth
            name="category_id"
            type="number"
            value={newWorker.category_id}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Vendor ID"
            fullWidth
            name="vendor_id"
            type="number"
            value={newWorker.vendor_id}
            onChange={handleInputChange}
            margin="normal"
          />
          <Autocomplete
            multiple
            options={servicesOptions}
            value={newWorker.services}
            onChange={handleServiceChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Services"
                placeholder="Select services"
                fullWidth
                margin="normal"
              />
            )}
          />
          {/* <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Available Slots</Typography>
            {(newWorker.available_slots || []).map((slot, index) => ( // Ensure available_slots is an array
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Date"
                  fullWidth
                  name={`available_slots[${index}].date`}
                  type="date"
                  value={slot.date || ''}
                  onChange={(e) => {
                    const newSlots = [...newWorker.available_slots];
                    newSlots[index].date = e.target.value;
                    setNewWorker({ ...newWorker, available_slots: newSlots });
                  }}
                  margin="normal"
                />
                <TextField
                  label="Start Time"
                  fullWidth
                  name={`available_slots[${index}].startTime`}
                  type="time"
                  value={slot.startTime || ''}
                  onChange={(e) => {
                    const newSlots = [...newWorker.available_slots];
                    newSlots[index].startTime = e.target.value;
                    setNewWorker({ ...newWorker, available_slots: newSlots });
                  }}
                  margin="normal"
                />
                <TextField
                  label="End Time"
                  fullWidth
                  name={`available_slots[${index}].endTime`}
                  type="time"
                  value={slot.endTime || ''}
                  onChange={(e) => {
                    const newSlots = [...newWorker.available_slots];
                    newSlots[index].endTime = e.target.value;
                    setNewWorker({ ...newWorker, available_slots: newSlots });
                  }}
                  margin="normal"
                />
                <IconButton onClick={() => {
                  const newSlots = [...newWorker.available_slots];
                  newSlots.splice(index, 1);
                  setNewWorker({ ...newWorker, available_slots: newSlots });
                }}>
                  <Typography variant="body2" color="error">
                    Remove
                  </Typography>
                </IconButton>
              </Box>
            ))}
            <Button variant="contained" color="primary" onClick={() => {
              const newSlots = [...newWorker.available_slots, { date: '', startTime: '', endTime: '' }];
              setNewWorker({ ...newWorker, available_slots: newSlots });
            }}>
              Add Slot
            </Button>
          </Box> */}
          <input
            type="file"
            name="image"
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={newWorker.id ? handleUpdateWorker : handleCreateWorker} color="primary">
            {newWorker.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Workers;