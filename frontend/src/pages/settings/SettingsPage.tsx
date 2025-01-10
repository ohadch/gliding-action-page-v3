import {Button, Grid} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {updateAction} from "../../store/actions/action.ts";
import {createEvent} from "../../store/actions/event.ts";
import {ActionSchema} from "../../lib/types.ts";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import {useEffect} from "react";
import {fetchEvents} from "../../store/actions/currentAction.ts";
import EventStateChip from "../../components/common/EventStateChip.tsx";
import {setReviewMode} from "../../store/reducers/currentActionSlice.ts";

export default function SettingsPage() {
    const {t} = useTranslation();
    const action = useSelector((state: RootState) => state.actions.actions?.find((action) => action.id === state.currentAction.actionId))
    const reviewMode = useSelector((state: RootState) => state.currentAction.reviewMode);
    const dispatch = useAppDispatch();
    const {events, fetchInProgress} = useSelector((state: RootState) => state.currentAction) || [];

    useEffect(() => {
        if (!events && !fetchInProgress && action) {
            dispatch(fetchEvents({
                actionId: action.id,
            }));
        }
    });

    function reopenAction(action: ActionSchema) {
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

        if (confirm(t("REOPEN_ACTION_EVENT_CONFIRMATION"))) {
            dispatch(
                createEvent({
                    action_id: action.id,
                    type: "action_reopened",
                    payload: {
                        field_responsible_id: action?.field_responsible_id,
                    }
                })
            )
        }
    }

    function renderReopenActionButton(action: ActionSchema) {
        return (
            <Button variant="contained" color="error" disabled={Boolean(!action?.closed_at)}
                onClick={() => {
                    reopenAction(action);
                }}
            >
                {t("REOPEN_ACTION")}
            </Button>
        )
    }

    function renderToggleReviewModeButton() {
        return (
            <Button variant="contained" color="primary"
                onClick={() => {
                    if (!confirm(
                        reviewMode ? t("CONFIRM_EXIT_REVIEW_MODE") : t("CONFIRM_ENTER_REVIEW_MODE")
                    )) {
                        return;
                    }

                    dispatch(
                        setReviewMode(!reviewMode)
                    )
                }}
            >
                {reviewMode ? t("EXIT_REVIEW_MODE") : t("ENTER_REVIEW_MODE")}
            </Button>
        )
    }

    function exportActionData(action: ActionSchema) {
        if (!confirm(`${t("CONFIRM_ACTION_DATA_EXPORT")} (${t("ACTION_DATE")}: ${new Date(action.date).toLocaleDateString()})`)) {
            return;
        }


        dispatch(
            createEvent({
                action_id: action.id,
                type: "action_data_export_requested",
                payload: {}
            })
        )

        dispatch(
            fetchEvents({
                actionId: action.id,
            })
        );
    }

    const actionDataExportRequestedEvents = events?.filter((event) => (
        event.type === "action_data_export_requested" && event.action_id === action?.id
    )) || [];

    function renderActionDataExportRequestEventsTable() {
        return (
            <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">{t("STATUS")}</TableCell>
                            <TableCell align="right">{t("ID")}</TableCell>
                            <TableCell align="right">{t("CREATED_AT")}</TableCell>
                            <TableCell align="right">{t("ERROR")}</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                <TableBody>
                    {actionDataExportRequestedEvents.map((event) => (
                        <TableRow key={event.id}>
                            <TableCell align="right">
                                <EventStateChip state={event.state}/>
                            </TableCell>
                            <TableCell align="right">{event.id}</TableCell>
                            <TableCell align="right">{event.created_at}</TableCell>
                            <TableCell align="right">{event.traceback}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    function renderExportActionDataButton(action: ActionSchema) {
        return (
            <Button variant="contained" color="primary"
                    onClick={() => {
                        exportActionData(action);
                    }}
            >
                {t("EXPORT_ACTION_DATA")}
            </Button>
        )
    }

    return (
        <Grid>
            <Grid item xs={12}>
                <h1>{t("SETTINGS")}</h1>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {action && renderToggleReviewModeButton()}
                    </Grid>
                    <Grid item xs={12}>
                        {action && renderReopenActionButton(action)}
                    </Grid>
                    <Grid item sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        <Grid>
                            {action && renderExportActionDataButton(action)}
                        </Grid>
                        <Grid>
                            {action && action.data_exported_at ? (
                                <strong>
                                    <p>{t("ACTION_EXPORTED_AT")}: {action.data_exported_at}</p>
                                </strong>
                                    ) : (
                                    <p>{t("ACTION_DATA_NOT_YET_EXPORTED")}</p>
                                    )}
                                </Grid>

                                </Grid>
                                <Grid item xs={12}>
                        <h2>{t("DATA_EXPORT_REQUEST_EVENTS")}</h2>
                        {
                            actionDataExportRequestedEvents.length === 0 ? (
                                <p>{t("NO_DATA_EXPORT_REQUEST_EVENTS_FOR_ACTION")}.</p>
                            ) : renderActionDataExportRequestEventsTable()
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
