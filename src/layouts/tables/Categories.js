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

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    category_name: "",
    image: null, // Added to handle file uploads
  });

  // Define the fetchCategories function at the top level
  const fetchCategories = async () => {
    try {
      const response = await fetch("https://bluecollar.sndktech.online/api/categories/");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to fetch categories. Please check your network connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Use the fetchCategories function in useEffect
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    try {
      const formData = new FormData();
      formData.append('category_name', newCategory.category_name);
      if (newCategory.image) {
        formData.append('image', newCategory.image);
      }

      const response = await fetch("https://bluecollar.sndktech.online/api/categories/", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();

      if (response.ok) {
        // Re-fetch the categories data
        fetchCategories();
        setOpenModal(false);
        setNewCategory({
          category_name: "",
          image: null,
        });
        alert("Category created successfully!");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category. Please check your network connection and try again.");
    }
  };

  const handleUpdateCategory = async () => {
    try {
      const formData = new FormData();
      formData.append('category_name', newCategory.category_name);
      if (newCategory.image) {
        formData.append('image', newCategory.image);
      }

      const response = await fetch(
        `https://bluecollar.sndktech.online/api/categories/categories/${newCategory.id}`,
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
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === newCategory.id ? { ...category, ...newCategory } : category
          )
        );
        setOpenModal(false);
        setNewCategory({
          category_name: "",
          image: null,
        });
        alert("Category updated successfully!");
      } else {
        alert(result.error || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category. Please check your network connection and try again.");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (confirmDelete) {
      try {
        const response = await fetch(
          `https://bluecollar.sndktech.online/api/categories/categories/${categoryId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        if (result) {
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== categoryId)
          );
          alert(result.message || "Category deleted successfully!");
        } else {
          alert(result.message || "Failed to delete category");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category. Please check your network connection and try again.");
      }
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'image') {
      setNewCategory({ ...newCategory, [e.target.name]: e.target.files[0] });
    } else {
      setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setNewCategory(category);
    } else {
      setNewCategory({
        category_name: "",
        image: null,
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
                    Loading Categories Data...
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
    { Header: "Category Name", accessor: "category_name" },
    {
      Header: "Image",
      accessor: "image",
      Cell: ({ row }) => (
        <img
          src={row.original.image}
          alt={row.original.category_name}
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
        />
      ),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setNewCategory(row.original);
              setOpenModal(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteCategory(row.original.id)}
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
                  Categories Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <DataTable table={{ columns, rows: categories }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
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
                  Create Category
                </Button>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Modal for creating or editing category */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{newCategory.id ? "Edit Category" : "Create Category"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            fullWidth
            name="category_name"
            value={newCategory.category_name}
            onChange={handleInputChange}
            margin="normal"
          />
          <input
            type="file"
            name="image"
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={newCategory.id ? handleUpdateCategory : handleCreateCategory} color="error">
            {newCategory.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Categories;