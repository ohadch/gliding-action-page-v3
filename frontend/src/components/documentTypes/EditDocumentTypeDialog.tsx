import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    FormGroup,
    FormControl
} from "@mui/material";
import React from "react";
import {IDocumentType} from "../../@types";

export interface EditDocumentTypeDialogProps {
    open: boolean
    onClose: () => void
    documentType: IDocumentType
    onDocumentTypeUpdate: (data: IDocumentType) => void
}

export default function EditDocumentTypeDialog(props: EditDocumentTypeDialogProps) {
    const {open, onClose, documentType, onDocumentTypeUpdate} = props;

    const [editedDocumentType, setEditedDocumentType] = React.useState<IDocumentType>({
        ...documentType
    });

    return (
        <Dialog open={open}>
            <DialogTitle>Edit DocumentType</DialogTitle>
            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: 400,
                }}
            >
                <FormGroup>
                    <FormControl>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            fullWidth
                            value={editedDocumentType.name}
                            onChange={(e) => setEditedDocumentType({
                                ...editedDocumentType,
                                name: e.target.value
                            })}
                        />
                    </FormControl>
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={
                    () => {
                        onDocumentTypeUpdate(editedDocumentType);
                        onClose();
                    }
                }>Update</Button>
            </DialogActions>
        </Dialog>
    )
}
