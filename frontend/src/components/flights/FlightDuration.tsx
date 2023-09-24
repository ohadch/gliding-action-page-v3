import { useEffect, useState } from "react";
import { FlightSchema } from "../../lib/types.ts";
import moment from "moment/moment";

export interface FlightDurationProps {
  flight: FlightSchema;
}

export default function FlightDuration({ flight }: FlightDurationProps) {
  const [duration, setDuration] = useState<string>("");

  useEffect(() => {
    if (!flight.take_off_at) {
      return;
    }

    const intervalId = setInterval(() => {
      const end = flight.landing_at || moment().toISOString();
      const duration = moment.duration(moment(end).diff(moment(flight.take_off_at)));
      setDuration(
        `${duration.hours().toString().padStart(2, "0")}:${duration.minutes().toString().padStart(2, "0")}:${duration.seconds().toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [flight.take_off_at, flight.landing_at]);

  return (
    <span>
      {duration}
    </span>
  );
}
