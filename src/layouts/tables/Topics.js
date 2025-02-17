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

function TopicManagement() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [universities, setUniversities] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [searchParams, setSearchParams] = useState({
    universityId: "",
    subjectId: "",
    gradeId: ""
  });
  const [formData, setFormData] = useState({
    name: "",
    universityId: "",
    subjectId: "",
    gradeId: ""
  });
  const [editData, setEditData] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [message, setMessage] = useState({ type: "", content: "" });

  // Define a common style object for input fields
  const inputStyle = {
    width: "100%",
    mb: 2, // Margin bottom for spacing
    padding: "14px 14px"
  };

  // Fetch topics
  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${BASE_URL}topics`, {
        params: searchParams
      });
      setTopics(response.data || []);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", content: "Failed to fetch topics" });
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch universities
  const fetchUniversities = async () => {
    try {
      const response = await axios.get(`${BASE_URL}admin/university`);
      setUniversities(response.data.data.reverse() || []);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", content: "Failed to fetch universities" });
    }
  };

  // Fetch subjects based on the selected universityId
  const fetchSubjects = async (universityId) => {
    try {
      const response = await axios.get(`${BASE_URL}admin/subject?universityId=${universityId}`);
      setSubjects(response.data.data.reverse() || []);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", content: "Failed to fetch subjects" });
    }
  };

  // Fetch grades based on universityId
  const fetchGrades = async (universityId) => {
    try {
      const response = await axios.get(`${BASE_URL}admin/grade?universityId=${universityId}`);
      setGrades(response.data.data.reverse() || []);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", content: "Failed to fetch grades" });
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchUniversities();
  }, []);

  // Add useEffect to trigger search when filters change
  useEffect(() => {
    fetchTopics();
    if (searchParams.universityId) {
      fetchSubjects(searchParams.universityId);  // Fetch subjects when universityId changes
      fetchGrades(searchParams.universityId);  // Fetch grades when universityId changes
    }
  }, [searchParams]);

  // Handle search params change
  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  // Handle form data change
  const handleFormDataChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (e.target.name === "universityId") {
      fetchSubjects(e.target.value);  // Fetch subjects based on the universityId selected
      fetchGrades(e.target.value);    // Fetch grades based on universityId selected
    }
  };

  // Handle edit data change
  const handleEditDataChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
    if (e.target.name === "universityId") {
      fetchSubjects(e.target.value);  // Fetch subjects when universityId changes
      fetchGrades(e.target.value);    // Fetch grades when universityId changes
    }
  };

  // Create topic
  const handleCreate = async () => {
    try {
      const response = await axios.post(`${BASE_URL}topics`, formData);
      setMessage({ type: "success", content: "Topic created successfully!" });
      setOpenCreate(false);
      fetchTopics();
    } catch (error) {
      setMessage({ type: "error", content: "Failed to create topic" });
    }
  };

  // Update topic
  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}topics/${selectedTopic.id}`, editData);
      setMessage({ type: "success", content: "Topic updated successfully!" });
      setOpenEdit(false);
      fetchTopics();
    } catch (error) {
      setMessage({ type: "error", content: "Failed to update topic" });
    }
  };

  // Delete topic
  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}topics/${selectedTopic.id}`);
      setMessage({ type: "success", content: "Topic deleted successfully!" });
      setOpenDelete(false);
      fetchTopics();
    } catch (error) {
      setMessage({ type: "error", content: "Failed to delete topic" });
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
                    Topic
                  </MDTypography>
                  <MDButton variant="gradient" color="error" onClick={() => setOpenCreate(true)}>
                    Create Topic
                  </MDButton>
                </MDBox>
              </MDBox>
              <MDBox p={3}>
                {/* Search Filters */}
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined">
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
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined">
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
                    <FormControl fullWidth variant="outlined">
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

                {/* Topics List */}
                {loading ? (
                  <MDTypography variant="body2">Loading topics...</MDTypography>
                ) : topics.length > 0 ? (
                  <Grid container spacing={2}>
                    {topics.map((topic) => (
                      <Grid item xs={12} key={topic.id}>
                        <Card sx={{ p: 2 }}>
                          <MDBox display="flex" justifyContent="space-between" alignItems="center">
                            <MDTypography variant="h6">{topic.name}</MDTypography>
                            <MDBox>
                              <MDButton
                                color="info"
                                onClick={() => {
                                  setSelectedTopic(topic);
                                  setEditData(topic);
                                  fetchSubjects(topic.universityId); // Fetch subjects for the selected university
                                  fetchGrades(topic.universityId); // Fetch grades for the selected university
                                  setOpenEdit(true);
                                }}
                              >
                                Edit
                              </MDButton>
                              <MDButton
                                color="error"
                                sx={{ ml: 1 }}
                                onClick={() => {
                                  setSelectedTopic(topic);
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
                  <MDTypography variant="body2">No topics found</MDTypography>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Create Modal */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Create New Topic</DialogTitle>
        <DialogContent>
          <MDBox pt={2} pb={2}>
            <TextField
              fullWidth
              label="Topic Name"
              name="name"
              value={formData.name}
              onChange={handleFormDataChange}
              sx={inputStyle}
            />
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>University</InputLabel>
              <Select
                name="universityId"
                value={formData.universityId}
                onChange={handleFormDataChange}
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
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Subject</InputLabel>
              <Select
                name="subjectId"
                value={formData.subjectId}
                onChange={handleFormDataChange}
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
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Grade</InputLabel>
              <Select
                name="gradeId"
                value={formData.gradeId}
                onChange={handleFormDataChange}
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
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Topic</DialogTitle>
        <DialogContent>
          <MDBox pt={2} pb={2}>
            <TextField
              fullWidth
              label="Topic Name"
              name="name"
              value={editData?.name}
              onChange={handleEditDataChange}
              sx={inputStyle}
            />
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>University</InputLabel>
              <Select
                name="universityId"
                value={editData?.universityId}
                onChange={handleEditDataChange}
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
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Subject</InputLabel>
              <Select
                name="subjectId"
                value={editData?.subjectId}
                onChange={handleEditDataChange}
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
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Grade</InputLabel>
              <Select
                name="gradeId"
                value={editData?.gradeId}
                onChange={handleEditDataChange}
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
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Topic</DialogTitle>
        <DialogContent>
          <MDTypography>
            Are you sure you want to delete this topic?
          </MDTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default TopicManagement;