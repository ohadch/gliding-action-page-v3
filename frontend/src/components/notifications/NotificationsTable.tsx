import {
    Chip,
    Grid

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
import {NotificationState} from "../../lib/types.ts";

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

    function renderState(state: NotificationState) {
        switch (state) {
            case "pending":
                return (
                    <Chip
                        color="info"
                        label={t("PENDING")}
                    />
                )
            case "being_handled":
                return (
                    <Chip
                        color="primary"
                        label={t("BEING_HANDLED")}
                    />
                )
            case "sent":
                return (
                    <Chip
                        color="success"
                        label={t("SENT")}
                    />
                )
            case "failed":
                return (
                    <Chip
                        color="error"
                        label={t("FAILED")}
                    />
                )
            default:
                return (
                    <Chip
                        color="error"
                        label={t("UNKNOWN")}
                    />
                )
        }
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
                            <TableCell align="right">{t("STATUS")}</TableCell>
                            <TableCell align="right">{t("ID")}</TableCell>
                            <TableCell align="right">{t("SENT_AT")}</TableCell>
                            <TableCell align="right">{t("TYPE")}</TableCell>
                            <TableCell align="right">{t("RECIPIENT_NAME")}</TableCell>
                            <TableCell align="right">{t("RECIPIENT_EMAIL")}</TableCell>
                            <TableCell align="right">{t("DATA")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notifications?.map((notification) => (
                            <TableRow
                                key={notification.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell align="right">
                                    {renderState(notification.state)}
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}
