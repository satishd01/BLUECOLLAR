import { useEffect, useState } from "react";
import axios from "axios";
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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newBanner, setNewBanner] = useState({
    banner_type: "image",
    screen_time: 40,
    position: "Header",
    isActive: true,
    isDeleted: false,
    banner_url: null, // Initialize banner_url as null
  });
  const [modalKey, setModalKey] = useState(0); // Key to force reset the modal

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get("https://bluecollar.sndktech.online/api/banners/all/banners");
      console.log("Banners data:", response);
      if (response.data) {
        setBanners(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching banners:", error);
      alert("Failed to fetch banners data. Please check your network connection and try again.");
      setLoading(false);
    }
  };

  const handleCreateBanner = async () => {
    try {
      const formData = new FormData();
      formData.append('banner_type', newBanner.banner_type);
      formData.append('screen_time', newBanner.screen_time);
      formData.append('position', newBanner.position);
      formData.append('isActive', newBanner.isActive ? "TRUE" : "FALSE");
      if (newBanner.banner_url) {
        formData.append('banner', newBanner.banner_url);
      }

      const response = await axios.post("https://bluecollar.sndktech.online/api/banners/create", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        setBanners([...banners, response.data]);
        setOpenModal(false);
        setNewBanner({
          banner_type: "image",
          banner_url: null,
          screen_time: 40,
          position: "Header",
          isActive: true,
          isDeleted: false,
        });
        setModalKey(prevKey => prevKey + 1); 
        alert("Banner created successfully!");
      } else {
        alert(response.data.error || "Failed to create banner");
      }
    } catch (error) {
      alert("Error creating banner. Please check your network connection and try again.");
    }
  };

  const handleUpdateBanner = async () => {
    try {
      const formData = new FormData();
      formData.append('banner_type', newBanner.banner_type);
      formData.append('screen_time', newBanner.screen_time);
      formData.append('position', newBanner.position);
      formData.append('isActive', newBanner.isActive ? "TRUE" : "FALSE");
      if (newBanner.banner_url) {
        formData.append('banner', newBanner.banner_url);
      }

      const response = await axios.put(
        `https://bluecollar.sndktech.online/api/banners/update/${newBanner.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        setBanners(banners.map(b => b.id === newBanner.id ? response.data : b));
        setOpenModal(false);
        setNewBanner({
          banner_type: "image",
          banner_url: null,
          screen_time: 40,
          position: "Header",
          isActive: true,
          isDeleted: false,
        });
        setModalKey(prevKey => prevKey + 1); // Reset the modal
        alert("Banner updated successfully!");
      } else {
        alert(response.data.error || "Failed to update banner");
      }
    } catch (error) {
      alert("Error updating banner. Please check your network connection and try again.");
    }
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        const response = await axios.delete(
          `https://bluecollar.sndktech.online/api/banners/delete/${id}`
        );
        if (response.status === 200) {
          setBanners(banners.filter(b => b.id !== id));
          alert("Banner deleted successfully!");
        }
      } catch (error) {
        alert("Error deleting banner. Please check your network connection and try again.");
      }
    }
  };

  const toggleActiveState = async (id, currentState) => {
    try {
      const response = await axios.patch(
        `https://bluecollar.sndktech.online/api/banners/${id}`,
        { isActive: !currentState }
      );
      if (response.status === 200) {
        setBanners(banners.map(b => b.id === id ? {...b, isActive: response.data.isActive} : b));
      }
    } catch (error) {
      console.error("Error toggling active state:", error);
      alert("Error toggling active state. Please check your network connection and try again.");
    }
  };

  const resetForm = () => {
    setNewBanner({
      banner_type: "image",
      banner_url: null,
      screen_time: 40,
      position: "Header",
      isActive: true,
      isDeleted: false,
    });
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'banner_url' && e.target.files) {
      setNewBanner({...newBanner, [e.target.name]: e.target.files[0]});
    } else {
      setNewBanner({...newBanner, [e.target.name]: e.target.value});
    }
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
                    Loading Banners Data...
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
    {
      Header: "Banner URL",
      accessor: "banner_url",
      Cell: ({ row }) => (
        <img
          src={row.original.banner_url}
          alt="Banner"
          style={{ width: '100px', height: 'auto' }}
        />
      ),
    },
    { Header: "Screen Time", accessor: "screen_time" },
    { Header: "Position", accessor: "position" },
    {
      Header: "Active",
      accessor: "isActive",
      Cell: ({ row }) => (
        <Button
          variant="contained"
          sx={{
            backgroundColor: row.original.isActive ? "#4CAF50" : "#F44336",
            color: "white",
            "&:hover": {
              backgroundColor: row.original.isActive ? "#388E3C" : "#D32F2F",
            },
          }}
          onClick={() => toggleActiveState(row.original.id, row.original.isActive)}
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </Button>
      ),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setNewBanner(row.original);
              setOpenModal(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteBanner(row.original.id)}
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
                  Banners Table
                </MDTypography>
                <Button
                  variant="contained"
                  color="white"
                  sx={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    backgroundColor: "#f44336",
                    color: "white",
                    "&:hover": { backgroundColor: "#d32f2f" }
                  }}
                  onClick={() => {
                    resetForm();
                    setModalKey(prevKey => prevKey + 1); // Reset the modal
                    setOpenModal(true);
                  }}
                >
                  Create Banner
                </Button>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <DataTable
                    table={{ columns, rows: banners }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} key={modalKey}>
        <DialogTitle>{newBanner.id ? "Edit Banner" : "Create Banner"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth margin="normal"
            label="Banner URL"
            name="banner_url"
            type="file"
            onChange={handleInputChange}
          />
          <TextField
            fullWidth margin="normal"
            label="Screen Time"
            type="number"
            name="screen_time"
            value={newBanner.screen_time}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Position</InputLabel>
            <Select
              name="position"
              value={newBanner.position}
              label="Position"
              onChange={handleInputChange}
            >
              <MenuItem value="Header">Header</MenuItem>
              <MenuItem value="Footer">Footer</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Switch checked={newBanner.isActive} onChange={(e) => setNewBanner({...newBanner, isActive: e.target.checked})} />}
            label="Is Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={newBanner.id ? handleUpdateBanner : handleCreateBanner}>
            {newBanner.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Footer />
    </DashboardLayout>
  );
}

export default Banners;