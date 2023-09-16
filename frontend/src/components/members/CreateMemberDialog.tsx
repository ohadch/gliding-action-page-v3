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
import {IMemberCreate, MemberStatus} from "../../@types";
import {getDisplayNameByMemberStatus} from "../../utils/members.ts";

export interface CreateMemberDialogProps {
    open: boolean
    onClose: () => void
    onMemberCreate: (data: IMemberCreate) => void
}

export default function CreateMemberDialog({open, onClose, onMemberCreate}: CreateMemberDialogProps) {
    const [newMemberName, setNewMemberName] = React.useState<string>("");
    const [memberStatus, setMemberStatus] = React.useState<MemberStatus>(MemberStatus.BEFORE_SOLO_STUDENT);

    return (
        <Dialog open={open}>
            <DialogTitle>Create Member</DialogTitle>
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
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                        />
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <FormControl>
                        <InputLabel id="member-status-label">Member Status</InputLabel>
                        <Select
                            labelId="member-status-label"
                            id="member-status"
                            value={memberStatus}
                            label="Member Status"
                            onChange={(e) => setMemberStatus(e.target.value as MemberStatus)}
                        >
                            {Object.values(MemberStatus).map((status) => (
                                <MenuItem key={status} value={status}>{getDisplayNameByMemberStatus(status)}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={
                    () => {
                        onMemberCreate({
                            name: newMemberName,
                            status: memberStatus
                        });
                        setNewMemberName("");
                        onClose();
                    }
                }>Create</Button>
            </DialogActions>
        </Dialog>
    )
}
