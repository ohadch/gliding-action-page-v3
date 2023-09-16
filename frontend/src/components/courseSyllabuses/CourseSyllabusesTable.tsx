import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {ISyllabus} from "../../@types";
import {Link} from "react-router-dom";

export interface CourseSyllabusesTableProps {
    syllabuses: ISyllabus[];
    onOpenAddSyllabusDialog: () => void;
    onSyllabusRemove: (syllabus: ISyllabus) => void;
}

export default function CourseSyllabusesTable(props: CourseSyllabusesTableProps) {
    const {
        syllabuses,
        onOpenAddSyllabusDialog,
        onSyllabusRemove
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
                        onClick={() => onOpenAddSyllabusDialog()}
                    >
                        Attach Syllabus
                    </Button>
                </Toolbar>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="members table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {syllabuses.map((syllabus) => (
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
                                            color={"warning"}
                                            onClick={() => onSyllabusRemove(syllabus)}
                                        >
                                            Remove
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
