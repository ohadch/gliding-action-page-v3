import {useTranslation} from "react-i18next";
import {Button, Grid} from "@mui/material";
import {FlightSchema, FlightState} from "../../lib/types.ts";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {ORDERED_FLIGHT_STATES} from "../../utils/consts.ts";
import IconButton from "@mui/material/IconButton";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {getTowAirplaneDisplayValue} from "../../utils/display.ts";

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
    const flights = useSelector((state: RootState) => state.currentAction.flights);
    const {towAirplanes} = useSelector((state: RootState) => state.towAirplanes);
    const {gliders} = useSelector((state: RootState) => state.gliders);
    const {activeTowAirplanes} = useSelector((state: RootState) => state.currentAction);

    const flightsInTowState = flights?.filter((flight) => flight.state === "Tow") || [];
    const busyTowAirplaneIds = flightsInTowState?.map((flight) => flight.tow_airplane_id) || [];
    const availableTowAirplanes = activeTowAirplanes?.filter((towAirplane) => !busyTowAirplaneIds?.includes(towAirplane.airplane_id)) || [];
    const isTowAirplaneAvailable = (towAirplaneId: number) => availableTowAirplanes?.find((towAirplane) => towAirplane.airplane_id === towAirplaneId);

    function goToPreviousStateEnabled() {
        return ORDERED_FLIGHT_STATES.indexOf(flight.state) > 0;
    }

    function goToNextStateEnabled() {
        return ORDERED_FLIGHT_STATES.indexOf(flight.state) < ORDERED_FLIGHT_STATES.length - 1;
    }

    const getTowAirplaneById = (id: number) => towAirplanes?.find((towAirplane) => towAirplane.id === id);
    const getGliderById = (id: number) => gliders?.find((glider) => glider.id === id);

    return (
        <Grid sx={{
            display: "flex",
            justifyContent: "center",
        }}>
            <Grid>
                <IconButton
                    color={color}
                    disabled={!goToPreviousStateEnabled()}
                    onClick={() => {
                        if (
                            (flight.state === "Inflight")
                            && (flight.tow_airplane_id)
                            && (!isTowAirplaneAvailable(flight.tow_airplane_id))
                            && (flight.glider_id && (getGliderById(flight.glider_id)?.type === "regular"))
                        ) {
                            const towAirplane = getTowAirplaneById(flight.tow_airplane_id)

                            if (towAirplane) {
                                alert(`${t("TOW_AIRPLANE_NOT_AVAILABLE")}: ${getTowAirplaneDisplayValue(towAirplane)}`);
                                return;
                            }
                        }
                        return onStateUpdated(flight.id, ORDERED_FLIGHT_STATES[ORDERED_FLIGHT_STATES.indexOf(flight.state) - 1])
                    }}
                >
                    <ArrowRightIcon/>
                </IconButton>
            </Grid>
            <Grid>
                <Button
                    variant="text"
                    color={color}
                >
                    {t(label)}
                </Button>
            </Grid>
            <Grid>
                <IconButton
                    color={color}
                    disabled={!goToNextStateEnabled()}
                    onClick={() => {
                        if (
                            (flight.state === "Draft")
                            && (availableTowAirplanes.length === 0)
                            && (flight.glider_id && (getGliderById(flight.glider_id)?.type === "regular"))
                        ) {
                            alert(t("NO_TOW_AIRPLANES_AVAILABLE"));
                            return;
                        }

                        return onStateUpdated(flight.id, ORDERED_FLIGHT_STATES[ORDERED_FLIGHT_STATES.indexOf(flight.state) + 1])
                    }}
                >
                    <ArrowLeftIcon/>
                </IconButton>
            </Grid>
        </Grid>
    );
}
