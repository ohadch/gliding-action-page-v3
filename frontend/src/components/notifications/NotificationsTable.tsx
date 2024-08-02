import {
    Grid, Tooltip

} from "@mui/material";
import {useCallback, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {fetchNotifications, fetchFlights} from "../../store/actions/currentAction.ts";
import {getMemberDisplayValue} from "../../utils/display.ts";
import {fetchMembers} from "../../store/actions/member.ts";
import {fetchTowAirplanes} from "../../store/actions/towAirplane.ts";
import {fetchGliders} from "../../store/actions/glider.ts";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import {updateNotification} from "../../store/actions/notification.ts";
import NotificationStateChip from "../common/NotificationStateChip.tsx";

export default function NotificationsTable() {
    const dispatch = useAppDispatch();
    const {flights, notifications, fetchInProgress, actionId} = useSelector((state: RootState) => state.currentAction)
    const membersStoreState = useSelector((state: RootState) => state.members)
    const glidersStoreState = useSelector((state: RootState) => state.gliders)
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes)

    const {
        t
    } = useTranslation()

    useEffect(() => {
        if (!notifications && !fetchInProgress && actionId) {
            dispatch(fetchNotifications({
                actionId,
            }));
        }

        if (!membersStoreState.members && !membersStoreState.fetchInProgress) {
            dispatch(fetchMembers());
        }

        if (!towAirplanesStoreState.towAirplanes && !towAirplanesStoreState.fetchInProgress) {
            dispatch(fetchTowAirplanes());
        }

        if (!glidersStoreState.gliders && !glidersStoreState.fetchInProgress) {
            dispatch(fetchGliders());
        }

        if (!flights && !fetchInProgress && actionId) {
            dispatch(fetchFlights(actionId));
        }
    });

    const getMemberById = useCallback((id: number) => membersStoreState.members?.find((member) => member.id === id), [membersStoreState.members]);
    const displayMember = (id: number) => {
        const member = getMemberById(id);
        return member ? getMemberDisplayValue(
            member,
        ) : "";
    }
    const displayMemberEmail = (id: number) => {
        const member = getMemberById(id);
        return member ? member.email : "";
    }

    return (
        <Grid
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right">{t("STATUS")}</TableCell>
                            <TableCell align="right">{t("ID")}</TableCell>
                            <TableCell align="right">{t("SENT_AT")}</TableCell>
                            <TableCell align="right">{t("TYPE")}</TableCell>
                            <TableCell align="right">{t("RECIPIENT_NAME")}</TableCell>
                            <TableCell align="right">{t("RECIPIENT_EMAIL")}</TableCell>
                            <TableCell align="right">{t("DATA")}</TableCell>
                            <TableCell align="right">{t("ERROR")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notifications?.map((notification) => (
                            <TableRow
                                key={notification.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >

                                <TableCell align="right">
                                    {notification.state === "failed" && (
                                        <Tooltip title={t("RESEND_NOTIFICATION")}>
                                            <IconButton
                                                onClick={() => {
                                                    if (!confirm(t("RESEND_NOTIFICATION_CONFIRMATION"))) {
                                                        return;
                                                    }

                                                    dispatch(
                                                        updateNotification({
                                                            notificationId: notification.id,
                                                            updatePayload: {
                                                                state: "pending",
                                                                num_sending_attempts: 0,
                                                                last_sending_attempt_at: null,
                                                            },
                                                        })
                                                    );
                                                }}
                                            >
                                                <RefreshIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <Grid>
                                        <NotificationStateChip state={notification.state}/>
                                    </Grid>
                                </TableCell>
                                <TableCell align="right">
                                    {notification.id}
                                </TableCell>
                                <TableCell align="right">
                                    {notification.sent_at}
                                </TableCell>
                                <TableCell align="right">
                                    {t(notification.type.toUpperCase())}
                                </TableCell>
                                <TableCell align="right">
                                    {displayMember(notification.recipient_member_id)}
                                </TableCell>
                                <TableCell align="right">
                                    {displayMemberEmail(notification.recipient_member_id)}
                                </TableCell>
                                <TableCell align="right">
                                    {JSON.stringify(notification.payload)}
                                </TableCell>
                                <TableCell align="right">
                                    {notification.traceback}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}
