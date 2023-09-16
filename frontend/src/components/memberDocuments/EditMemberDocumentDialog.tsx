import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    FormGroup,
    FormControl, MenuItem, Select, InputLabel
} from "@mui/material";
import React from "react";
import {
    IMemberDocument,
    MemberDocumentStatus,
    IDocumentType
} from "../../@types";
import {documentTypesApiService} from "../../services/api/documentTypesApi.service.ts";

export interface EditMemberDocumentDialogProps {
    open: boolean
    onClose: () => void
    memberDocument: IMemberDocument,
    onMemberDocumentUpdate: (data: IMemberDocument) => void
}

export default function EditMemberDocumentDialog({open, onClose, memberDocument, onMemberDocumentUpdate}: EditMemberDocumentDialogProps) {
    const [editedMemberDocument, setEditedMemberDocument] = React.useState<IMemberDocument>({
        ...memberDocument
    })
    const [allDocumentTypes, setAllDocumentTypes] = React.useState<IDocumentType[] | null>(null);

    React.useEffect(() => {
        if (allDocumentTypes) {
            return;
        }
        documentTypesApiService.get()
            .then((documentTypes) => {
                setAllDocumentTypes(documentTypes);
            })
            .catch((err) => {
                alert(err);
            })
    })

    return (
        <Dialog open={open}>
            <DialogTitle>Edit Member Document</DialogTitle>
            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: 400,
                }}
            >
                <FormGroup
                    style={{
                        paddingTop: 5,
                    }}
                >
                    <FormControl>
                        <InputLabel id="member-document-type-label">Document Type</InputLabel>
                        <Select
                            labelId="document-type-label"
                            id="document-type"
                            value={editedMemberDocument.type_id}
                            label="Document Type"
                            onChange={(e) => setEditedMemberDocument({
                                ...editedMemberDocument,
                                type_id: e.target.value as number
                            })}
                        >
                            {(allDocumentTypes || []).map((documentType) => (
                                <MenuItem key={documentType.id} value={documentType.id}>
                                    {documentType.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <FormControl>
                        <InputLabel id="member-document-status-label">Document Status</InputLabel>
                        <Select
                            labelId="member-document-status-label"
                            id="member-document-status"
                            value={editedMemberDocument.status}
                            label="Document Status"
                            onChange={(e) => setEditedMemberDocument({
                                ...editedMemberDocument,
                                status: e.target.value as MemberDocumentStatus
                            })}
                        >
                            {Object.values(MemberDocumentStatus).map((status) => (
                                <MenuItem key={status} value={status}>{status}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <TextField
                        label="Expiration Date"
                        type="date"
                        value={editedMemberDocument?.expiration_at?.split("T")[0]}
                        onChange={(e) => setEditedMemberDocument({
                            ...editedMemberDocument,
                            expiration_at: e.target.value
                        })}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={
                    () => {
                        onMemberDocumentUpdate(editedMemberDocument);
                        onClose();
                    }
                }>Update</Button>
            </DialogActions>
        </Dialog>
    )
}
