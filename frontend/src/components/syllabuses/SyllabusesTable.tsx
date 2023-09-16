import {ISyllabus} from "../../@types/models/Syllabus";
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {Link} from "react-router-dom";

export interface SyllabusesTableProps {
    syllabus: ISyllabus[];
    onSyllabusCreate: () => void;
    onSyllabusEdit: (syllabus: ISyllabus) => void;
    onSyllabusDelete: (syllabus: ISyllabus) => void;
}

export default function SyllabusesTable(props : SyllabusesTableProps) {
    const {
        syllabus,
        onSyllabusCreate,
        onSyllabusEdit,
        onSyllabusDelete,
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
                        onClick={() => onSyllabusCreate()}
                    >
                        New Syllabus
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
                            {syllabus.map((syllabus) => (
                                <TableRow key={syllabus.id}>
                                    <TableCell component="th" scope="row">
                                        {syllabus.id}
                                    </TableCell>
                                    <TableCell>{syllabus.name}</TableCell>
                                    <TableCell>
                                        <Button component={Link} to={`/syllabuses/${syllabus.id}`}>
                                            View
                                        </Button>
                                        <Button
                                            color="primary"
                                            onClick={() => onSyllabusEdit(syllabus)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            color="warning"
                                            onClick={() => onSyllabusDelete(syllabus)}
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
