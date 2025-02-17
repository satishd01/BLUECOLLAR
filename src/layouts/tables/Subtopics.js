import { useState, useEffect } from "react";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

// BLISSIQ ADMIN React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// BLISSIQ ADMIN React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const BASE_URL = "https://api.blissiq.cloud/";

function SubtopicManagement() {
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [searchParams, setSearchParams] = useState({
    topicId: "",
    universityId: "",
    subjectId: "",
    gradeId: ""
  });
  const [formData, setFormData] = useState({
    name: "",
    topicId: ""
  });
  const [editData, setEditData] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [message, setMessage] = useState({ type: "", content: "" });

  // Fetch subtopics
  const fetchSubtopics = async () => {
    try {
      const response = await axios.get(`${BASE_URL}subtopics`, {
        params: searchParams,
      });
      setSubtopics(response.data.reverse() || []);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to fetch subtopics";
      setMessage({ type: "error", content: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Fetch topics
  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${BASE_URL}topics`);
      setTopics(response.data || []);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", content: "Failed to fetch topics" });
    }
  };

  // Fetch universities
  const fetchUniversities = async () => {
    try {
      const response = await axios.get(`${BASE_URL}admin/university`);
      setUniversities(response.data.data || []);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", content: "Failed to fetch universities" });
    }
  };

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${BASE_URL}admin/subject`);
      setSubjects(response.data.data || []);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", content: "Failed to fetch subjects" });
    }
  };

  // Fetch grades
  const fetchGrades = async () => {
    try {
      const response = await axios.get(`${BASE_URL}admin/grade`);
      setGrades(response.data.data || []);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", content: "Failed to fetch grades" });
    }
  };

  useEffect(() => {
    fetchSubtopics();
    fetchTopics();
    fetchUniversities();
    fetchSubjects();
    fetchGrades();
  }, [searchParams]);

  // Handle search params change
  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  // Create subtopic
  const handleCreate = async () => {
    try {
      const response = await axios.post(`${BASE_URL}subtopics`, formData);
      setMessage({ type: "success", content: "Subtopic created successfully!" });
      setOpenCreate(false);
      fetchSubtopics();
    } catch (error) {
      setMessage({ type: "error", content: "Failed to create subtopic" });
    }
  };

  // Update subtopic
  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}subtopics/${selectedSubtopic.id}`, editData);
      setMessage({ type: "success", content: "Subtopic updated successfully!" });
      setOpenEdit(false);
      fetchSubtopics();
    } catch (error) {
      setMessage({ type: "error", content: "Failed to update subtopic" });
    }
  };

  // Delete subtopic
  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}subtopics/${selectedSubtopic.id}`);
      setMessage({ type: "success", content: "Subtopic deleted successfully!" });
      setOpenDelete(false);
      fetchSubtopics();
    } catch (error) {
      setMessage({ type: "error", content: "Failed to delete subtopic" });
    }
  };

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
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">
                    Subtopics
                  </MDTypography>
                  <MDButton variant="gradient" color="error" onClick={() => setOpenCreate(true)}>
                    Create Subtopic
                  </MDButton>
                </MDBox>
              </MDBox>
              <MDBox p={3}>
                {/* Search Filters */}

                <Grid container spacing={3} mb={3}>
                  {/* <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                      <InputLabel>University</InputLabel>
                      <Select
                        name="universityId"
                        value={searchParams.universityId}
                        onChange={handleSearchChange}
                        label="University"
                        sx={{ padding: "12px 14px" }}
                      >
                        <MenuItem value="">
                          <em>Select University</em>
                        </MenuItem>
                        {universities.map((university) => (
                          <MenuItem key={university.id} value={university.id}>
                            {university.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid> */}
                  {/* <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                      <InputLabel>Subject</InputLabel>
                      <Select
                        name="subjectId"
                        value={searchParams.subjectId}
                        onChange={handleSearchChange}
                        label="Subject"
                        sx={{ padding: "12px 14px" }}
                      >
                        <MenuItem value="">
                          <em>Select Subject</em>
                        </MenuItem>
                        {subjects.map((subject) => (
                          <MenuItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                      <InputLabel>Grade</InputLabel>
                      <Select
                        name="gradeId"
                        value={searchParams.gradeId}
                        onChange={handleSearchChange}
                        label="Grade"
                        sx={{ padding: "12px 14px" }}
                      >
                        <MenuItem value="">
                          <em>Select Grade</em>
                        </MenuItem>
                        {grades.map((grade) => (
                          <MenuItem key={grade.id} value={grade.id}>
                            {grade.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid> */}
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                      <InputLabel>Topic</InputLabel>
                      <Select
                        name="topicId"
                        value={searchParams.topicId}
                        onChange={handleSearchChange}
                        label="Topic"
                        sx={{ padding: "12px 14px" }}
                      >
                        <MenuItem value="">
                          <em>Select Topic</em>
                        </MenuItem>
                        {topics.map((topic) => (
                          <MenuItem key={topic.id} value={topic.id}>
                            {topic.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Message Display */}
                {message.content && (
                  <MDBox mb={2}>
                    <MDTypography
                      variant="body2"
                      color={message.type === "error" ? "error" : "success"}
                    >
                      {message.content}
                    </MDTypography>
                  </MDBox>
                )}

                {/* Subtopics List */}
                {loading ? (
                  <MDTypography variant="body2">Loading subtopics...</MDTypography>
                ) : subtopics.length > 0 ? (
                  <Grid container spacing={2}>
                    {subtopics.map((subtopic) => (
                      <Grid item xs={12} key={subtopic.id}>
                        <Card sx={{ p: 2 }}>
                          <MDBox display="flex" justifyContent="space-between" alignItems="center">
                            <MDTypography variant="h6">{subtopic.name}</MDTypography>
                            <MDBox>
                              <MDButton
                                color="info"
                                onClick={() => {
                                  setSelectedSubtopic(subtopic);
                                  setEditData(subtopic);
                                  setOpenEdit(true);
                                }}
                              >
                                Edit
                              </MDButton>
                              <MDButton
                                color="error"
                                sx={{ ml: 1 }}
                                onClick={() => {
                                  setSelectedSubtopic(subtopic);
                                  setOpenDelete(true);
                                }}
                              >
                                Delete
                              </MDButton>
                            </MDBox>
                          </MDBox>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <MDTypography variant="body2">No subtopics found</MDTypography>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Create Modal */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Create New Subtopic</DialogTitle>
        <DialogContent>
          <MDBox pt={2} pb={2}>
            <TextField
              fullWidth
              label="Subtopic Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Topic</InputLabel>
              <Select
                name="topicId"
                value={formData.topicId}
                onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                label="Topic"
                sx={{ padding: "12px 14px" }}
              >
                <MenuItem value="">
                  <em>Select Topic</em>
                </MenuItem>
                {topics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <MDButton color="info" onClick={handleCreate}>
            Create
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Subtopic</DialogTitle>
        <DialogContent>
          <MDBox pt={2} pb={2}>
            <TextField
              fullWidth
              label="Subtopic Name"
              name="name"
              value={editData?.name || ""}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Topic</InputLabel>
              <Select
                name="topicId"
                value={editData?.topicId || ""}
                onChange={(e) => setEditData({ ...editData, topicId: e.target.value })}
                label="Topic"
                sx={{ padding: "12px 14px" }}
              >
                <MenuItem value="">
                  <em>Select Topic</em>
                </MenuItem>
                {topics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <MDButton color="info" onClick={handleUpdate}>
            Update
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <MDTypography>
            Are you sure you want to delete "{selectedSubtopic?.name}"?
          </MDTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <MDButton color="error" onClick={handleDelete}>
            Delete
          </MDButton>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default SubtopicManagement;