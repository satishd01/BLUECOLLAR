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
  Link,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function GovernmentJobApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobId, setJobId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      let url = "https://bluecollar.sndktech.online/api/govt-jobs/applications/list";
      if (jobId) {
        url = `https://bluecollar.sndktech.online/api/govt-jobs/applications/job/${jobId}`;
      }
      const response = await axios.get(url);
      if (response.data) {
        setApplications(response.data.reverse());
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      alert("Failed to fetch applications data. Please check your network connection and try again.");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setJobId(e.target.value);
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
                    Loading Applications Data...
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
    { Header: "Application ID", accessor: "application_id" },
    { Header: "First Name", accessor: "firstname" },
    { Header: "Last Name", accessor: "lastname" },
    { Header: "Education", accessor: "education" },
    {
      Header: "Resume",
      accessor: "resume",
      Cell: ({ row }) => (
        <Link
          href={row.original.resume}
          target="_blank"
          sx={{ color: 'blue', textDecoration: 'none' }}
        >
          View Resume
        </Link>
      ),
    },
    { Header: "User ID", accessor: "user_id" },
    { Header: "Job ID", accessor: "job_id" },
    { Header: "Job Title", accessor: "job_title" },
    { Header: "Job Type", accessor: "job_type" },
    { Header: "Location", accessor: "location" },
    { Header: "Salary", accessor: "salary" },
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
                  Job Applications
                </MDTypography>
                <TextField
                  fullWidth={false}
                  margin="normal"
                  label="Filter by Job ID"
                  name="job_id"
                  type="number"
                  value={jobId || ""}
                  onChange={handleInputChange}
                  sx={{
                    backgroundColor: '#f0f0f0', // Light grey background
                    borderRadius: '4px',
                    width: '200px', // Shorter input box
                  }}
                />
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <DataTable
                    table={{ columns, rows: applications }}
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
      <Footer />
    </DashboardLayout>
  );
}

export default GovernmentJobApplications;