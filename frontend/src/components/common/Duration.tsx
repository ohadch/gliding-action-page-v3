import { useEffect, useState } from "react";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export interface DurationProps {
  durations: { startTime: string; endTime?: string }[]; // Array of durations
}

export default function Duration({ durations }: DurationProps) {
  const [totalDuration, setTotalDuration] = useState<string>("");

  const action = useSelector(
    (state: RootState) =>
      state.actionDays.actions?.find((action) => action.id === state.actionDays.actionId)
  );

  useEffect(() => {
    if (!durations || durations.length === 0) {
      return;
    }

    const intervalId = setInterval(() => {
      const totalDurationInMillis = durations.reduce((accumulator, currentDuration) => {
        const start = moment(currentDuration.startTime);
        const end = currentDuration.endTime
          ? moment(currentDuration.endTime)
          : moment()
              .set({
                year: moment(action?.date).year(),
                month: moment(action?.date).month(),
                date: moment(action?.date).date(),
              })

        return accumulator + end.diff(start);
      }, 0);

      const duration = moment.duration(totalDurationInMillis);
      setTotalDuration(
        `${duration.hours().toString().padStart(2, "0")}:${duration
          .minutes()
          .toString()
          .padStart(2, "0")}:${duration.seconds().toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [durations, action?.date]);

  return <span>{totalDuration}</span>;
}
