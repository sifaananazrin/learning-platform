import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../../../api/axios";
import { config } from "../../../../Helpers/axiosTeacherEndpoints";
import Spinner from "../../../../component/Spinner";
import useStyles from "./CourseStyle";

function Course() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const teacherid = localStorage.getItem("tid");

  useEffect(() => {
    setLoading(true);
    axios
      .get("/teacher/courses", {
        params: {
          teacherid: teacherid,
        },
        headers: config.headers,
      })
      .then((response) => {
        setLoading(false);
        setCourses(response.data.course);
      })
      .catch((error) => {
        localStorage.removeItem("teachertoken");
        localStorage.removeItem("tid");
        console.log(error);
      });
  }, []);

  const handleRemove = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`/teacher/delectcoures/${id}`, config);
      if (response) {
        setLoading(false);
        // window.location.href = window.location.href;
        navigate("/teacher/course");
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`/teacher/editcoures/${id}`, config);
      setSelected(response.data);
      setLoading(false);
      console.log(response);
      navigate("/teacher/edit-course", { state: { selected: response.data } });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddCourse = () => {
    setShowAddCourseForm(true);
  };

  const navigate = useNavigate();

  function handleClick() {
    navigate("/teacher/edit-course");
  }

  return (
    <>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <div className={classes.root}>
          <div
            style={{
              display: "flex",
              marginLeft: "900px",
              marginBottom: "20px",
            }}
          >
            <Link to="/teacher/create-course">
              <Button
                variant="contained"
                style={{ backgroundColor: "#930050", color: "#ffffff" }}
              >
                Create Course
              </Button>
            </Link>
          </div>
          <TableContainer
            component={Paper}
            className={classes.table}
            style={{ width: "80%" }}
          >
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Link</TableCell>
                  <TableCell>status</TableCell>
                  <TableCell>Action</TableCell>
                  {/* <TableCell>Exam</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {courses &&
                  courses.map((course, index) => (
                    <TableRow key={course.id}>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.description}</TableCell>
                      <TableCell>{course.price}</TableCell>
                      <TableCell>{course.category}</TableCell>
                      <TableCell>{course.link}</TableCell>
                      <TableCell>{course.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEdit(course._id)}
                          style={{ height: "40px" }}
                        >
                          Edit
                        </Button>
                        &nbsp;
                        <Button
                          className={classes.actionButton}
                          variant="contained"
                          color="secondary"
                          onClick={() => handleRemove(course._id)}
                        >
                          Remove
                        </Button>
                      </TableCell>

                      <TableCell>
                        {" "}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            navigate("/teacher/addexam", {
                              state: { courseId: course._id },
                            })
                          }
                          style={{ height: "40px" }}
                        >
                          add Quiz
                        </Button>{" "}
                      </TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            navigate(`/teacher/viewexam/${course._id}`)
                          }
                          style={{ height: "40px" }}
                        >
                          View Quiz
                        </Button>{" "}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  );
}

export default Course;
