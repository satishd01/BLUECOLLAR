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

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newBlog, setNewBlog] = useState({
    header: "",
    title: "",
    content: "",
    image: null,
    urls: [], // Ensure this is always an array
  });
  const [modalKey, setModalKey] = useState(0); // Key to force reset the modal

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("https://bluecollar.sndktech.online/api/blog/all");
      if (response.data && response.data.data) {
        setBlogs(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      alert("Failed to fetch blogs data. Please check your network connection and try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateBlog = async () => {
    try {
      const formData = new FormData();
      formData.append("header", newBlog.header);
      formData.append("title", newBlog.title);
      formData.append("content", newBlog.content);
      if (newBlog.image) {
        formData.append("image", newBlog.image);
      }
      formData.append("urls", JSON.stringify(newBlog.urls));

      const response = await axios.post(
        "https://bluecollar.sndktech.online/api/blog/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        setOpenModal(false);
        setNewBlog({
          header: "",
          title: "",
          content: "",
          image: null,
          urls: [],
        });
        alert("Blog created successfully!");
        fetchBlogs(); // Re-fetch blogs after creation
      } else {
        alert(response.data.error || "Failed to create blog");
      }
    } catch (error) {
      alert("Error creating blog. Please check your network connection and try again.");
    }
  };

  const handleUpdateBlog = async () => {
    try {
      const formData = new FormData();
      formData.append("header", newBlog.header);
      formData.append("title", newBlog.title);
      formData.append("content", newBlog.content);
      if (newBlog.image) {
        formData.append("image", newBlog.image);
      }
      formData.append("urls", JSON.stringify(newBlog.urls));

      const response = await axios.put(
        `https://bluecollar.sndktech.online/api/blog/update/${newBlog.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        setOpenModal(false);
        setNewBlog({
          header: "",
          title: "",
          content: "",
          image: null,
          urls: [],
        });
        alert("Blog updated successfully!");
        fetchBlogs(); // Re-fetch blogs after update
      } else {
        alert(response.data.error || "Failed to update blog");
      }
    } catch (error) {
      alert("Error updating blog. Please check your network connection and try again.");
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const response = await axios.delete(
          `https://bluecollar.sndktech.online/api/blog/delete/${id}`
        );
        if (response.status === 200) {
          alert("Blog deleted successfully!");
          fetchBlogs(); // Re-fetch blogs after deletion
        }
      } catch (error) {
        alert("Error deleting blog. Please check your network connection and try again.");
      }
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === "urls") {
      // Ensure urls is always an array
      const urlsArray = e.target.value.split(",").map(url => url.trim());
      setNewBlog({ ...newBlog, [e.target.name]: urlsArray });
    } else {
      setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
    }
  };

  const handleImageChange = (e) => {
    setNewBlog({ ...newBlog, image: e.target.files[0] });
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
                    Loading Blogs Data...
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
    { Header: "Header", accessor: "header" },
    { Header: "Title", accessor: "title" },
    { Header: "Content", accessor: "content" },
    { Header: "Image", accessor: "image" },
    { Header: "Urls", accessor: "urls" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
          <Button
            variant="contained"
            color="white"
            onClick={() => {
              setNewBlog({
                ...row.original,
                urls: row.original.urls || [], // Ensure urls is an array
              });
              setOpenModal(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteBlog(row.original.id)}
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
                  Blogs Table
                </MDTypography>
                <Button
                  variant="contained"
                  color="white"
                  sx={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    backgroundColor: "white",
                    color: "white",
                    "&:hover": { backgroundColor: "white" }
                  }}
                  onClick={() => {
                    setNewBlog({
                      header: "",
                      title: "",
                      content: "",
                      image: null,
                      urls: [],
                    });
                    setModalKey(prevKey => prevKey + 1); // Reset the modal
                    setOpenModal(true);
                  }}
                >
                  Create Blog
                </Button>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <DataTable
                    table={{ columns, rows: blogs }}
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
        <DialogTitle>{newBlog.id ? "Edit Blog" : "Create Blog"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth margin="normal"
            label="Header"
            name="header"
            value={newBlog.header}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth margin="normal"
            label="Title"
            name="title"
            value={newBlog.title}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth margin="normal"
            label="Content"
            name="content"
            value={newBlog.content}
            onChange={handleInputChange}
          />
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
          />
          <TextField
            fullWidth margin="normal"
            label="Urls (comma separated)"
            name="urls"
            value={newBlog.urls.join(",")} // Ensure urls is an array
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={newBlog.id ? handleUpdateBlog : handleCreateBlog}>
            {newBlog.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Footer />
    </DashboardLayout>
  );
}

export default Blogs;