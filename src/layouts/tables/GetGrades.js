import React, { useEffect, useState } from "react";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// BLISSIQ ADMIN React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";

// Importing the same design components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

export default function GradeTable() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUniversityId, setSearchUniversityId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGrade, setCurrentGrade] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [subjects, setSubjects] = useState([]); // Store subjects
  const [newGrade, setNewGrade] = useState({
    name: "",
    universityId: "",
    subjectId: "", // New field for subject
    classNo: 1, // New field for class number
  });
  const [isFetchingUniversities, setIsFetchingUniversities] = useState(true);
  const [isFetchingSubjects, setIsFetchingSubjects] = useState(true); // For loading indicator of subjects

  // Fetch grades based on universityId
  const fetchGrades = async () => {
    try {
      const query = searchUniversityId ? `?universityId=${searchUniversityId}` : "";
      const response = await axios.get(`https://api.blissiq.cloud/admin/grade${query}`);
      if (response.data.success) {
        setGrades(response.data.data.reverse());
      }
    } catch (error) {
      console.error("Error fetching grades:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch universities for dropdown
  const fetchUniversities = async () => {
    setIsFetchingUniversities(true);
    try {
      const response = await axios.get("https://api.blissiq.cloud/admin/university");
      if (response.data.success) {
        setUniversities(response.data.data.reverse());  
      }
    } catch (error) {
      console.error("Error fetching universities:", error);
    } finally {
      setIsFetchingUniversities(false);
    }
  };

  // Fetch subjects for dropdown based on universityId
  const fetchSubjects = async (universityId) => {
    setIsFetchingSubjects(true);
    try {
      const response = await axios.get(`https://api.blissiq.cloud/admin/subject?universityId=${universityId}`);
      if (response.data.success) {
        setSubjects(response.data.data.reverse());
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setIsFetchingSubjects(false);
    }
  };

  // Handle delete action
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this grade?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`https://api.blissiq.cloud/admin/grade/${id}`);
        if (response.data.success) {
          setGrades(grades.filter((grade) => grade.id !== id));
          alert("Grade deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting grade:", error);
        alert("Failed to delete the grade.");
      }
    }
  };

  // Open modal with grade details for updating
  const handleUpdate = (grade) => {
    setCurrentGrade(grade);
    setIsModalOpen(true);
    fetchSubjects(grade.universityId); // Fetch subjects for the selected university
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentGrade(null);
    setNewGrade({ name: "", universityId: "", subjectId: "", classNo: 1 });
  };

  // Handle input change in modal (for update)
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "universityId") {
      // Fetch subjects when university is selected
      fetchSubjects(value);
    }
    setCurrentGrade({ ...currentGrade, [name]: value });
  };

  // Handle form submission to update grade
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!currentGrade) return;

    try {
      const response = await axios.put(`https://api.blissiq.cloud/admin/grade/${currentGrade.id}`, {
        name: currentGrade.name,
        subjectId: currentGrade.subjectId,
        classNo: currentGrade.classNo,
      });

      if (response.data.success) {
        setGrades(
          grades.map((grade) =>
            grade.id === currentGrade.id ? { ...grade, name: currentGrade.name, subjectId: currentGrade.subjectId, classNo: currentGrade.classNo } : grade
          )
        );
        alert("Grade updated successfully!");
        handleCloseModal();
      } else {
        alert("Failed to update grade.");
      }
    } catch (error) {
      console.error("Error updating grade:", error);
      alert("Failed to update grade.");
    }
  };

  // Handle form submission to create grade
  const handleCreateGradeSubmit = async (event) => {
    event.preventDefault();
    if (!newGrade.name || !newGrade.universityId || !newGrade.subjectId) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("https://api.blissiq.cloud/admin/grade", {
        name: newGrade.name,
        universityId: newGrade.universityId,
        subjectId: newGrade.subjectId,
        classNo: newGrade.classNo,
      });

      if (response.data.success) {
        setGrades([...grades, response.data.data]);
        alert("Grade created successfully!");
        handleCloseModal();
      } else {
        alert("Failed to create grade.");
      }
    } catch (error) {
      console.error("Error creating grade:", error);
      alert("Failed to create grade.");
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchUniversityId(event.target.value);
  };

  useEffect(() => {
    fetchGrades();
    fetchUniversities();
    if (searchUniversityId) {
      fetchSubjects(searchUniversityId);
    }
  }, [searchUniversityId]);

  if (loading) {
    return (
      <MDTypography variant="h6" color="text">
        Loading...
      </MDTypography>
    );
  }

  // Columns structure for the grades table
  const columns = [
    { Header: "ID", accessor: "id", align: "left" },
    { Header: "Name", accessor: "name", align: "left" },
    { Header: "Subject", accessor: "subjectName", align: "left" }, // Changed to subjectName
    { Header: "Class No", accessor: "classNo", align: "left" },
    { Header: "Status", accessor: "isActive", align: "center" },
    { Header: "Created At", accessor: "createdAt", align: "center" },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <MDBox display="flex" justifyContent="center">
          <MDButton
            variant="outlined"
            color="info"
            size="small"
            onClick={() => handleUpdate(row.original)}
            style={{ marginRight: "8px" }}
          >
            Edit
          </MDButton>
          <MDButton
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </MDButton>
        </MDBox>
      ),
    },
  ];

  // Prepare the rows for the table
  const rows = grades.map((grade) => ({
    id: grade.id,
    name: grade.name,
    subjectName: grade.subjectId ? subjects.find((subj) => subj.id === grade.subjectId)?.name || "N/A" : "N/A", // Display the subject name
    classNo: grade.classNo,
    isActive: grade.isActive ? (
      <MDBadge badgeContent="Active" color="success" variant="gradient" size="sm" />
    ) : (
      <MDBadge badgeContent="Inactive" color="error" variant="gradient" size="sm" />
    ),
    createdAt: new Date(grade.createdAt).toLocaleDateString(),
    actions: "",
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDTypography variant="h4" gutterBottom>
          Grade List
        </MDTypography>

        {/* Search by University ID */}
        <MDBox component="div" marginBottom={2}>
          <MDTypography variant="h6" color="text" style={{ marginRight: "8px" }}>
            Search by University ID:
          </MDTypography>
          <input
            type="text"
            value={searchUniversityId}
            onChange={handleSearchChange}
            placeholder="Enter University ID"
            style={{
              padding: "8px",
              marginRight: "8px",
              border: "1px solid gray",
              borderRadius: "4px",
            }}
          />
        </MDBox>

        {/* Button to create a new grade */}
        <MDBox component="div" sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
          <MDButton variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
            Create Grade
          </MDButton>
        </MDBox>

        {/* Grades Table */}
        <MDBox component="div" sx={{ display: "flex", flexDirection: "column", height: "auto" }}>
          <MDBox sx={{ flex: 1, overflow: "auto" }}>
            <DataTable
              table={{ columns, rows }}
              isSorted={false}
              entriesPerPage={true}
              showTotalEntries={false}
              noEndBorder
            />
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Create / Update Grade Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
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
          <form onSubmit={currentGrade ? handleFormSubmit : handleCreateGradeSubmit}>
            <MDTypography variant="h5" gutterBottom>
              {currentGrade ? "Update Grade" : "Create Grade"}
            </MDTypography>

            <TextField
              fullWidth
              label="Name"
              name="name"
              value={currentGrade?.name || newGrade.name}
              onChange={(event) => {
                currentGrade
                  ? handleInputChange(event)
                  : setNewGrade({ ...newGrade, name: event.target.value });
              }}
              margin="normal"
            />

            {/* University Dropdown */}
            <FormControl fullWidth margin="normal">
              <InputLabel>University</InputLabel>
              <Select
                value={currentGrade?.universityId || newGrade.universityId}
                onChange={(event) => {
                  const universityId = event.target.value;
                  currentGrade
                    ? setCurrentGrade({ ...currentGrade, universityId })
                    : setNewGrade({ ...newGrade, universityId });
                  fetchSubjects(universityId); // Fetch subjects for the selected university
                }}
                label="University"
                sx={{ padding: "12px 14px" }}
              >
                {isFetchingUniversities ? (
                  <MenuItem disabled>
                    <CircularProgress size={24} />
                  </MenuItem>
                ) : (
                  universities.map((university) => (
                    <MenuItem key={university.id} value={university.id}>
                      {university.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {/* Subject Dropdown */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Subject</InputLabel>
              <Select
                value={currentGrade?.subjectId || newGrade.subjectId}
                onChange={(event) => {
                  currentGrade
                    ? setCurrentGrade({ ...currentGrade, subjectId: event.target.value })
                    : setNewGrade({ ...newGrade, subjectId: event.target.value });
                }}
                label="Subject"
                sx={{ padding: "12px 14px" }}
              >
                {isFetchingSubjects ? (
                  <MenuItem disabled>
                    <CircularProgress size={24} />
                  </MenuItem>
                ) : (
                  subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {/* Class Number Input */}
            <TextField
              fullWidth
              label="Class Number"
              type="number"
              value={currentGrade?.classNo || newGrade.classNo}
              onChange={(event) => {
                currentGrade
                  ? setCurrentGrade({ ...currentGrade, classNo: event.target.value })
                  : setNewGrade({ ...newGrade, classNo: event.target.value });
              }}
              margin="normal"
            />

            <MDBox mt={2} display="flex" justifyContent="flex-end">
              <MDButton variant="outlined" color="secondary" onClick={handleCloseModal} style={{ marginRight: "8px" }}>
                Cancel
              </MDButton>
              <MDButton type="submit" variant="contained" color="primary">
                {currentGrade ? "Save" : "Create"}
              </MDButton>
            </MDBox>
          </form>
        </MDBox>
      </Modal>

      <Footer />
    </DashboardLayout>
  );
}