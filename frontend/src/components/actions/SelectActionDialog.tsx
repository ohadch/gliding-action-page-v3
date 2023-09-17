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
import {useEffect, useState} from "react";
import {ActionSchema} from "../../lib/types.ts";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";

export interface SelectActionDialogProps {
    open: boolean
    onClose: () => void
    onActionSelected: (data: ActionSchema) => void
}

const {POST} = createClient<paths>({baseUrl: API_HOST});

export default function SelectActionDialog({open, onClose, onActionSelected}: SelectActionDialogProps) {
    const [actions, setActions] = useState<ActionSchema[]>([]);
    const [actionId, setActionId] = useState<number>(1);

    useEffect(() => {
        (async () => {
            {
                const {data, error} = await POST("/actions/search", {
                    params: {
                        query: {
                            page: 1,
                            page_size: 20,
                        },
                    },
                });

                if (error) {
                    console.error(error);
                }

                if (data) {
                    setActions(data);
                }
            }
        })();
    }, []);


    return (
        <Dialog open={open}>
            <DialogTitle>Create Syllabus</DialogTitle>
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
                        onActionSelected({
                            name,
                        });
                        onClose();
                    }
                }>Create</Button>
            </DialogActions>
        </Dialog>
    )
}
