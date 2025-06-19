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

function SubCategories() {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState({
    category_id: "",
    name: "",
  });

  // Fetch both sub-categories and categories data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch sub-categories
      const subCatResponse = await fetch("https://bluecollar.sndktech.online/api/sub-categories/list");
      const subCatData = await subCatResponse.json();
      
      // Fetch categories for dropdown
      const catResponse = await fetch("https://bluecollar.sndktech.online/api/categories/");
      if (!catResponse.ok) throw new Error('Failed to fetch categories');
      const catData = await catResponse.json();
      
      setSubCategories(subCatData);
      setCategories(catData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data. Please check your network connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSubCategory = async () => {
    try {
      const response = await fetch("https://bluecollar.sndktech.online/api/sub-categories/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_id: newSubCategory.category_id,
          name: newSubCategory.name,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create sub-category');
      }

      // Re-fetch the data
      await fetchData();
      setOpenModal(false);
      setNewSubCategory({
        category_id: "",
        name: "",
      });
      alert("Sub-category created successfully!");
    } catch (error) {
      console.error("Error creating sub-category:", error);
      alert(error.message || "Failed to create sub-category. Please try again.");
    }
  };

  const handleUpdateSubCategory = async () => {
    try {
      const response = await fetch(
        `https://bluecollar.sndktech.online/api/sub-categories/update/${newSubCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newSubCategory.name,
          }),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update sub-category');
      }

      // Update local state directly for better UX
      setSubCategories(prev => prev.map(item => 
        item.id === newSubCategory.id ? { ...item, name: newSubCategory.name } : item
      ));
      
      setOpenModal(false);
      setNewSubCategory({
        category_id: "",
        name: "",
      });
      alert("Sub-category updated successfully!");
    } catch (error) {
      console.error("Error updating sub-category:", error);
      alert(error.message || "Failed to update sub-category. Please try again.");
    }
  };

  const handleDeleteSubCategory = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this sub-category?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://bluecollar.sndktech.online/api/sub-categories/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete sub-category');
      }

      // Update local state
      setSubCategories(prev => prev.filter(item => item.id !== id));
      alert("Sub-category deleted successfully!");
    } catch (error) {
      console.error("Error deleting sub-category:", error);
      alert(error.message || "Failed to delete sub-category. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (subCategory = null) => {
    if (subCategory) {
      setNewSubCategory(subCategory);
    } else {
      setNewSubCategory({
        category_id: "",
        name: "",
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
                    Loading Sub-Categories Data...
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
    { 
      Header: "Category", 
      accessor: "category_id",
      Cell: ({ row }) => {
        const category = categories.find(cat => cat.id === row.original.category_id);
        return category ? category.category_name : "Unknown";
      }
    },
    { Header: "Sub-Category Name", accessor: "name" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleOpenModal(row.original)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteSubCategory(row.original.id)}
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
                  Sub-Categories
                </MDTypography>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <DataTable 
                    table={{ columns, rows: subCategories }} 
                    isSorted={false} 
                    entriesPerPage={false} 
                    showTotalEntries={false} 
                    noEndBorder 
                  />
                </MDBox>
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    backgroundColor: "white",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "white",
                    },
                  }}
                  onClick={() => handleOpenModal()}
                >
                  Create Sub-Category
                </Button>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Modal for creating or editing sub-category */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{newSubCategory.id ? "Edit Sub-Category" : "Create Sub-Category"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category_id"
              value={newSubCategory.category_id}
              onChange={handleInputChange}
              label="Category"
              disabled={!!newSubCategory.id} // Disable when editing as API doesn't support category_id update
              sx={{ width: 200,height: 40 }}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.category_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Sub-Category Name"
            fullWidth
            name="name"
            value={newSubCategory.name}
            onChange={handleInputChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={newSubCategory.id ? handleUpdateSubCategory : handleCreateSubCategory} color="error">
            {newSubCategory.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default SubCategories;