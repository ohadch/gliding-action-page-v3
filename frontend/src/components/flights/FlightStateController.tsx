import {useTranslation} from "react-i18next";
import {Button, Grid, Tooltip} from "@mui/material";
import {FlightSchema, FlightState} from "../../lib/types.ts";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {ORDERED_FLIGHT_STATES} from "../../utils/consts.ts";
import IconButton from "@mui/material/IconButton";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

export interface FlightStateControllerProps {
    flight: FlightSchema,
    onStateUpdated?: (flightId: number, state: FlightState) => void;
}

interface StateButtonConfig {
    label: string;
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

const STATE_BUTTON_CONFIGS: Record<FlightState, StateButtonConfig> = {
    "Draft": {
        label: "DRAFT",
        color: "primary",
    },
    "Tow": {
        label: "TOW",
        color: "warning",
    },
    "Inflight": {
        label: "INFLIGHT",
        color: "error",
    },
    "Landed": {
        label: "LANDED",
        color: "success",
    }
}


export default function FlightStateController({flight, onStateUpdated}: FlightStateControllerProps) {
    const {t} = useTranslation();
    const {label, color} = STATE_BUTTON_CONFIGS[flight.state];
    const action = useSelector((state: RootState) => state.actions.actions?.find((action) => action.id === state.actions.actionId))

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

    const previousState = ORDERED_FLIGHT_STATES[ORDERED_FLIGHT_STATES.indexOf(flight.state) - 1];
    const previousStateToDisplay = previousState && t(previousState.toUpperCase());
    const nextState = ORDERED_FLIGHT_STATES[ORDERED_FLIGHT_STATES.indexOf(flight.state) + 1];
    const nextStateToDisplay = nextState && t(nextState.toUpperCase());

    return (
        <Grid container sx={{
            textAlign: "center",
            alignItems: "center",
        }}>
            <Grid item xs={2}>
                {
                    onStateUpdated && goToNextStateVisible() && (
                        <Tooltip
                            title={`${t("MOVE_FLIGHT_TO_STATE")}: ${nextStateToDisplay}`}>
                            <IconButton
                                color={color}
                                disabled={!goToNextStateEnabled() || Boolean(action?.closed_at)}
                                onClick={() => onStateUpdated(flight.id, nextState)}
                            >
                                <ArrowDownwardIcon/>
                            </IconButton>
                        </Tooltip>
                    )
                }
            </Grid>
            <Grid item xs={6} mr={2} ml={1}>
                <Button
                    variant="contained"
                    color={color}
                    disabled={Boolean(action?.closed_at)}
                    sx={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        width: "100%",
                    }}
                >
                    {t(label)}
                </Button>
            </Grid>

            <Grid item xs={2}>
                {
                    onStateUpdated && goToPreviousStateVisible() && (
                        <Tooltip
                            title={`${t("MOVE_FLIGHT_TO_STATE")}: ${previousStateToDisplay}`}>
                            <IconButton
                                color={color}
                                disabled={!goToPreviousStateEnabled() || Boolean(action?.closed_at)}
                                onClick={() => onStateUpdated(flight.id, previousState)}
                            >
                                <ArrowUpwardIcon/>
                            </IconButton>
                        </Tooltip>
                    )
                }
            </Grid>

        </Grid>
    );
}
