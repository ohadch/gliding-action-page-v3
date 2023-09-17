import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormGroup,
    FormControl, Select, InputLabel, MenuItem
} from "@mui/material";
import {useEffect, useState} from "react";
import {ActionSchema} from "../../lib/types.ts";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {API_HOST} from "../../utils/consts.ts";
import {useTranslation} from "react-i18next";

export interface SelectActionDialogProps {
    open: boolean
    onClose: () => void
    onActionSelected: (action: ActionSchema) => void
}

const {POST} = createClient<paths>({baseUrl: API_HOST});

export default function SelectActionDialog({open, onClose, onActionSelected}: SelectActionDialogProps) {
    const [actions, setActions] = useState<ActionSchema[]>([]);
    const [action, setAction] = useState<ActionSchema | undefined>(undefined);
    const {
        t
    } = useTranslation()

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
            <DialogTitle>
                {t("SELECT_ACTION")}
            </DialogTitle>
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
                        <InputLabel id="action-label">
                            {t("ACTION")}
                        </InputLabel>
                        <Select
                            labelId="action-label"
                            id="action"
                            value={action?.id || ""}
                            label={t("ACTION")}
                            onChange={(e) => {
                                const action = actions.find((action) => action.id === e.target.value);
                                setAction(action);
                            }}
                        >
                            {actions.map((action) => (
                                <MenuItem key={action.id} value={action.id}>{action.date.split("T")[0]}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {t("CANCEL")}
                </Button>
                <Button onClick={
                    () => {
                        if (!action) {
                            console.warn("No action selected")
                            return;
                        }
                        onActionSelected(action);
                        onClose();
                    }
                }>
                    {t("SELECT")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
