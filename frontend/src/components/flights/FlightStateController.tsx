import {useTranslation} from "react-i18next";
import {Button, Grid} from "@mui/material";
import {FlightSchema, FlightState} from "../../lib/types.ts";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {ORDERED_FLIGHT_STATES} from "../../utils/consts.ts";
import Typography from "@mui/material/Typography";

export interface FlightStateChipProps {
    flight: FlightSchema
}

interface StateButtonConfig {
    label: string;
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

const STATE_BUTTON_CONFIGS: Record<FlightState, StateButtonConfig> = {
    "Draft": {
        label: "DRAFT",
        color: "secondary",
    },
    "Tow": {
        label: "TOW",
        color: "error",
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


export default function FlightStateController({flight}: FlightStateChipProps) {
    const {t} = useTranslation();
    const {label, color} = STATE_BUTTON_CONFIGS[flight.state];

    function goToPreviousStateEnabled() {
        return ORDERED_FLIGHT_STATES.indexOf(flight.state) > 0;
    }

    function goToNextStateEnabled() {
        return ORDERED_FLIGHT_STATES.indexOf(flight.state) < ORDERED_FLIGHT_STATES.length - 1;
    }

    return (
        <Grid sx={{
            display: "flex",
            justifyContent: "center",
        }}>
            {goToPreviousStateEnabled() && (
                <Grid>
                    <Button
                        variant="text"
                        color={color}
                    >
                        <ArrowRightIcon/>
                    </Button>
                </Grid>
            )}
            <Grid>
                <Typography
                    variant="h6"
                    component="div"
                    color={color}
                    sx={{
                        fontWeight: "bold",
                    }}
                >
                    {t(label)}
                </Typography>
            </Grid>
            {goToNextStateEnabled() && (
                <Grid>
                    <Button
                        variant="text"
                        color={color}
                    >
                        <ArrowLeftIcon/>
                    </Button>
                </Grid>
            )}
        </Grid>
    );
}
