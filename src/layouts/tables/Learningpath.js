import { useEffect, useState } from "react";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import Icon from "@mui/material/Icon";

// BLISSIQ ADMIN React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// BLISSIQ ADMIN React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function LearningPath() {
  const [learningPath, setLearningPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openClasses, setOpenClasses] = useState({});

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        const response = await axios.get(
          "https://api.blissiq.cloud/learningPath.detail?universityId=39&subjectId=22"
        );
        if (response.data.data) {
          setLearningPath(response.data.data);
          // Initialize all classes as open by default
          const initialOpenState = response.data.data.reduce((acc, curr) => {
            acc[curr.classNo] = true;
            return acc;
          }, {});
          setOpenClasses(initialOpenState);
        }
      } catch (error) {
        console.error("Error fetching learning path:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLearningPath();
  }, []);

  const toggleClass = (classNo) => {
    setOpenClasses(prev => ({ ...prev, [classNo]: !prev[classNo] }));
  };

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
                    Loading Learning Path...
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
                  Learning Path Structure
                </MDTypography>
              </MDBox>
              <MDBox p={3}>
                {learningPath.map((classItem) => (
                  <Card key={classItem.classNo} sx={{ mb: 2 }}>
                    <MDBox
                      p={2}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      onClick={() => toggleClass(classItem.classNo)}
                      sx={{ cursor: "pointer" }}
                    >
                      <MDTypography variant="h6">
                        {classItem.name} (Class {classItem.classNo})
                      </MDTypography>
                      <Icon>
                        {openClasses[classItem.classNo] ? "expand_less" : "expand_more"}
                      </Icon>
                    </MDBox>
                    <Collapse in={openClasses[classItem.classNo]}>
                      <MDBox p={2}>
                        {classItem.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} style={{ marginBottom: "1rem" }}>
                            <MDTypography variant="button" fontWeight="bold">
                              {topic.name}
                            </MDTypography>
                            {topic.hasSubTopics ? (
                              <MDBox ml={2} mt={1}>
                                {topic.subTopics.map((subTopic, subIndex) => (
                                  <MDTypography
                                    key={subIndex}
                                    variant="body2"
                                    color="text"
                                    sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                                  >
                                    <Icon fontSize="small">chevron_right</Icon>
                                    {subTopic}
                                  </MDTypography>
                                ))}
                              </MDBox>
                            ) : (
                              <MDBox ml={2} mt={1}>
                                {topic.sessionVideos.map((video) => (
                                  <MDButton
                                    key={video.id}
                                    component="a"
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="text"
                                    color="info"
                                    sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                                  >
                                    <Icon fontSize="small">ondemand_video</Icon>
                                    Watch Video ({video.type})
                                  </MDButton>
                                ))}
                              </MDBox>
                            )}
                          </div>
                        ))}
                      </MDBox>
                    </Collapse>
                  </Card>
                ))}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default LearningPath;