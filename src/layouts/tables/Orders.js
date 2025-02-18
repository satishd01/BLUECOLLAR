import { useEffect, useState } from "react";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// BLISSIQ ADMIN React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// BLISSIQ ADMIN React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://bluecollar.sndktech.online/api/service/service/booking");
        if (response.data) {
          setOrders(response.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
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
                  <MDTypography variant="h6" color="white">
                    Loading Orders Data...
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

  // Custom cell renderer for the services column
  // const renderServices = (services) => {
  //   return services.map((service, index) => (
  //     <div key={index} style={{ marginBottom: '10px' }}>
  //       <Typography variant="body2" style={{ fontWeight: 'bold' }}>{service.service_name}</Typography>
  //       <Typography variant="body2">Worker: {service.worker_name}</Typography>
  //       <Typography variant="body2">Charge: ${service.service_charge}</Typography>
  //       <img
  //         src={service.service_image}
  //         alt={service.service_name}
  //         style={{ width: '50px', height: '50px', borderRadius: '50%', margin: '5px 0' }}
  //       />
  //     </div>
  //   ));
  // };

  const columns = [
    { Header: "Booking ID", accessor: "booking_id" },
    { Header: "User ID", accessor: "user_id" },
    { Header: "Total Amount", accessor: "total_amount" },
    { Header: "Discount Amount", accessor: "discount_amount" },
    { Header: "Payment Status", accessor: "payment_status" },
    { Header: "Booking Status", accessor: "booking_status" },
    { Header: "Service Date", accessor: "service_date" },
    { Header: "Address", accessor: "address" },
    { Header: "Contact", accessor: "contact" },
    { Header: "Coupon Code", accessor: "coupon_code" },
    { Header: "Created At", accessor: "created_at" },
    // {
    //   Header: "Services",
    //   accessor: "services",
    //   Cell: ({ value }) => <div>{renderServices(value)}</div>,
    // },
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
              >
                <MDTypography variant="h6" color="white">
                  Orders Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <DataTable
                    table={{ columns, rows: orders }}
                    isSorted={false}
                    entriesPerPage={true}
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