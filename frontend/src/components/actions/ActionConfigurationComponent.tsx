import { Grid } from "@mui/material";
import { FieldResponsibleSelect } from "./FieldResponsibleSelect";
import { ResponsibleCFISelect } from "./ResponsibleCFISelect";
import { TowAirplanesSection } from "./TowAirplanesSection";
import { useActionConfiguration } from "../../hooks/useActionConfiguration";

export default function ActionConfigurationComponent() {
    const {
        action,
        towAirplanesStoreState,
        currentActionStoreState,
        editedActiveTowAirplaneId,
        setEditedActiveTowAirplaneId,
        getMemberById,
        getTowAirplaneById,
        handleFieldResponsibleChange,
        handleResponsibleCFIChange,
        handleDeactivateTowAirplane,
        getFieldResponsibleOptions,
        getResponsibleCfiOptions,
        displayTowPilotByAirplaneId,
        handleActivateTowAirplane,
    } = useActionConfiguration();

    // Debug log
    console.log('Current Action Store State:', currentActionStoreState);
    console.log('Active Tow Airplanes:', currentActionStoreState?.activeTowAirplanes);

    if (!action) return null;

    const { field_responsible_id, responsible_cfi_id } = action;

    // Debug logs
    console.log('Responsible CFI ID:', responsible_cfi_id);
    console.log('Responsible CFI:', responsible_cfi_id ? getMemberById(responsible_cfi_id) : null);
    console.log('Available CFI Options:', getResponsibleCfiOptions());

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 48 * 4.5 + 8,
                width: 250,
            },
        },
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={4}>
                <FieldResponsibleSelect
                    value={field_responsible_id ? getMemberById(field_responsible_id) || null : null}
                    onChange={handleFieldResponsibleChange}
                    options={getFieldResponsibleOptions()}
                    disabled={Boolean(action?.closed_at)}
                />
            </Grid>
            <Grid item xs={4}>
                <ResponsibleCFISelect
                    value={responsible_cfi_id ? getMemberById(responsible_cfi_id) : null}
                    onChange={handleResponsibleCFIChange}
                    options={getResponsibleCfiOptions()}
                    disabled={Boolean(action?.closed_at)}
                />
            </Grid>
            <TowAirplanesSection
                editedActiveTowAirplaneId={editedActiveTowAirplaneId}
                setEditedActiveTowAirplaneId={setEditedActiveTowAirplaneId}
                towAirplanes={towAirplanesStoreState.towAirplanes || []}
                activeTowAirplanes={currentActionStoreState?.activeTowAirplanes || []}
                disabled={Boolean(action?.closed_at)}
                onDeactivate={handleDeactivateTowAirplane}
                onActivate={handleActivateTowAirplane}
                getMemberById={getMemberById}
                getTowAirplaneById={getTowAirplaneById}
                displayTowPilotByAirplaneId={displayTowPilotByAirplaneId}
                MenuProps={MenuProps}
                actionId={action.id}
            />
        </Grid>
    );
}
