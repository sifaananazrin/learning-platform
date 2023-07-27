import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import axios from "../../../../api/axios";
import { config } from "../../../../Helpers/axiosUserEndpoints";
import Spinner from "../../../../component/Spinner";
// import photo_card from "../../../../assets/photo_card.png";
import plus from "../../../../assets/plus.svg";
import Wrapper from "../Wrapper";
import styles from "./styles";

const FeaturedCards = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedCourses, setSelectedCourses] = useState(null);

  const user_id = localStorage.getItem("uid");

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const response = await axios.get("/api/course", config);
        setCourses(response.data.course);
        setLoading(false);
        setError(null);
        // console.log(response.data.course);
      } catch (err) {
        console.error(err);
        // window.location= "/user/login"
        localStorage.removeItem("usertoken");
        localStorage.removeItem("uid");
        return;
      }
    }

    fetchCourses();
  }, []);

  const CouresDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/product/${id}`, {
        ...config,
        params: { user_id: user_id },
      });
      setLoading(false);
      setSelectedCourses(response.data.found);
      navigate("/user/course-details", {
        state: { selectedCourses: response.data },
      });
    } catch (error) {
      localStorage.removeItem("usertoken");
      localStorage.removeItem("uid");
      console.log(error);
    }
  };

  // if (error) {

  //   localStorage.removeItem("usertoken")
  //         localStorage.removeItem("uid");// Navigate to the login page if there's an error
  //   return null; // Return null to prevent rendering the component
  // }

  return (
    <>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <Box>
          <Wrapper>
            <Grid
              container
              rowSpacing={4}
              columnSpacing={3}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {courses.map((course, index) => {
                return (
                  <Grid item xs={4} sm={4} md={4} key={index}>
                    <Card sx={styles.card}>
                      <Box sx={styles.blockPhoto}>
                        <Box
                          component="div"
                          sx={{
                            width: "100%",
                            height: "0",
                            paddingBottom: "56.25%", // 16:9 aspect ratio
                            position: "relative",
                            background:
                              course.image && course.image.length > 0
                                ? `url(${course.image[0].url}) no-repeat center center`
                                : undefined,
                            backgroundSize: "cover", // or 'contain'
                          }}
                        />

                        <Box sx={styles.language}>{course.name}</Box>
                      </Box>
                      <Box sx={{ textAlign: "center", m: "24px 0" }}>
                        {course.title}
                      </Box>
                      <Divider sx={styles.divider} />
                      <Box sx={styles.footerCard}>
                        <Box sx={styles.price}>Rs{course.price}</Box>
                        <Link sx={styles.link}>
                          <Box
                            onClick={() => CouresDetails(course._id)}
                            component="span"
                            sx={{ mr: "5px" }}
                          >
                            enroll now
                          </Box>
                          <Box component="img" src={plus} />
                        </Link>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Wrapper>
        </Box>
      )}
    </>
  );
};

export default FeaturedCards;
