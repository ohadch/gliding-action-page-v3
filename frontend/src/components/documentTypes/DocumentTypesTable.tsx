import {IDocumentType} from "../../@types";
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

export interface DocumentTypesTableProps {
    documentType: IDocumentType[];
    onDocumentTypeCreate: () => void;
    onDocumentTypeEdit: (documentType: IDocumentType) => void;
    onDocumentTypeDelete: (documentType: IDocumentType) => void;
}

export default function DocumentTypesTable(props : DocumentTypesTableProps) {
    const {
        documentType,
        onDocumentTypeCreate,
        onDocumentTypeEdit,
        onDocumentTypeDelete,
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
                        onClick={() => onDocumentTypeCreate()}
                    >
                        New Document Type
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
                            {documentType.map((documentType) => (
                                <TableRow key={documentType.id}>
                                    <TableCell component="th" scope="row">
                                        {documentType.id}
                                    </TableCell>
                                    <TableCell>{documentType.name}</TableCell>
                                    <TableCell>
                                        <Button
                                            color="primary"
                                            onClick={() => onDocumentTypeEdit(documentType)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            color="warning"
                                            onClick={() => onDocumentTypeDelete(documentType)}
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
