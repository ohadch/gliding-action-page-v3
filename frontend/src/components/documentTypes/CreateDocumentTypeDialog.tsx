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
import {IDocumentTypeCreate} from "../../@types/models/DocumentType";

export interface CreateDocumentTypeDialogProps {
    open: boolean
    onClose: () => void
    onDocumentTypeCreate: (data: IDocumentTypeCreate) => void
}

export default function CreateDocumentTypeDialog({open, onClose, onDocumentTypeCreate}: CreateDocumentTypeDialogProps) {
    const [name, setName] = React.useState("");

    return (
        <Dialog open={open}>
            <DialogTitle>Create DocumentType</DialogTitle>
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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={
                    () => {
                        onDocumentTypeCreate({
                            name,
                        });
                        onClose();
                    }
                }>Create</Button>
            </DialogActions>
        </Dialog>
    )
}
