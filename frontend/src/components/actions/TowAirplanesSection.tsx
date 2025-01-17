import { Grid } from "@mui/material";
import { ActiveTowAirplanesSelect } from "./ActiveTowAirplanesSelect";
import EditActiveTowAirplanesDialog from "./EditActiveTowAirplanesDialog";
import { TowAirplaneSchema, MemberSchema } from "../../lib/types";

interface TowAirplanesSectionProps {
    editedActiveTowAirplaneId: number | null;
    setEditedActiveTowAirplaneId: (id: number | null) => void;
    towAirplanes: TowAirplaneSchema[];
    activeTowAirplanes: any[]; // Replace with proper type
    disabled: boolean;
    onDeactivate: (airplaneId: number) => void;
    onActivate: (towPilotId: number) => void;
    getMemberById: (id: number) => MemberSchema | undefined;
    getTowAirplaneById: (id: number) => TowAirplaneSchema | undefined;
    displayTowPilotByAirplaneId: (id: number) => string;
    MenuProps: any; // Replace with proper type
    actionId: number;
}

export function TowAirplanesSection({
    editedActiveTowAirplaneId,
    setEditedActiveTowAirplaneId,
    towAirplanes,
    activeTowAirplanes,
    disabled,
    onDeactivate,
    onActivate,
    getMemberById,
    getTowAirplaneById,
    displayTowPilotByAirplaneId,
    MenuProps,
    actionId
}: TowAirplanesSectionProps) {
    // Debug logs
    console.log('Section Active Tow Airplanes:', activeTowAirplanes);

    return (
        <>
            {editedActiveTowAirplaneId && (
                <EditActiveTowAirplanesDialog
                    open={Boolean(editedActiveTowAirplaneId)}
                    onCancel={() => setEditedActiveTowAirplaneId(null)}
                    onSubmit={onActivate}
                    actionId={actionId}
                    towAirplaneId={editedActiveTowAirplaneId}
                />
            )}
            <Grid item xs={4}>
                <ActiveTowAirplanesSelect
                    value={activeTowAirplanes?.map(a => a.airplane_id) || []}
                    towAirplanes={towAirplanes}
                    activeTowAirplanes={activeTowAirplanes}
                    disabled={disabled}
                    onActivate={setEditedActiveTowAirplaneId}
                    onDeactivate={onDeactivate}
                    getMemberById={getMemberById}
                    getTowAirplaneById={getTowAirplaneById}
                    displayTowPilotByAirplaneId={displayTowPilotByAirplaneId}
                    MenuProps={MenuProps}
                />
            </Grid>
        </>
    );
} 