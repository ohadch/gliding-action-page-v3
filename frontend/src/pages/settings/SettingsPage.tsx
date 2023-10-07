import {Button, Grid} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {updateAction} from "../../store/actions/action.ts";
import {createEvent} from "../../store/actions/event.ts";

export default function SettingsPage() {
    const {t} = useTranslation();
    const action = useSelector((state: RootState) => state.actions.actions?.find((action) => action.id === state.currentAction.actionId))
    const dispatch = useAppDispatch();

    return (
        <Grid>
            <Grid item xs={12}>
                <h1>{t("SETTINGS")}</h1>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Button variant="contained" color="error" disabled={Boolean(!action?.closed_at)}
                                onClick={() => {
                                    if (!action) {
                                        return;
                                    }

                                    if (!confirm(t("CONFIRM_ACTION_REOPEN"))) {
                                        return;
                                    }

                                    dispatch(
                                        updateAction({
                                            actionId: action.id,
                                            updatePayload: {
                                                ...action,
                                                closed_at: null
                                            }
                                        })
                                    )

                                    dispatch(
                                        createEvent({
                                            action_id: action.id,
                                            type: "action_reopened",
                                            payload: {
                                                field_responsible_id: action?.field_responsible_id,
                                            }
                                        })
                                    )
                                }}
                        >
                            {t("REOPEN_ACTION")}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
