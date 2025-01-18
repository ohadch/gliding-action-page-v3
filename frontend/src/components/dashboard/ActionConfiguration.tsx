import { Grid } from "@mui/material";
import { ActionConfigurationComponent } from "../actions/ActionConfigurationComponent";

interface ActionConfigurationProps {
    onNewFlightClick: () => void;
}

export function ActionConfiguration({ onNewFlightClick }: ActionConfigurationProps) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <ActionConfigurationComponent onNewFlightClick={onNewFlightClick} />
            </Grid>
        </Grid>
    );
}