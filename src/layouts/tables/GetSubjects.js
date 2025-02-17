import { useEffect, useState } from "react";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

// BLISSIQ ADMIN React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// BLISSIQ ADMIN React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function GetSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUniversityId, setSearchUniversityId] = useState("");
  const [searchGradeId, setSearchGradeId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    gradeId: "",
    universityId: "",
  });
  const [isEditMode, setIsEditMode] = useState(false); // Track if the form is in edit mode

  const fetchSubjects = async () => {
    try {
      const universityId = searchUniversityId ? `universityId=${searchUniversityId}` : "";
      const gradeId = searchGradeId ? `gradeId=${searchGradeId}` : "";
      const query = `${universityId}${universityId && gradeId ? "&" : ""}${gradeId}`;
      const response = await axios.get(`https://api.blissiq.cloud/admin/subject?${query}`);
      if (response.data.success) {
        setSubjects(response.data.data.reverse());
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversitiesAndGrades = async () => {
    try {
      const [universityResponse, gradeResponse] = await Promise.all([
        axios.get("https://api.blissiq.cloud/admin/university"),
        axios.get("https://api.blissiq.cloud/admin/grade"),
      ]);
      if (universityResponse.data.success && gradeResponse.data.success) {
        setUniversities(universityResponse.data.data);
        setGrades(gradeResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching universities or grades:", error);
    }
  };

  const handleCreateSubjectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const subjectData = {
        name: formData.name,
        code: formData.code,
        gradeId: formData.gradeId,
        universityId: formData.universityId,
      };
      const response = await axios.post("https://api.blissiq.cloud/admin/subject", subjectData);
      if (response.data.success) {
        alert("Subject created successfully!");
        fetchSubjects();
        setFormData({ name: "", code: "", gradeId: "", universityId: "" });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating subject:", error);
      alert("Failed to create subject.");
    }
  };

  const handleUpdateSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const subjectData = {
        name: formData.name,
        code: formData.code,
        gradeId: formData.gradeId,
        universityId: formData.universityId,
      };
      const response = await axios.put(`https://api.blissiq.cloud/admin/subject/${formData.id}`, subjectData);
      if (response.data.success) {
        alert("Subject updated successfully!");
        fetchSubjects();
        setFormData({ name: "", code: "", gradeId: "", universityId: "" });
        setIsModalOpen(false);
        setIsEditMode(false); // Reset edit mode
      }
    } catch (error) {
      console.error("Error updating subject:", error);
      alert("Failed to update subject.");
    }
  };

  const handleUpdate = (subject) => {
    setFormData({ ...subject });
    setIsModalOpen(true);
    setIsEditMode(true); // Set edit mode to true
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this subject?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`https://api.blissiq.cloud/admin/subject/${id}`);
        if (response.data.success) {
          setSubjects(subjects.filter((subject) => subject.id !== id));
          alert("Subject deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting subject:", error);
        alert("Failed to delete the subject.");
      }
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchUniversitiesAndGrades();
  }, [searchUniversityId, searchGradeId]);

  if (loading) {
    return (
      <MDTypography variant="h6" color="text">
        Loading...
      </MDTypography>
    );
  }

  const columns = [
    { Header: "ID", accessor: "id", align: "left" },
    { Header: "Name", accessor: "name", align: "left" },
    { Header: "Code", accessor: "code", align: "left" },
    // { Header: "Grade ID", accessor: "gradeId", align: "center" },
    { Header: "University ID", accessor: "universityId", align: "center" },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <MDBox display="flex" justifyContent="center">
          <MDButton variant="outlined" color="info" size="small" onClick={() => handleUpdate(row.original)} style={{ marginRight: "8px" }}>
            Edit
          </MDButton>
          <MDButton variant="outlined" color="error" size="small" onClick={() => handleDelete(row.original.id)}>
            Delete
          </MDButton>
        </MDBox>
      ),
    },
  ];

  const rows = subjects.map((subject) => ({
    id: subject.id,
    name: subject.name,
    code: subject.code,
    gradeId: subject.gradeId,
    universityId: subject.universityId,
    actions: "",
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={1} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h6" color="white">
                  Subject Table
                </MDTypography>
                <MDBox display="flex" justifyContent="flex-end" mt={2}>
                  <MDButton variant="contained" color="primary" onClick={() => {
                    setFormData({ name: "", code: "", gradeId: "", universityId: "" });
                    setIsModalOpen(true);
                    setIsEditMode(false); // Reset edit mode
                  }}>
                    Create Subject
                  </MDButton>
                </MDBox>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <DataTable table={{ columns, rows }} isSorted={false} entriesPerPage={true} showTotalEntries={false} noEndBorder />
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Create/Edit Subject Modal */}
      <Modal open={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setIsEditMode(false); // Reset edit mode on close
      }}>
        <MDBox sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", p: 4, boxShadow: 24, borderRadius: 2 }}>
          <form onSubmit={isEditMode ? handleUpdateSubjectSubmit : handleCreateSubjectSubmit}>
            <MDTypography variant="h5" gutterBottom>
              {isEditMode ? "Update Subject" : "Create Subject"}
            </MDTypography>
            <TextField fullWidth label="Subject Name" name="name" value={formData.name} onChange={handleCreateSubjectChange} margin="normal" required />
            <TextField fullWidth label="Subject Code" name="code" value={formData.code} onChange={handleCreateSubjectChange} margin="normal" required />
            {/* <TextField fullWidth label="Grade ID" name="gradeId" value={formData.gradeId} onChange={handleCreateSubjectChange} margin="normal" select SelectProps={{ native: true }} required>
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
                </option>
              ))}
            </TextField> */}
            <TextField fullWidth label="University ID" name="universityId" value={formData.universityId} onChange={handleCreateSubjectChange} margin="normal" select SelectProps={{ native: true }} required>
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.name}
                </option>
              ))}
            </TextField>
            <MDBox mt={2} display="flex" justifyContent="flex-end">
              <MDButton variant="outlined" color="secondary" onClick={() => {
                setIsModalOpen(false);
                setIsEditMode(false); // Reset edit mode on cancel
              }} style={{ marginRight: "8px" }}>
                Cancel
              </MDButton>
              <MDButton type="submit" variant="contained" color="primary">
                {isEditMode ? "Update" : "Create"}
              </MDButton>
            </MDBox>
          </form>
        </MDBox>
      </Modal>

      <Footer />
    </DashboardLayout>
  );
}

export default GetSubjects;