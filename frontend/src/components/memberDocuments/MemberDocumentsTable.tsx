import {IDocumentType, IMemberDocument} from "../../@types";
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

export interface MemberDocumentsTableProps {
    documents: IMemberDocument[];
    documentTypes: IDocumentType[];
    onMemberDocumentCreate: () => void;
    onMemberDocumentEdit: (document: IMemberDocument) => void;
    onMemberDocumentDelete: (document: IMemberDocument) => void;
}

export default function MemberDocumentsTable(props: MemberDocumentsTableProps) {
    const {
        documents,
        documentTypes,
        onMemberDocumentCreate,
        onMemberDocumentEdit,
        onMemberDocumentDelete,
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
                        onClick={() => onMemberDocumentCreate()}
                    >
                        Add Document
                    </Button>
                </Toolbar>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="members table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Expiration</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {documents.map((document) => (
                                <TableRow key={document.id}>
                                    <TableCell component="th" scope="row">
                                        {document.id}
                                    </TableCell>
                                    <TableCell>
                                        {
                                            documentTypes?.find(dt => dt.id === document.type_id)?.name || "Unknown"
                                        }
                                    </TableCell>
                                    <TableCell>{document.status}</TableCell>
                                    <TableCell>{document.expiration_at}</TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => onMemberDocumentEdit(document)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            color={"warning"}
                                            onClick={() => onMemberDocumentDelete(document)}
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
