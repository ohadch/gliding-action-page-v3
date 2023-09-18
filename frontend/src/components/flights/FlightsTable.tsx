import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {FlightSchema} from "../../lib/types.ts";

export interface FlightsTableProps {
    flights: FlightSchema[];
}

export default function FlightsTable(props: FlightsTableProps) {
  const {flights} = props;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell align="right">Glider</TableCell>
            <TableCell align="right">Pilot 1</TableCell>
            <TableCell align="right">Pilot 2</TableCell>
            <TableCell align="right">Tow Airplane</TableCell>
            <TableCell align="right">Tow Pilot</TableCell>
            <TableCell align="right">Tow Type</TableCell>
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
              <TableCell align="right">{flight.tow_type_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
