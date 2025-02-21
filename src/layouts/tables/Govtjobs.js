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
  Button,
  Typography,
  Grid,
  Card,
  Box,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function GovernmentJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newJob, setNewJob] = useState({
    job_type: "",
    title: "",
    experience: "",
    location: "",
    salary: "",
    vacancy: 0,
    last_date: "",
    about_company: "",
    about_job: "",
  });
  const [modalKey, setModalKey] = useState(0); // Key to force reset the modal

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("https://bluecollar.sndktech.online/api/govt-jobs/list");
      if (response.data) {
        setJobs(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("Failed to fetch jobs data. Please check your network connection and try again.");
      setLoading(false);
    }
  };

  const handleCreateJob = async () => {
    try {
      const response = await axios.post(
        "https://bluecollar.sndktech.online/api/govt-jobs/create",
        newJob
      );
      if (response.status === 201) {
        setJobs([...jobs, response.data]);
        setOpenModal(false);
        setNewJob({
          job_type: "",
          title: "",
          experience: "",
          location: "",
          salary: "",
          vacancy: 0,
          last_date: "",
          about_company: "",
          about_job: "",
        });
        setModalKey(prevKey => prevKey + 1); 
        alert("Job created successfully!");
      } else {
        alert(response.data.error || "Failed to create job");
      }
    } catch (error) {
      alert("Error creating job. Please check your network connection and try again.");
    }
  };

  const handleUpdateJob = async () => {
    try {
      const updatedJob = { ...newJob };
      if (updatedJob.last_date) {
        updatedJob.last_date = formatDate(updatedJob.last_date);
      }

      const response = await axios.put(
        `https://bluecollar.sndktech.online/api/govt-jobs/${newJob.id}`,
        updatedJob
      );
      if (response.status === 200) {
        setJobs(jobs.map(job => job.id === newJob.id ? response.data : job));
        setOpenModal(false);
        setNewJob({
          job_type: "",
          title: "",
          experience: "",
          location: "",
          salary: "",
          vacancy: 0,
          last_date: "",
          about_company: "",
          about_job: "",
        });
        setModalKey(prevKey => prevKey + 1); // Reset the modal
        alert("Job updated successfully!");
      } else {
        alert(response.data.error || "Failed to update job");
      }
    } catch (error) {
      alert("Error updating job. Please check your network connection and try again.");
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const response = await axios.delete(
          `https://bluecollar.sndktech.online/api/govt-jobs/${id}`
        );
        if (response.status === 200) {
          setJobs(jobs.filter(job => job.id !== id));
          alert("Job deleted successfully!");
        }
      } catch (error) {
        alert("Error deleting job. Please check your network connection and try again.");
      }
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'last_date') {
      setNewJob({ ...newJob, [e.target.name]: e.target.value });
    } else {
      setNewJob({ ...newJob, [e.target.name]: e.target.value });
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = new Date(date).toISOString().split("T")[0].split("-");
    return `${year}-${month}-${day}`;
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
                    Loading Jobs Data...
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
    { Header: "Job Type", accessor: "job_type" },
    { Header: "Title", accessor: "title" },
    { Header: "Experience", accessor: "experience" },
    { Header: "Location", accessor: "location" },
    { Header: "Salary", accessor: "salary" },
    { Header: "Vacancy", accessor: "vacancy" },
    { Header: "Last Date", accessor: "last_date" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setNewJob({
                ...row.original,
                last_date: formatDate(row.original.last_date),
              });
              setOpenModal(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteJob(row.original.id)}
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
                  Government Jobs Table
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
                    setNewJob({
                      job_type: "",
                      title: "",
                      experience: "",
                      location: "",
                      salary: "",
                      vacancy: 0,
                      last_date: "",
                      about_company: "",
                      about_job: "",
                    });
                    setModalKey(prevKey => prevKey + 1); // Reset the modal
                    setOpenModal(true);
                  }}
                >
                  Create Job
                </Button>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <DataTable
                    table={{ columns, rows: jobs }}
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
        <DialogTitle>{newJob.id ? "Edit Job" : "Create Job"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth margin="normal"
            label="Job Type"
            name="job_type"
            value={newJob.job_type}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth margin="normal"
            label="Title"
            name="title"
            value={newJob.title}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth margin="normal"
            label="Experience"
            name="experience"
            value={newJob.experience}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth margin="normal"
            label="Location"
            name="location"
            value={newJob.location}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth margin="normal"
            label="Salary"
            name="salary"
            value={newJob.salary}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth margin="normal"
            label="Vacancy"
            type="number"
            name="vacancy"
            value={newJob.vacancy}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth margin="normal"
            label="Last Date"
            type="date"
            name="last_date"
            value={newJob.last_date}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth margin="normal"
            label="About Company"
            name="about_company"
            value={newJob.about_company}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth margin="normal"
            label="About Job"
            name="about_job"
            value={newJob.about_job}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={newJob.id ? handleUpdateJob : handleCreateJob}>
            {newJob.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Footer />
    </DashboardLayout>
  );
}

export default GovernmentJobs;