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

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
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
    photo: null, // Added to handle file uploads
    user_id: "", // Added to handle user_id
  });

  // Helper function to convert date format
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
            dob: formatDate(vendor.dob), // Convert date format
          })).reverse());
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
      const response = await fetch("https://bluecollar.sndktech.online/api/signup/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVendor),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();

      if (response.ok) {
        setVendors((prev) => [
          ...prev,
          {
            ...result.data,
            dob: formatDate(result.data.dob), // Convert date format
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

      // Append all fields to the FormData object
      formData.append('full_name', newVendor.full_name);
      formData.append('phone_number', newVendor.phone_number);
      formData.append('dob', newVendor.dob);
      formData.append('age', newVendor.age);
      formData.append('aadhar_card_number', newVendor.aadhar_card_number);
      formData.append('pancard_number', newVendor.pancard_number);
      formData.append('landmark', newVendor.landmark);
      formData.append('city', newVendor.city);
      formData.append('pincode', newVendor.pincode);
      formData.append('name_as_per_bank_details', newVendor.name_as_per_bank_details);
      formData.append('account_number', newVendor.account_number);
      formData.append('ifsc_code', newVendor.ifsc_code);
      formData.append('gender', newVendor.gender);
      formData.append('flat_no', newVendor.flat_no);

      // Append the photo file if it exists
      if (newVendor.photo) {
        formData.append('photo', newVendor.photo);
      }

      // Send the PUT request with FormData
      const response = await fetch(
        `https://bluecollar.sndktech.online/api/vendors/${newVendor.user_id}`,
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
        // Update the vendors list with the updated vendor data
        setVendors((prevVendors) =>
          prevVendors.map((vendor) =>
            vendor.id === newVendor.id ? { ...vendor, ...newVendor, dob: formatDate(newVendor.dob) } : vendor
          )
        );

        // Close the modal and reset the form
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
          `https://bluecollar.sndktech.online/api/signup/users/${vendorId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        if (result.success) {
          setVendors((prevVendors) =>
            prevVendors.filter((vendor) => vendor.id !== vendorId)
          );
          alert("Vendor deleted successfully!");
        } else {
          alert(result.error || "Failed to delete vendor");
        }
      } catch (error) {
        console.error("Error deleting vendor:", error);
        alert("Failed to delete vendor. Please check your network connection and try again.");
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
      setNewVendor({
        ...vendor,
        dob: formatDate(vendor.dob), // Ensure date is in the correct format
      });
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
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone_number" },
    { Header: "Gender", accessor: "gender" },
    { Header: "DOB", accessor: "dob" },
    { Header: "Age", accessor: "age" },
    { Header: "Aadhar Card", accessor: "aadhar_card_number" },
    { Header: "Pancard", accessor: "pancard_number" },
    { Header: "Flat No", accessor: "flat_no" },
    { Header: "Landmark", accessor: "landmark" },
    { Header: "City", accessor: "city" },
    { Header: "Pincode", accessor: "pincode" },
    { Header: "Bank Name", accessor: "name_as_per_bank_details" },
    { Header: "Account Number", accessor: "account_number" },
    { Header: "IFSC Code", accessor: "ifsc_code" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setNewVendor(row.original);
              setOpenModal(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteVendor(row.original.id)}
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
                  Vendors Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <DataTable table={{ columns, rows: vendors }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Modal for creating or editing vendor */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{newVendor.id ? "Edit Vendor" : "Create Vendor"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            fullWidth
            name="full_name"
            value={newVendor.full_name}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Email"
            fullWidth
            name="email"
            value={newVendor.email}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Phone Number"
            fullWidth
            name="phone_number"
            value={newVendor.phone_number}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Gender"
            fullWidth
            name="gender"
            value={newVendor.gender}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="DOB"
            fullWidth
            name="dob"
            value={newVendor.dob}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Age"
            fullWidth
            name="age"
            value={newVendor.age}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Aadhar Card Number"
            fullWidth
            name="aadhar_card_number"
            value={newVendor.aadhar_card_number}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Pancard Number"
            fullWidth
            name="pancard_number"
            value={newVendor.pancard_number}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Flat No"
            fullWidth
            name="flat_no"
            value={newVendor.flat_no}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Landmark"
            fullWidth
            name="landmark"
            value={newVendor.landmark}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="City"
            fullWidth
            name="city"
            value={newVendor.city}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Pincode"
            fullWidth
            name="pincode"
            value={newVendor.pincode}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Bank Name"
            fullWidth
            name="name_as_per_bank_details"
            value={newVendor.name_as_per_bank_details}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Account Number"
            fullWidth
            name="account_number"
            value={newVendor.account_number}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="IFSC Code"
            fullWidth
            name="ifsc_code"
            value={newVendor.ifsc_code}
            onChange={handleInputChange}
            margin="normal"
          />
          <input
            type="file"
            name="photo"
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={newVendor.user_id ? handleUpdateVendor : handleCreateVendor} color="primary">
            {newVendor.user_id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Vendors;