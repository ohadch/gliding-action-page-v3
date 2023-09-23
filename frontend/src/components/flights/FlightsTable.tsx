import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useTranslation} from "react-i18next";
import {getFlightState} from "../../utils/enums.ts";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {useEffect} from "react";
import {fetchMembers} from "../../store/actions/member.ts";
import {fetchGliders} from "../../store/actions/glider.ts";
import {fetchTowAirplanes} from "../../store/actions/towAirplane.ts";
import {fetchTowTypes} from "../../store/actions/towType.ts";
import {fetchFlightTypes} from "../../store/actions/flightType.ts";
import {fetchPayersTypes} from "../../store/actions/payersType.ts";
import {fetchPaymentMethods} from "../../store/actions/paymentMethod.ts";
import {getFlightStateDisplayValue, getGliderDisplayValue, getMemberDisplayName} from "../../utils/display.ts";
import {Tooltip} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";


export default function FlightsTable() {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();

    const {flights} = useSelector((state: RootState) => state.actions);
    const membersStoreState = useSelector((state: RootState) => state.members)
    const glidersStoreState = useSelector((state: RootState) => state.gliders)
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes)
    const towTypesStoreState = useSelector((state: RootState) => state.towTypes)
    const flightTypesStoreState = useSelector((state: RootState) => state.flightTypes)
    const payersTypesStoreState = useSelector((state: RootState) => state.payersTypes)
    const paymentMethodsStoreState = useSelector((state: RootState) => state.paymentMethods)

    useEffect(() => {
        if (!membersStoreState.members && !membersStoreState.fetchInProgress) {
            dispatch(fetchMembers());
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

    useEffect(() => {
        if (!towTypesStoreState.towTypes && !towTypesStoreState.fetchInProgress) {
            dispatch(fetchTowTypes());
        }
    })

    useEffect(() => {
        if (!flightTypesStoreState.flightTypes && !flightTypesStoreState.fetchInProgress) {
            dispatch(fetchFlightTypes());
        }
    })

    useEffect(() => {
        if (!payersTypesStoreState.payersTypes && !payersTypesStoreState.fetchInProgress) {
            dispatch(fetchPayersTypes());
        }
    })

    useEffect(() => {
        if (!paymentMethodsStoreState.paymentMethods && !paymentMethodsStoreState.fetchInProgress) {
            dispatch(fetchPaymentMethods());
        }
    })

    const getMemberById = (id: number) => membersStoreState.members?.find((member) => member.id === id);
    const getGliderById = (id: number) => glidersStoreState.gliders?.find((glider) => glider.id === id);
    const getTowAirplaneById = (id: number) => towAirplanesStoreState.towAirplanes?.find((towAirplane) => towAirplane.id === id);
    // const getTowTypeById = (id: number) => towTypesStoreState.towTypes?.find((towType) => towType.id === id);
    // const getFlightTypeById = (id: number) => flightTypesStoreState.flightTypes?.find((flightType) => flightType.id === id);
    // const getPayersTypeById = (id: number) => payersTypesStoreState.payersTypes?.find((payersType) => payersType.id === id);
    // const getPaymentMethodById = (id: number) => paymentMethodsStoreState.paymentMethods?.find((paymentMethod) => paymentMethod.id === id);

    const displayFlightState = (state: string) => {
        return getFlightStateDisplayValue(getFlightState(state));
    }

    const displayGlider = (id: number) => {
        const glider = getGliderById(id);
        return glider ? getGliderDisplayValue(glider) : "";
    }

    const displayMember = (id: number) => {
        const member = getMemberById(id);
        return member ? getMemberDisplayName(member) : "";
    }

    const displayTowAirplane = (id: number) => {
        const towAirplane = getTowAirplaneById(id);
        return towAirplane ? towAirplane.call_sign : "";
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>{t("STATUS")}</TableCell>
                        <TableCell align="right">{t("GLIDER")}</TableCell>
                        <TableCell align="right">{t("PILOT_1")}</TableCell>
                        <TableCell align="right">{t("PILOT_2")}</TableCell>
                        <TableCell align="right">{t("TOW_AIRPLANE")}</TableCell>
                        <TableCell align="right">{t("TOW_PILOT")}</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {flights?.map((flight) => (
                        <TableRow
                            key={flight.id}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                {flight.status && displayFlightState(flight.status)}
                            </TableCell>
                            <TableCell align="right">{flight.glider_id && displayGlider(flight.glider_id)}</TableCell>
                            <TableCell align="right">{flight.pilot_1_id && displayMember(flight.pilot_1_id)}</TableCell>
                            <TableCell align="right">{flight.pilot_2_id && displayMember(flight.pilot_2_id)}</TableCell>
                            <TableCell
                                align="right">{flight.tow_airplane_id && displayTowAirplane(flight.tow_airplane_id)}</TableCell>
                            <TableCell
                                align="right">{flight.tow_pilot_id && displayMember(flight.tow_pilot_id)}</TableCell>
                            <TableCell align="right">
                                <Tooltip title={t("DUPLICATE_FLIGHT")}>
                                    <IconButton aria-label="duplicate" onClick={() => alert("TODO")}>
                                        <ContentCopyIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t("DELETE_FLIGHT")} onClick={() => alert("TODO")}>
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
    );
}
