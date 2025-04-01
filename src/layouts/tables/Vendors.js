import { useEffect, useState } from "react";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Badge,
  Avatar,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { green, orange } from "@mui/material/colors";

// BLISSIQ ADMIN React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// BLISSIQ ADMIN React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openAadhaarModal, setOpenAadhaarModal] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null);
  const [newVendor, setNewVendor] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
    gender: "",
    dob: "",
    age: "",
    aadhar_card_number: "",
    pancard_number: "",
    flat_no: "",
    landmark: "",
    city: "",
    pincode: "",
    name_as_per_bank_details: "",
    account_number: "",
    ifsc_code: "",
    photo: null,
    user_id: "",
    aadhaar_front: "",
    aadhaar_back: "",
  });

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  // Fetch vendors data
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch("https://bluecollar.sndktech.online/api/signup/users/list/vendor");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data && data.totalRecords) {
          setVendors(data.data.map(vendor => ({
            ...vendor,
            dob: formatDate(vendor.dob),
          })));
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        alert("Failed to fetch vendor data. Please check your network connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleCreateVendor = async () => {
    try {
      const formData = new FormData();
      Object.entries(newVendor).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      const response = await fetch("https://bluecollar.sndktech.online/api/signup/users", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();
      if (response.ok) {
        setVendors(prev => [
          ...prev,
          {
            ...result.data,
            dob: formatDate(result.data.dob),
          },
        ]);
        setOpenModal(false);
        setNewVendor({
          full_name: "",
          email: "",
          password: "",
          phone_number: "",
          gender: "",
          dob: "",
          age: "",
          aadhar_card_number: "",
          pancard_number: "",
          flat_no: "",
          landmark: "",
          city: "",
          pincode: "",
          name_as_per_bank_details: "",
          account_number: "",
          ifsc_code: "",
          photo: null,
          user_id: "",
          aadhaar_front: "",
          aadhaar_back: "",
        });
        alert("Vendor created successfully!");
      } else {
        alert(result.error || "Failed to create vendor");
      }
    } catch (error) {
      console.error("Error creating vendor:", error);
      alert("Failed to create vendor. Please check your network connection and try again.");
    }
  };

  const handleUpdateVendor = async () => {
    try {
      const formData = new FormData();
      Object.entries(newVendor).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      const response = await fetch(
        `https://bluecollar.sndktech.online/api/vendors/${newVendor.user_id}`,
        { method: "PUT", body: formData }
      );

      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();
      if (response.ok) {
        setVendors(prevVendors =>
          prevVendors.map(vendor =>
            vendor.user_id === newVendor.user_id 
              ? { ...vendor, ...newVendor, dob: formatDate(newVendor.dob) } 
              : vendor
          )
        );
        setOpenModal(false);
        setNewVendor({
          full_name: "",
          email: "",
          password: "",
          phone_number: "",
          gender: "",
          dob: "",
          age: "",
          aadhar_card_number: "",
          pancard_number: "",
          flat_no: "",
          landmark: "",
          city: "",
          pincode: "",
          name_as_per_bank_details: "",
          account_number: "",
          ifsc_code: "",
          photo: null,
          user_id: "",
          aadhaar_front: "",
          aadhaar_back: "",
        });
        alert("Vendor updated successfully!");
      } else {
        alert(result.error || "Failed to update vendor");
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
      alert("Failed to update vendor. Please check your network connection and try again.");
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this vendor?");
    if (confirmDelete) {
      try {
        const response = await fetch(
          `https://bluecollar.sndktech.online/api/auth/vendor/delete/${vendorId}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();
        if (result.success) {
          setVendors(prevVendors => prevVendors.filter(vendor => vendor.user_id !== vendorId));
          alert("Vendor deleted successfully!");
        } else {
          alert(result.message || "Failed to delete vendor");
        }
      } catch (error) {
        console.error("Error deleting vendor:", error);
        alert("Failed to delete vendor. Please check your network connection and try again.");
      }
    }
  };

  const handleVerifyAadhaar = async (vendorId) => {
    const confirmVerify = window.confirm("Are you sure you want to verify this vendor's Aadhaar?");
    if (confirmVerify) {
      try {
        setVerifyingId(vendorId);
        const response = await fetch(
          `https://bluecollar.sndktech.online/api/signup/verify/user/${vendorId}`,
          { method: "POST" }
        );

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        if (response.ok) {
          setVendors(prevVendors =>
            prevVendors.map(vendor =>
              vendor.user_id === vendorId ? { ...vendor, isVerify: 1 } : vendor
            )
          );
          alert("Aadhaar verified successfully!");
        } else {
          alert(result.error || "Failed to verify Aadhaar");
        }
      } catch (error) {
        console.error("Error verifying Aadhaar:", error);
        alert("Failed to verify Aadhaar. Please check your network connection and try again.");
      } finally {
        setVerifyingId(null);
      }
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'photo') {
      setNewVendor({ ...newVendor, [e.target.name]: e.target.files[0] });
    } else {
      setNewVendor({ ...newVendor, [e.target.name]: e.target.value });
    }
  };

  const handleOpenModal = (vendor = null) => {
    if (vendor) {
      setNewVendor({ ...vendor, dob: formatDate(vendor.dob) });
    } else {
      setNewVendor({
        full_name: "",
        email: "",
        password: "",
        phone_number: "",
        gender: "",
        dob: "",
        age: "",
        aadhar_card_number: "",
        pancard_number: "",
        flat_no: "",
        landmark: "",
        city: "",
        pincode: "",
        name_as_per_bank_details: "",
        account_number: "",
        ifsc_code: "",
        photo: null,
        user_id: "",
        aadhaar_front: "",
        aadhaar_back: "",
      });
    }
    setOpenModal(true);
  };

  const handleOpenAadhaarModal = (vendor) => {
    setNewVendor({ ...vendor, dob: formatDate(vendor.dob) });
    setOpenAadhaarModal(true);
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
                    Loading Vendors Data...
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
    // { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone_number" },
    { Header: "Gender", accessor: "gender" },
    { Header: "DOB", accessor: "dob" },
    { Header: "Aadhar", accessor: "aadhar_card_number" },
    {
      Header: "Verification",
      accessor: "verification",
      Cell: ({ row }) => {
        const isVerifying = verifyingId === row.original.user_id;
        const isVerified = row.original.isVerify === 1;
        
        return (
          <Tooltip title={isVerified ? "Verified" : isVerifying ? "Verifying..." : "Verify Aadhaar"}>
            <IconButton
              onClick={() => !isVerified && !isVerifying && handleVerifyAadhaar(row.original.user_id)}
              disabled={isVerifying || isVerified}
              sx={{
                color: isVerified ? green[500] : orange[500],
                '&:hover': {
                  backgroundColor: isVerified ? 'transparent' : 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              {isVerifying ? (
                <CircularProgress size={24} />
              ) : isVerified ? (
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <VerifiedUserIcon 
                      fontSize="small" 
                      sx={{ 
                        color: green[500],
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        padding: '2px'
                      }} 
                    />
                  }
                >
                  <Avatar sx={{ bgcolor: green[100], width: 24, height: 24 }}>
                    <CheckCircleIcon fontSize="small" sx={{ color: green[500] }} />
                  </Avatar>
                </Badge>
              ) : (
                <PendingIcon />
              )}
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleOpenModal(row.original)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDeleteVendor(row.original.user_id)}
          >
            Delete
          </Button>
          <Button
             variant="contained"
             color="error"
             size="small"
            onClick={() => handleOpenAadhaarModal(row.original)}
          >
            View Aadhaar
          </Button>
        </div>
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
                  Vendors 
                </MDTypography>
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={() => handleOpenModal()}
                >
                  Add New Vendor
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <DataTable 
                  table={{ columns, rows: vendors }} 
                  isSorted={false} 
                  entriesPerPage={false} 
                  showTotalEntries={false} 
                  noEndBorder 
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Vendor Edit/Create Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>{newVendor.user_id ? "Edit Vendor" : "Create New Vendor"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Full Name"
                fullWidth
                name="full_name"
                value={newVendor.full_name}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                fullWidth
                name="email"
                value={newVendor.email}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            {/* Add other fields in similar grid items */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button 
            onClick={newVendor.user_id ? handleUpdateVendor : handleCreateVendor} 
            variant="contained" 
            color="primary"
          >
            {newVendor.user_id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Aadhaar View Modal */}
      <Dialog open={openAadhaarModal} onClose={() => setOpenAadhaarModal(false)} maxWidth="md">
        <DialogTitle>Aadhaar Details</DialogTitle>
        <DialogContent>
          <MDBox p={2}>
            <MDTypography variant="h6" gutterBottom>
              Aadhaar Number: {newVendor.aadhar_card_number}
            </MDTypography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <MDTypography variant="subtitle1">Front Side</MDTypography>
                {newVendor.aadhaar_front && (
                  <img
                    src={newVendor.aadhaar_front}
                    alt="Aadhaar Front"
                    style={{ width: '100%', border: '1px solid #eee', borderRadius: 4 }}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <MDTypography variant="subtitle1">Back Side</MDTypography>
                {newVendor.aadhaar_back && (
                  <img
                    src={newVendor.aadhaar_back}
                    alt="Aadhaar Back"
                    style={{ width: '100%', border: '1px solid #eee', borderRadius: 4 }}
                  />
                )}
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAadhaarModal(false)}>Close</Button>
          {newVendor.isVerify !== 1 && (
            <Button 
              onClick={() => handleVerifyAadhaar(newVendor.user_id)}
              variant="contained" 
              color="primary"
              disabled={verifyingId === newVendor.user_id}
            >
              {verifyingId === newVendor.user_id ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Verify Aadhaar"
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Vendors;