import { Grid, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import ActionConfigurationComponent from "../actions/ActionConfigurationComponent";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";

export function ActionConfiguration({ 
    onNewFlightClick 
}: { 
    onNewFlightClick: () => void 
}) {
    const { t } = useTranslation();
    const action = useSelector((state: RootState) => 
        state.actions.actions?.find((action) => action.id === state.actions.actionId)
    );
    const currentActionStoreState = useSelector((state: RootState) => state.actions);
    
    const isFullyConfigured = action && 
        action.field_responsible_id && 
        action.responsible_cfi_id && 
        ((currentActionStoreState.activeTowAirplanes?.length || 0) > 0);

    return (
        <Grid container mb={2} spacing={1}>
            <Grid item xs={3}>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!isFullyConfigured || Boolean(action?.closed_at)}
                    style={{
                        height: "100%",
                        width: "100%",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                    }}
                    onClick={onNewFlightClick}
                >
                    <AddIcon />
                    {t("NEW_FLIGHT")}
                </Button>
            </Grid>
            <Grid item xs={9}>
                <ActionConfigurationComponent />
            </Grid>
        </Grid>
    );
}