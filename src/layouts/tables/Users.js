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

// BLISSIQ ADMIN React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// BLISSIQ ADMIN React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
  });

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://bluecollar.sndktech.online/api/signup/users/list/user");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data && data.totalRecords) {
          setUsers(data.data.reverse());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data. Please check your network connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    try {
      const response = await fetch("https://bluecollar.sndktech.online/api/signup/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();

      if (response.ok) {
        setUsers((prev) => [
          ...prev,
          {
            ...result.data,
          },
        ]);
        setOpenModal(false);
        setNewUser({
          full_name: "",
          email: "",
          password: "",
          phone_number: "",
        });
        alert("User created successfully!");
      } else {
        alert(result.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please check your network connection and try again.");
    }
  };

  const handleUpdateUser = async () => {
    try {
      const formData = new FormData();
      formData.append('full_name', newUser.full_name);
      formData.append('email', newUser.email);
      formData.append('phone_number', newUser.phone_number);
      formData.append('photo', newUser.photo); // Assuming you have a way to handle file upload

      const response = await fetch(
        `https://bluecollar.sndktech.online/api/profiles/profiles/ ${newUser.user_id}`, // Use user_id
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
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === newUser.user_id ? { ...user, ...newUser } : user
          )
        );
        setOpenModal(false);
        setNewUser({
          full_name: "",
          email: "",
          password: "",
          phone_number: "",
        });
        alert("User updated successfully!");
      } else {
        alert(result.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please check your network connection and try again.");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      try {
        const response = await fetch(
          `https://bluecollar.sndktech.online/api/auth/user/delete/ ${userId}`, // Use user_id
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        if (result.message) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.user_id !== userId) // Filter by user_id
          );
          alert("User deleted successfully!");
        } else {
          alert(result.error || "Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please check your network connection and try again.");
      }
    }
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setNewUser(user);
    } else {
      setNewUser({
        full_name: "",
        email: "",
        password: "",
        phone_number: "",
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
                    Loading Users Data...
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
    { Header: "Name", accessor: "full_name" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone_number" },
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
              setNewUser(row.original);
              setOpenModal(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteUser(row.original.user_id)} // Pass user_id
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
                  Users Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <DataTable table={{ columns, rows: users }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Modal for creating or editing user */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{newUser.user_id ? "Edit User" : "Create User"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            fullWidth
            name="full_name"
            value={newUser.full_name}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Email"
            fullWidth
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Phone Number"
            fullWidth
            name="phone_number"
            value={newUser.phone_number}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Password"
            fullWidth
            name="password"
            type="password"
            value={newUser.password}
            onChange={handleInputChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={newUser.user_id ? handleUpdateUser : handleCreateUser} color="primary">
            {newUser.user_id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Users;