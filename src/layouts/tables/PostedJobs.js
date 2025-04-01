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
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";

// BLISSIQ ADMIN React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// BLISSIQ ADMIN React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Amenities options
const amenitiesOptions = ["Food", "Stay", "Transport", "Medical", "Equipment"];

function PostRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [newRequest, setNewRequest] = useState({
    id: null,
    category_id: "",
    start_date: "",
    end_date: "",
    amenities: [],
    total_hiring: 1,
    user_id: null,
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://bluecollar.sndktech.online/api/categories/");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://bluecollar.sndktech.online/api/signup/users/list/user");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch("https://bluecollar.sndktech.online/api/post-requests");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRequests(data.postRequests || []);
    } catch (error) {
      console.error("Error fetching post requests:", error);
      alert("Failed to fetch post requests. Please check your network connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchUsers();
    fetchRequests();
  }, []);

  const handleCreateRequest = async () => {
    try {
      const response = await fetch("https://bluecollar.sndktech.online/api/post-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_id: newRequest.category_id,
          start_date: newRequest.start_date,
          end_date: newRequest.end_date,
          amenities: newRequest.amenities,
          total_hiring: newRequest.total_hiring,
          user_id: newRequest.user_id,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }
      
      const result = await response.json();

      if (response.ok) {
        setOpenModal(false);
        setNewRequest({
          category_id: "",
          start_date: "",
          end_date: "",
          amenities: [],
          total_hiring: 1,
          user_id: null,
        });
        alert("Post request created successfully!");
        fetchRequests();
      } else {
        alert(result.message || "Failed to create post request");
      }
    } catch (error) {
      console.error("Error creating post request:", error);
      alert(error.message || "Failed to create post request. Please check your network connection and try again.");
    }
  };

  const handleUpdateRequest = async () => {
    try {
      const response = await fetch(
        `https://bluecollar.sndktech.online/api/post-requests/${newRequest.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category_id: newRequest.category_id,
            start_date: newRequest.start_date,
            end_date: newRequest.end_date,
            amenities: newRequest.amenities,
            total_hiring: newRequest.total_hiring,
            user_id: newRequest.user_id,
          }),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }
      
      const result = await response.json();

      if (response.ok) {
        setOpenModal(false);
        setNewRequest({
          category_id: "",
          start_date: "",
          end_date: "",
          amenities: [],
          total_hiring: 1,
          user_id: null,
        });
        alert("Post request updated successfully!");
        fetchRequests();
      } else {
        alert(result.message || "Failed to update post request");
      }
    } catch (error) {
      console.error("Error updating post request:", error);
      alert(error.message || "Failed to update post request. Please check your network connection and try again.");
    }
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
          const errorData = await response.json();
          throw new Error(errorData.message || 'Network response was not ok');
        }
        
        const result = await response.json();

        if (result.message) {
          alert("Post request deleted successfully!");
          fetchRequests();
        } else {
          alert(result.message || "Failed to delete post request");
        }
      } catch (error) {
        console.error("Error deleting post request:", error);
        alert(error.message || "Failed to delete post request. Please check your network connection and try again.");
      }
    }
  };

  const handleInputChange = (e) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  const handleAmenitiesChange = (event, value) => {
    setNewRequest({ ...newRequest, amenities: value });
  };

  const handleOpenModal = (request = null) => {
    if (request) {
      setNewRequest({
        id: request.id,
        category_id: request.category_id,
        start_date: request.start_date,
        end_date: request.end_date,
        amenities: request.amenities || [],
        total_hiring: request.total_hiring,
        user_id: request.user_id,
      });
    } else {
      setNewRequest({
        id: null,
        category_id: "",
        start_date: "",
        end_date: "",
        amenities: [],
        total_hiring: 1,
        user_id: null,
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
    { 
      Header: "Category", 
      accessor: "category_id",
      Cell: ({ value }) => {
        const category = categories.find(cat => cat.id === value);
        return category ? category.category_name : value;
      }
    },
    { Header: "Start Date", accessor: "start_date" },
    { Header: "End Date", accessor: "end_date" },
    { 
      Header: "Amenities", 
      accessor: "amenities",
      Cell: ({ value }) => (
        <div>
          {value && value.map((amenity, index) => (
            <Chip key={index} label={amenity} size="small" sx={{ margin: 0.5 }} />
          ))}
        </div>
      )
    },
    { Header: "Total Hiring", accessor: "total_hiring" },
    { 
      Header: "User", 
      accessor: "user_id",
      Cell: ({ value }) => {
        const user = users.find(user => user.user_id === value);
        return user ? `${user.full_name} (${user.user_id})` : value;
      }
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
          <Button
            variant="contained"
            color="white"
            onClick={() => handleOpenModal(row.original)}
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
                  Post Requests 
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
                    backgroundColor: "white",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "white",
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
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>{newRequest.id ? "Edit Post Request" : "Create Post Request"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="category_id"
              value={newRequest.category_id}
              onChange={handleInputChange}
              label="Category"
              sx={{ padding: "12px 14px" }}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.category_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="user-label">User</InputLabel>
            <Select
              labelId="user-label"
              name="user_id"
              value={newRequest.user_id || ""}
              onChange={handleInputChange}
              label="User"
              sx={{ padding: "12px 14px" }}
            >
              {users.map((user) => (
                <MenuItem key={user.user_id} value={user.user_id}>
                  {user.full_name} ({user.user_id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="Start Date"
            fullWidth
            name="start_date"
            type="date"
            value={newRequest.start_date}
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            label="End Date"
            fullWidth
            name="end_date"
            type="date"
            value={newRequest.end_date}
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          
          <Autocomplete
            multiple
            options={amenitiesOptions}
            value={newRequest.amenities || []}
            onChange={handleAmenitiesChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Amenities"
                margin="normal"
                fullWidth
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  size="small"
                />
              ))
            }
          />
          
          <TextField
            label="Total Hiring"
            fullWidth
            name="total_hiring"
            type="number"
            value={newRequest.total_hiring}
            onChange={handleInputChange}
            margin="normal"
            inputProps={{ min: 1 }}
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