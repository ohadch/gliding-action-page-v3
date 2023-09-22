import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {FlightSchema} from "../../lib/types.ts";
import {useTranslation} from "react-i18next";

export interface FlightsTableProps {
    flights: FlightSchema[];
}

export default function FlightsTable(props: FlightsTableProps) {
  const {flights} = props;
  const {t} = useTranslation();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{t("STATUS")}</TableCell>
            <TableCell align="right">{t("GLIDER")}</TableCell>
            <TableCell align="right">{t("PILOT_1")}</TableCell>
            <TableCell align="right">{t("PILOT_2")}</TableCell>
            <TableCell align="right">{t("TOW_AIRPLANE")}</TableCell>
            <TableCell align="right">{t("TOW_PILOT")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flights.map((flight) => (
            <TableRow
              key={flight.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {flight.status}
              </TableCell>
              <TableCell align="right">{flight.glider_id}</TableCell>
              <TableCell align="right">{flight.pilot_1_id}</TableCell>
              <TableCell align="right">{flight.pilot_2_id}</TableCell>
              <TableCell align="right">{flight.tow_airplane_id}</TableCell>
              <TableCell align="right">{flight.tow_pilot_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
