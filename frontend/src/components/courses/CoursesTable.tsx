import {ICourse} from "../../@types/models/Course";
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {Link} from "react-router-dom";

export interface CoursesTableProps {
    courses: ICourse[];
    onCourseCreate: () => void;
    onCourseEdit: (course: ICourse) => void;
    onCourseDelete: (course: ICourse) => void;
}

export default function CoursesTable(props : CoursesTableProps) {
    const {
        courses,
        onCourseCreate,
        onCourseEdit,
        onCourseDelete,
    } = props;

    return (
        <Box>
            <Paper
                sx={{
                    width: '100%',
                    mb: 2,
                }}
            >
                <Toolbar>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onCourseCreate()}
                    >
                        New Course
                    </Button>
                </Toolbar>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="courses table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell component="th" scope="row">
                                        {course.id}
                                    </TableCell>
                                    <TableCell>{course.name}</TableCell>
                                    <TableCell>
                                        <Button component={Link} to={`/courses/${course.id}`}>
                                            View
                                        </Button>
                                        <Button
                                            color="primary"
                                            onClick={() => onCourseEdit(course)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            color="warning"
                                            onClick={() => onCourseDelete(course)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
