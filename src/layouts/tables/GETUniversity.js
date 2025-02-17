import { useEffect, useState } from "react";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// BLISSIQ ADMIN React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// BLISSIQ ADMIN React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Edit Modal
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

export default function UniversityTable() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for Create Modal
  const [currentUniversity, setCurrentUniversity] = useState(null); // Current university being updated
  const [newUniversity, setNewUniversity] = useState({ name: "", address: "" }); // State for new university form

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get("https://api.blissiq.cloud/admin/university/");
        if (response.data.success) {
          setUniversities(response.data.data.reverse());
        }
      } catch (error) {
        console.error("Error fetching universities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  // If still loading, show a loading indicator
  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Loading University Data...
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

  // Handle Delete University
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this university?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`https://api.blissiq.cloud/admin/university/${id}`);

        if (response.data.success) {
          setUniversities(universities.filter((university) => university.id !== id));
          alert("University deleted successfully!");
        } else {
          alert("Failed to delete the university.");
        }
      } catch (error) {
        console.error("Error deleting university:", error);
        alert("Failed to delete the university.");
      }
    }
  };

  // Open Edit Modal for updating university
  const handleUpdate = (university) => {
    setCurrentUniversity(university);
    setIsEditModalOpen(true);
  };

  // Open Create Modal for adding a new university
  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  // Close both modals
  const handleCloseModals = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setCurrentUniversity(null);
    setNewUniversity({ name: "", address: "" }); // Clear form fields after closing
  };

  // Handle input change for Edit and Create modals
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (currentUniversity) {
      setCurrentUniversity({ ...currentUniversity, [name]: value });
    } else {
      setNewUniversity({ ...newUniversity, [name]: value });
    }
  };

  // Handle form submission for creating a new university
  const handleCreateFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("https://api.blissiq.cloud/admin/university/", {
        name: newUniversity.name,
        address: newUniversity.address,
      });

      if (response.data.success) {
        setUniversities([...universities, response.data.data]);
        alert("University added successfully!");
        handleCloseModals();
      } else {
        alert("Failed to add university.");
      }
    } catch (error) {
      console.error("Error adding university:", error);
      alert("Failed to add university.");
    }
  };

  // Handle form submission for updating an existing university
  const handleUpdateFormSubmit = async (event) => {
    event.preventDefault();
    if (!currentUniversity) return;

    try {
      const response = await axios.put(
        `https://api.blissiq.cloud/admin/university/${currentUniversity.id}`,
        {
          name: currentUniversity.name,
          address: currentUniversity.address,
          isActive: currentUniversity.isActive,
        }
      );

      if (response.data.success) {
        setUniversities(
          universities.map((uni) =>
            uni.id === currentUniversity.id
              ? { ...uni, name: currentUniversity.name, address: currentUniversity.address }
              : uni
          )
        );
        alert("University updated successfully!");
        handleCloseModals();
      } else {
        alert("Failed to update university.");
      }
    } catch (error) {
      console.error("Error updating university:", error);
      alert("Failed to update university.");
    }
  };

  // Columns structure with the added "ID" column
  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "University Name", accessor: "name" },
    { Header: "Address", accessor: "address" },
    {
      Header: "Active",
      accessor: "isActive",
      Cell: ({ value }) => (value ? "Active" : "Inactive"),
    },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <MDBox display="flex" justifyContent="center">
          <MDButton
            variant="outlined"
            color="info"
            size="small"
            onClick={() => handleUpdate(row.original)} // Pass the whole row for editing
            style={{ marginRight: "8px" }}
          >
            Edit
          </MDButton>
          <MDButton
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(row.original.id)} // Delete university by ID
          >
            Delete
          </MDButton>
        </MDBox>
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
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  University Table
                </MDTypography>
                <MDButton
                  variant="contained"
                  color="primary"
                  onClick={handleCreate}
                >
                  Create University
                </MDButton>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <DataTable
                    table={{ columns, rows: universities }}
                    isSorted={false}
                    entriesPerPage={true}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Create Modal */}
      <Modal open={isCreateModalOpen} onClose={handleCloseModals}>
        <MDBox
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <form onSubmit={handleCreateFormSubmit}>
            <MDTypography variant="h5" gutterBottom>
              Add New University
            </MDTypography>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={newUniversity.name}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={newUniversity.address}
              onChange={handleInputChange}
              margin="normal"
            />
            <MDBox mt={2} display="flex" justifyContent="flex-end">
              <MDButton
                variant="outlined"
                color="secondary"
                onClick={handleCloseModals}
                style={{ marginRight: "8px" }}
              >
                Cancel
              </MDButton>
              <MDButton type="submit" variant="contained" color="primary">
                Save
              </MDButton>
            </MDBox>
          </form>
        </MDBox>
      </Modal>

      {/* Edit Modal */}
      <Modal open={isEditModalOpen} onClose={handleCloseModals}>
        <MDBox
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <form onSubmit={handleUpdateFormSubmit}>
            <MDTypography variant="h5" gutterBottom>
              Update University
            </MDTypography>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={currentUniversity?.name || ""}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={currentUniversity?.address || ""}
              onChange={handleInputChange}
              margin="normal"
            />
            <MDBox mt={2} display="flex" justifyContent="flex-end">
              <MDButton
                variant="outlined"
                color="secondary"
                onClick={handleCloseModals}
                style={{ marginRight: "8px" }}
              >
                Cancel
              </MDButton>
              <MDButton type="submit" variant="contained" color="primary">
                Save
              </MDButton>
            </MDBox>
          </form>
        </MDBox>
      </Modal>

      <Footer />
    </DashboardLayout>
  );
}
