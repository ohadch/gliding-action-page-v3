import {useEffect, useState} from "react";
import {FlightSchema} from "../../lib/types.ts";
import moment from "moment/moment";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

export interface FlightDurationProps {
    flight: FlightSchema;
}

export default function FlightDuration({flight}: FlightDurationProps) {
    const [duration, setDuration] = useState<string>("");
    const action = useSelector((state: RootState) => state.actions.actions?.find((action) => action.id === state.currentAction.actionId))

    useEffect(() => {
        if (!flight.take_off_at) {
            return;
        }

        const intervalId = setInterval(() => {
            let end: string;

            if (flight.landing_at) {
                end = moment(flight.landing_at).toISOString()
            } else {
                end = moment().set({
                    year: moment(action?.date).year(),
                    month: moment(action?.date).month(),
                    date: moment(action?.date).date(),
                }).utcOffset(0, true).toISOString()

                // remove the trailing Z
                if (end.endsWith("Z")) {
                    end = end.slice(0, -1);
                }
            }


            const duration = moment.duration(moment(end).diff(moment(flight.take_off_at)));
            setDuration(
                `${duration.hours().toString().padStart(2, "0")}:${duration.minutes().toString().padStart(2, "0")}:${duration.seconds().toString().padStart(2, "0")}`
            );
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [flight.take_off_at, flight.landing_at, action?.date]);

    return (
        <span>
      {duration}
    </span>
    );
}
