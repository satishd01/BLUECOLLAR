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
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

// BLISSIQ ADMIN React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// BLISSIQ ADMIN React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    schoolId: "",
    class: "10th",
    board: "CBSE",
  });

  // Fetch teachers data
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("https://api.blissiq.cloud/admin.getAll/teacher");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data && data.success) {
          setTeachers(data.data.reverse());
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error);
        alert("Failed to fetch teacher data. Please check your network connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSchools = async () => {
      try {
        const response = await fetch("https://api.blissiq.cloud/admin.getAll/school");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data && data.success) {
          setSchools(data.data.reverse());
        }
      } catch (error) {
        console.error("Error fetching schools data:", error);
        alert("Failed to fetch schools data. Please check your network connection and try again.");
      }
    };

    fetchTeachers();
    fetchSchools();
  }, []);

  const toggleActiveState = async (teacherId, currentState) => {
    try {
      const response = await fetch(
        `https://api.blissiq.cloud/admin.active-deactive/teacher/${teacherId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !currentState }),
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();

      if (result.success) {
        setTeachers((prevTeachers) =>
          prevTeachers.map((teacher) =>
            teacher.id === teacherId ? { ...teacher, isActive: result.data.isActive } : teacher
          )
        );
      }
    } catch (error) {
      console.error("Error updating teacher status:", error);
      alert("Failed to update teacher status. Please check your network connection and try again.");
    }
  };

  const toggleApprovalStatus = async (teacherId, currentStatus) => {
    try {
      const newStatus = currentStatus === "approved" ? "pending" : "approved";
      const response = await fetch(
        `https://api.blissiq.cloud/admin.approve/teacher/${teacherId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();

      if (result.success) {
        setTeachers((prevTeachers) =>
          prevTeachers.map((teacher) =>
            teacher.id === teacherId ? { ...teacher, status: result.data.status } : teacher
          )
        );
      }
    } catch (error) {
      console.error("Error updating teacher approval status:", error);
      alert("Failed to update teacher approval status. Please check your network connection and try again.");
    }
  };

  const handleCreateTeacher = async () => {
    try {
      const response = await fetch("https://api.blissiq.cloud/admin/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeacher),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();

      if (response.ok) {
        setTeachers((prev) => [
          ...prev,
          {
            ...result.data,
            subRows: [],
          },
        ]);
        setOpenModal(false);
        setNewTeacher({
          name: "",
          phone: "",
          email: "",
          password: "",
          schoolId: "",
          class: "10th",
          board: "CBSE",
        });
        alert("Teacher created successfully!");
      } else {
        alert(result.error || "Failed to create teacher");
      }
    } catch (error) {
      console.error("Error creating teacher:", error);
      alert("Failed to create teacher. Please check your network connection and try again.");
    }
  };

  const handleUpdateTeacher = async () => {
    try {
      const response = await fetch(
        `https://api.blissiq.cloud/admin/teachers/${newTeacher.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTeacher),
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();

      if (response.ok) {
        setTeachers((prevTeachers) =>
          prevTeachers.map((teacher) =>
            teacher.id === newTeacher.id ? { ...teacher, ...newTeacher } : teacher
          )
        );
        setOpenModal(false);
        setNewTeacher({
          name: "",
          phone: "",
          email: "",
          password: "",
          schoolId: "",
          class: "",
          board: "",
        });
        alert("Teacher updated successfully!");
      } else {
        alert(result.error || "Failed to update teacher");
      }
    } catch (error) {
      console.error("Error updating teacher:", error);
      alert("Failed to update teacher. Please check your network connection and try again.");
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this teacher?");
    if (confirmDelete) {
      try {
        const response = await fetch(
          `https://api.blissiq.cloud/admin/teachers/${teacherId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        if (result.success) {
          setTeachers((prevTeachers) =>
            prevTeachers.filter((teacher) => teacher.id !== teacherId)
          );
          alert("Teacher deleted successfully!");
        } else {
          alert(result.error || "Failed to delete teacher");
        }
      } catch (error) {
        console.error("Error deleting teacher:", error);
        alert("Failed to delete teacher. Please check your network connection and try again.");
      }
    }
  };

  const handleInputChange = (e) => {
    setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
  };

  const handleOpenModal = (teacher = null) => {
    if (teacher) {
      setNewTeacher(teacher);
    } else {
      setNewTeacher({
        name: "",
        phone: "",
        email: "",
        password: "",
        schoolId: "",
        class: "",
        board: "",
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
                    Loading Teachers Data...
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
    { Header: "Name", accessor: "name" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Email", accessor: "email" },
    { Header: "Class", accessor: "class" },
    { Header: "Board", accessor: "board" },
    { Header: "School ID", accessor: "schoolId" },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => (
        <FormControlLabel
          control={
            <Switch
              checked={row.original.status === "approved"}
              onChange={() => toggleApprovalStatus(row.original.id, row.original.status)}
              color={row.original.status === "approved" ? "success" : "error"}
            />
          }
          label={row.original.status === "approved" ? "Approved" : "Pending"}
        />
      ),
    },
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
              backgroundColor: row.original.isActive ? "#4caf50" : "#f44336",
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
              setNewTeacher(row.original);
              setOpenModal(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteTeacher(row.original.id)}
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
                  Teachers Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <DataTable table={{ columns, rows: teachers }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
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
                  Create Teacher
                </Button>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Modal for creating or editing teacher */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{newTeacher.id ? "Edit Teacher" : "Create Teacher"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            name="name"
            value={newTeacher.name}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Phone"
            fullWidth
            name="phone"
            value={newTeacher.phone}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Email"
            fullWidth
            name="email"
            value={newTeacher.email}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Password"
            fullWidth
            name="password"
            type="password"
            value={newTeacher.password}
            onChange={handleInputChange}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>School</InputLabel>
            <Select name="schoolId" value={newTeacher.schoolId} onChange={handleInputChange}>
              {schools.map((school) => (
                <MenuItem key={school.id} value={school.id}>
                  {school.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Class"
            fullWidth
            name="class"
            value={newTeacher.class}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Board"
            fullWidth
            name="board"
            value={newTeacher.board}
            onChange={handleInputChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={newTeacher.id ? handleUpdateTeacher : handleCreateTeacher} color="primary">
            {newTeacher.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Teachers;