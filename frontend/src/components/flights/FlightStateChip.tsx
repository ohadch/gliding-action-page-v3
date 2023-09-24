import {useTranslation} from "react-i18next";
import {Chip} from "@mui/material";
import {FlightSchema} from "../../lib/types.ts";

export interface FlightStateChipProps {
    flight: FlightSchema
}

export default function FlightStateChip({flight}: FlightStateChipProps) {
    const {t} = useTranslation();

    function renderStateChip() {
        switch (flight.state) {
            case "Draft":
                return (
                    <Chip
                        label={t("DRAFT")}
                        color="default"
                    />
                );
            case "Tow":
                return (
                    <Chip
                        label={t("TOW")}
                        color="error"
                        sx={{
                            backgroundColor: "orange",
                            color: "white",
                        }}
                    />
                );
            case "Inflight":
                return (
                    <Chip
                        label={t("INFLIGHT")}
                        color="primary"
                        sx={{
                            backgroundColor: "orange",
                            color: "white",
                        }}
                    />
                );
            case "Landed":
                return (
                    <Chip
                        label={t("LANDED")}
                        color="success"
                        sx={{
                            backgroundColor: "orange",
                            color: "white",
                        }}
                    />
                );
            default:
                return null;
        }
    }

    return renderStateChip();
}
