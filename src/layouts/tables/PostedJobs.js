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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { Input } from "@mui/material";

// BLISSIQ ADMIN React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// BLISSIQ ADMIN React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function PostRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    service: "",
    location: "",
    price: 0,
    service_description: "",
    date: "",
    time: "",
    user_id: null,
    attach: null, // Added attach field
  });

  // Fetch post requests data
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("https://bluecollar.sndktech.online/api/post-requests");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data && data.totalRequests) {
          setRequests(data.postRequests);
        }
      } catch (error) {
        console.error("Error fetching post requests:", error);
        alert("Failed to fetch post requests. Please check your network connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleCreateRequest = async () => {
    try {
      const formData = new FormData();
      formData.append('service', newRequest.service);
      formData.append('location', newRequest.location);
      formData.append('price', newRequest.price);
      formData.append('service_description', newRequest.service_description);
      formData.append('date', newRequest.date);
      formData.append('time', newRequest.time);
      formData.append('user_id', newRequest.user_id);
      if (newRequest.attach) {
        formData.append('attach', newRequest.attach); // Include the file if provided
      }

      const response = await fetch("https://bluecollar.sndktech.online/api/post-request", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();

      if (response.ok) {
        setRequests((prev) => [
          ...prev,
          {
            ...result.data,
          },
        ]);
        setOpenModal(false);
        setNewRequest({
          service: "",
          location: "",
          price: 0,
          service_description: "",
          date: "",
          time: "",
          user_id: null,
          attach: null, // Reset attach field
        });
        alert("Post request created successfully!");
      } else {
        alert(result.error || "Failed to create post request");
      }
    } catch (error) {
      console.error("Error creating post request:", error);
      alert("Failed to create post request. Please check your network connection and try again.");
    }
  };

  const handleUpdateRequest = async () => {
    try {
      const formData = new FormData();
      formData.append('service', newRequest.service);
      formData.append('location', newRequest.location);
      formData.append('price', newRequest.price);
      formData.append('service_description', newRequest.service_description);
      formData.append('date', formatDate(newRequest.date)); // Format the date
      formData.append('time', newRequest.time);
      formData.append('user_id', newRequest.user_id);
      if (newRequest.attach) {
        formData.append('attach', newRequest.attach); // Include the file if provided
      }

      const response = await fetch(
        `https://bluecollar.sndktech.online/api/post-requests/${newRequest.id}`,
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
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === newRequest.id ? { ...request, ...newRequest } : request
          )
        );
        setOpenModal(false);
        setNewRequest({
          service: "",
          location: "",
          price: 0,
          service_description: "",
          date: "",
          time: "",
          user_id: null,
          attach: null, // Reset attach field
        });
        alert("Post request updated successfully!");
      } else {
        alert(result.error || "Failed to update post request");
      }
    } catch (error) {
      console.error("Error updating post request:", error);
      alert("Failed to update post request. Please check your network connection and try again.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = new Date(date).toISOString().split("T")[0].split("-");
    return `${year}-${month}-${day}`;
  };

  const handleDeleteRequest = async (requestId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post request?");
    if (confirmDelete) {
      try {
        const response = await fetch(
          `https://bluecollar.sndktech.online/api/post-requests/${requestId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
  
        if (result.message) {
          setRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== requestId)
          );
          alert("Post request deleted successfully!");
        } else {
          alert(result.message || "Failed to delete post request");
        }
      } catch (error) {
        console.error("Error deleting post request:", error);
        alert("Failed to delete post request. Please check your network connection and try again.");
      }
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === "attach") {
      setNewRequest({ ...newRequest, [e.target.name]: e.target.files[0] });
    } else {
      setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
    }
  };

  const handleOpenModal = (request = null) => {
    if (request) {
      setNewRequest(request);
    } else {
      setNewRequest({
        service: "",
        location: "",
        price: 0,
        service_description: "",
        date: "",
        time: "",
        user_id: null,
        attach: null, // Reset attach field
      });
    }
    setOpenModal(true);
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
                    Loading Post Requests Data...
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
    { Header: "Service", accessor: "service" },
    { Header: "Location", accessor: "location" },
    { Header: "Price", accessor: "price" },
    { Header: "Service Description", accessor: "service_description" },
    { Header: "Date", accessor: "date" },
    { Header: "Time", accessor: "time" },
    { Header: "User ID", accessor: "user_id" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setNewRequest(row.original);
              setOpenModal(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteRequest(row.original.id)}
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
                  Job Requests 
                </MDTypography>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <DataTable table={{ columns, rows: requests }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
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
                  Create Post Request
                </Button>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Modal for creating or editing post request */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{newRequest.id ? "Edit Post Request" : "Create Post Request"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Service"
            fullWidth
            name="service"
            value={newRequest.service}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Location"
            fullWidth
            name="location"
            value={newRequest.location}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Price"
            fullWidth
            name="price"
            type="number"
            value={newRequest.price}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Service Description"
            fullWidth
            name="service_description"
            value={newRequest.service_description}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Date"
            fullWidth
            name="date"
            type="date"
            value={newRequest.date}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Time"
            fullWidth
            name="time"
            type="time"
            value={newRequest.time}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="User ID"
            fullWidth
            name="user_id"
            type="number"
            value={newRequest.user_id}
            onChange={handleInputChange}
            margin="normal"
          />
          <Input
            type="file"
            name="attach"
            onChange={handleInputChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={newRequest.id ? handleUpdateRequest : handleCreateRequest} color="primary">
            {newRequest.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default PostRequests;