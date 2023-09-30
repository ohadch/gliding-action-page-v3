import {useTranslation} from "react-i18next";
import {Button, Grid} from "@mui/material";
import {FlightSchema, FlightState} from "../../lib/types.ts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {ORDERED_FLIGHT_STATES} from "../../utils/consts.ts";
import IconButton from "@mui/material/IconButton";

export interface FlightStateControllerProps {
    flight: FlightSchema,
    onStateUpdated: (flightId: number, state: FlightState) => void;
}

interface StateButtonConfig {
    label: string;
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

const STATE_BUTTON_CONFIGS: Record<FlightState, StateButtonConfig> = {
    "Draft": {
        label: "DRAFT",
        color: "error",
    },
    "Tow": {
        label: "TOW",
        color: "warning",
    },
    "Inflight": {
        label: "INFLIGHT",
        color: "primary",
    },
    "Landed": {
        label: "LANDED",
        color: "success",
    }
}


export default function FlightStateController({flight, onStateUpdated}: FlightStateControllerProps) {
    const {t} = useTranslation();
    const {label, color} = STATE_BUTTON_CONFIGS[flight.state];

    function goToPreviousStateEnabled() {
        return ORDERED_FLIGHT_STATES.indexOf(flight.state) > 0;
    }

    function goToNextStateEnabled() {
        return ORDERED_FLIGHT_STATES.indexOf(flight.state) < ORDERED_FLIGHT_STATES.length - 1;
    }

    function goToPreviousStateVisible() {
        return flight.state !== "Draft";
    }

    function goToNextStateVisible() {
        return flight.state !== "Landed";
    }

    return (
        <Grid container sx={{
            textAlign: "center",
            alignItems: "center",
        }}>
            <Grid item xs={2}>
                {
                    goToPreviousStateVisible() && (

                        <IconButton
                            color={color}
                            disabled={!goToPreviousStateEnabled()}
                            onClick={() => onStateUpdated(flight.id, ORDERED_FLIGHT_STATES[ORDERED_FLIGHT_STATES.indexOf(flight.state) - 1])}
                        >
                            <ArrowForwardIcon/>
                        </IconButton>
                    )
                }
            </Grid>
            <Grid item xs={8}>
                <Button
                    variant="contained"
                    color={color}
                    sx={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                    }}
                >
                    {t(label)}
                </Button>
            </Grid>
            <Grid item xs={2}>
                {
                    goToNextStateVisible() && (

                        <IconButton
                            color={color}
                            disabled={!goToNextStateEnabled()}
                            onClick={() => onStateUpdated(flight.id, ORDERED_FLIGHT_STATES[ORDERED_FLIGHT_STATES.indexOf(flight.state) + 1])}
                        >
                            <ArrowBackIcon/>
                        </IconButton>

                    )
                }
            </Grid>
        </Grid>
    );
}
