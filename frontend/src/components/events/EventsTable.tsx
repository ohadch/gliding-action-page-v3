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
import {fetchComments, fetchEvents, fetchFlights} from "../../store/actions/currentAction.ts";
import {getMemberDisplayValue} from "../../utils/display.ts";
import {fetchMembers} from "../../store/actions/member.ts";
import {EventSchema, EventType} from "../../lib/types.ts";
import {fetchTowAirplanes} from "../../store/actions/towAirplane.ts";
import {fetchGliders} from "../../store/actions/glider.ts";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {updateEvent} from "../../store/actions/event.ts";
import EventStateChip from "../common/EventStateChip.tsx";

export default function EventsTable() {
    const dispatch = useAppDispatch();
    const {flights, events, fetchInProgress, actionId} = useSelector((state: RootState) => state.currentAction)
    const membersStoreState = useSelector((state: RootState) => state.members)
    const glidersStoreState = useSelector((state: RootState) => state.gliders)
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes)

    const {
        t
    } = useTranslation()

    useEffect(() => {
        if (!events && !fetchInProgress && actionId) {
            dispatch(fetchEvents({
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
            dispatch(fetchComments(actionId));
        }
    });

    const getMemberById = useCallback((id: number) => membersStoreState.members?.find((member) => member.id === id), [membersStoreState.members]);
    const displayMember = (id: number) => {
        const member = getMemberById(id);
        return member ? getMemberDisplayValue(
            member,
        ) : "";
    }

    function renderTowAirplane(towAirplaneId: number, towPilotId: number) {
        const towAirplane = towAirplanesStoreState.towAirplanes?.find((towAirplane) => towAirplane.id === towAirplaneId);
        const towPilot = getMemberById(towPilotId);

        return `${towAirplane?.call_sign} (${towPilot ? getMemberDisplayValue(towPilot) : ""})`
    }

    function renderFlight(flight_id: number, eventType: EventType) {
        const flight = flights?.find((flight) => flight.id === flight_id);

        if (!flight) {
            return null;
        }

        const glider = glidersStoreState.gliders?.find((glider) => glider.id === flight.glider_id);
        const pilot1 = flight.pilot_1_id && displayMember(flight.pilot_1_id);
        const pilot2 = flight.pilot_2_id && displayMember(flight.pilot_2_id);
        const towAirplane = (eventType === "flight_took_off" || eventType === "flight_tow_released") && (flight.tow_airplane_id && flight.tow_pilot_id) ? renderTowAirplane(flight.tow_airplane_id, flight.tow_pilot_id)
            : null;

        return `${glider?.call_sign} (${pilot1}${pilot2 ? `, ${pilot2}` : ""})${towAirplane ? `, ${towAirplane}` : ""}`
    }

    function renderPayload(event: EventSchema) {
        switch (event.type) {
            case "flight_took_off":
                return event.payload.flight_id ? renderFlight(event.payload.flight_id, event.type) : null;
            case "flight_landed":
                return event.payload.flight_id ? renderFlight(event.payload.flight_id, event.type) : null;
            case "flight_tow_released":
                return event.payload.flight_id ? renderFlight(event.payload.flight_id, event.type) : null;
            case "responsible_cfi_assigned":
                return event.payload.responsible_cfi_id ? displayMember(event.payload.responsible_cfi_id) : null;
            case "responsible_cfi_unassigned":
                return event.payload.responsible_cfi_id ? displayMember(event.payload.responsible_cfi_id) : null;
            case "field_responsible_assigned":
                return event.payload.field_responsible_id ? displayMember(event.payload.field_responsible_id) : null;
            case "field_responsible_unassigned":
                return event.payload.field_responsible_id ? displayMember(event.payload.field_responsible_id) : null;
            case "tow_airplane_activated":
                return event.payload.tow_airplane_id && event.payload.tow_pilot_id ? renderTowAirplane(event.payload.tow_airplane_id, event.payload.tow_pilot_id) : null;
            case "tow_airplane_deactivated":
                return event.payload.tow_airplane_id && event.payload.tow_pilot_id ? renderTowAirplane(event.payload.tow_airplane_id, event.payload.tow_pilot_id) : null;
            default:
                return null;
        }
    }

    function getFilteredEvents() {
        // Filter out events that their flight does not exist
        return events?.filter((event) => {
            // Filter out deleted events
            if (event.is_deleted) {
                return false;
            }

            if ((event.type === "action_closed") || event.type === "action_reopened") {
                return true;
            }

            const flight = flights?.find((flight) => flight.id === event.payload.flight_id);
            return Boolean(flight);
        }) || [];
    }

    function onEventDelete(id: number) {
        if (!confirm(t("DELETE_EVENT_CONFIRMATION"))) {
            return;
        }

        dispatch(
            updateEvent({
                eventId: id,
                updatePayload: {
                    is_deleted: true,
                }
            })
        )
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
                            <TableCell align="right">{t("STATE")}</TableCell>
                            <TableCell align="right">{t("ID")}</TableCell>
                            <TableCell align="right">{t("CREATED_AT")}</TableCell>
                            <TableCell align="right">{t("TYPE")}</TableCell>
                            <TableCell align="right">{t("AUTHOR")}</TableCell>
                            <TableCell align="right">{t("DATA")}</TableCell>
                            <TableCell align="right">{t("ERROR")}</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getFilteredEvents().map((event) => (
                            <TableRow
                                key={event.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell align="right">
                                    <EventStateChip state={event.state}/>
                                </TableCell>
                                <TableCell align="right">{event.id}</TableCell>
                                <TableCell align="right">{event.created_at}</TableCell>
                                <TableCell align="right">{
                                    t(event.type.toUpperCase())
                                }</TableCell>
                                <TableCell align="right">{
                                    event.payload.field_responsible_id && displayMember(event.payload.field_responsible_id)
                                }</TableCell>
                                <TableCell align="right">{
                                    renderPayload(event)
                                }</TableCell>
                                <TableCell align="right">{
                                    event.traceback
                                }</TableCell>
                                <TableCell>
                                    <Tooltip title={t("DELETE_EVENT")} onClick={() => onEventDelete(event.id)}>
                                            <IconButton aria-label="delete">
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}
