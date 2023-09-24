import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {useEffect} from "react";
import {fetchMembers, fetchMembersRoles} from "../../store/actions/member.ts";
import {fetchGliders} from "../../store/actions/glider.ts";
import {fetchTowAirplanes} from "../../store/actions/towAirplane.ts";
import {
    getFlightTypeDisplayValue,
    getGliderDisplayValue,
    getMemberDisplayValue
} from "../../utils/display.ts";
import {Tooltip} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {deleteFlight} from "../../store/actions/currentAction.ts";
import {FlightCreateSchema, FlightState, FlightUpdateSchema} from "../../lib/types.ts";
import FlightStateController from "./FlightStateController.tsx";

export interface FlightsTableProps {
    setEditedFlight: (flightId: number, flight: FlightUpdateSchema) => void;
    setDuplicateFlight: (flight: FlightCreateSchema) => void;
    onFlightStateUpdated: (flightId: number, state: FlightState) => void;
}


export default function FlightsTable(props: FlightsTableProps) {
    const {setEditedFlight, setDuplicateFlight, onFlightStateUpdated} = props;
    const {t} = useTranslation();
    const dispatch = useAppDispatch();

    const {flights} = useSelector((state: RootState) => state.currentAction);
    const membersStoreState = useSelector((state: RootState) => state.members)
    const glidersStoreState = useSelector((state: RootState) => state.gliders)
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes)

    useEffect(() => {
        if (!membersStoreState.members && !membersStoreState.fetchInProgress) {
            dispatch(fetchMembers());
            dispatch(fetchMembersRoles());
        }
    });

    useEffect(() => {
        if (!glidersStoreState.gliders && !glidersStoreState.fetchInProgress) {
            dispatch(fetchGliders());
        }
    });

    useEffect(() => {
        if (!towAirplanesStoreState.towAirplanes && !towAirplanesStoreState.fetchInProgress) {
            dispatch(fetchTowAirplanes());
        }
    });


    const getMemberById = (id: number) => membersStoreState.members?.find((member) => member.id === id);
    const getGliderById = (id: number) => glidersStoreState.gliders?.find((glider) => glider.id === id);
    const getTowAirplaneById = (id: number) => towAirplanesStoreState.towAirplanes?.find((towAirplane) => towAirplane.id === id);

    const displayGlider = (id: number) => {
        const glider = getGliderById(id);
        return glider ? getGliderDisplayValue(
            glider,
            glidersStoreState.ownerships?.filter((ownership) => ownership.glider_id === id) || [],
            true
        ) : "";
    }

    const displayMember = (id: number) => {
        const member = getMemberById(id);
        return member ? getMemberDisplayValue(member) : "";
    }

    const displayTowAirplane = (id: number) => {
        const towAirplane = getTowAirplaneById(id);
        return towAirplane ? towAirplane.call_sign : "";
    }

    function onFlightDelete(id: number) {
        if (!confirm(t("DELETE_FLIGHT_CONFIRMATION"))) {
            return;
        }

        dispatch(deleteFlight(id));
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("STATE")}</TableCell>
                            <TableCell align="right">{t("GLIDER")}</TableCell>
                            <TableCell align="right">{t("FLIGHT_TYPE")}</TableCell>
                            <TableCell align="right">{t("PILOT_1")}</TableCell>
                            <TableCell align="right">{t("PILOT_2")}</TableCell>
                            <TableCell align="right">{t("TOW_AIRPLANE")}</TableCell>
                            <TableCell align="right">{t("TOW_PILOT")}</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {flights?.map((flight) => (
                            <TableRow
                                key={flight.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {flight && (
                                        <FlightStateController
                                            flight={flight}
                                            onStateUpdated={onFlightStateUpdated}
                                        />
                                    )}
                                </TableCell>
                                <TableCell
                                    align="right">{flight.glider_id && displayGlider(flight.glider_id)}</TableCell>
                                <TableCell
                                    align="right">{flight.flight_type && getFlightTypeDisplayValue(flight.flight_type)}</TableCell>
                                <TableCell
                                    align="right">{flight.pilot_1_id && displayMember(flight.pilot_1_id)}</TableCell>
                                <TableCell
                                    align="right">{flight.pilot_2_id && displayMember(flight.pilot_2_id)}</TableCell>
                                <TableCell
                                    align="right">{flight.tow_airplane_id && displayTowAirplane(flight.tow_airplane_id)}</TableCell>
                                <TableCell
                                    align="right">{flight.tow_pilot_id && displayMember(flight.tow_pilot_id)}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title={t("DUPLICATE_FLIGHT")}>
                                        <IconButton aria-label="duplicate" onClick={() => setDuplicateFlight(flight)}>
                                            <ContentCopyIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={t("EDIT_FLIGHT")} onClick={() => setEditedFlight(flight.id, flight)}>
                                        <IconButton aria-label="edit">
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={t("DELETE_FLIGHT")} onClick={() => onFlightDelete(flight.id)}>
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
        </>
    );
}
