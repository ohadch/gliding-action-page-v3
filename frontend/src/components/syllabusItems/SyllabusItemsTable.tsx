import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {ISyllabusItem} from "../../@types";

export interface SyllabusItemsTableProps {
    items: ISyllabusItem[];
    onSyllabusItemCreate: () => void;
    onSyllabusItemEdit: (item: ISyllabusItem) => void;
    onSyllabusItemDelete: (item: ISyllabusItem) => void;
}

export default function SyllabusItemsTable(props: SyllabusItemsTableProps) {
    const {
        items,
        onSyllabusItemCreate,
        onSyllabusItemEdit,
        onSyllabusItemDelete,
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
                        onClick={() => onSyllabusItemCreate()}
                    >
                        Add Item
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
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell component="th" scope="row">
                                        {item.id}
                                    </TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => onSyllabusItemEdit(item)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            color={"warning"}
                                            onClick={() => onSyllabusItemDelete(item)}
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
