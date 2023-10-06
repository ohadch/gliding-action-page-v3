import { FlightSchema } from "../../lib/types.ts";
import Duration from "../common/Duration";

export interface FlightDurationProps {
  flight: FlightSchema;
}

export default function FlightDuration({ flight }: FlightDurationProps) {
  const startTime = flight.take_off_at;
  const endTime = flight.landing_at;

  if (!startTime) {
      return null;
  }

  return (
      <Duration durations={[{startTime: startTime, endTime: endTime || undefined}]} />
  );
}
