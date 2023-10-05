import {
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
import {fetchEvents} from "../../store/actions/currentAction.ts";
import {getMemberDisplayValue} from "../../utils/display.ts";
import {fetchMembers} from "../../store/actions/member.ts";

export default function EventsTable() {
    const dispatch = useAppDispatch();
    const {events, fetchInProgress, actionId} = useSelector((state: RootState) => state.currentAction)
    const membersStoreState = useSelector((state: RootState) => state.members)

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
    });

    const getMemberById = useCallback((id: number) => membersStoreState.members?.find((member) => member.id === id), [membersStoreState.members]);
    const displayMember = (id: number) => {
        const member = getMemberById(id);
        return member ? getMemberDisplayValue(
            member,
        ) : "";
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
                            <TableCell align="right">{t("ID")}</TableCell>
                            <TableCell align="right">{t("CREATED_AT")}</TableCell>
                            <TableCell align="right">{t("TYPE")}</TableCell>
                            <TableCell align="right">{t("AUTHOR")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events?.map((event) => (
                            <TableRow
                                key={event.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell align="right">{event.id}</TableCell>
                                <TableCell align="right">{event.created_at}</TableCell>
                                <TableCell align="right">{event.type}</TableCell>
                                <TableCell align="right">{
                                    event.payload.field_responsible_id && displayMember(event.payload.field_responsible_id)
                                }</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}
