import { FormControl, InputLabel, Select, Box, Chip, MenuItem, Checkbox, ListItemText, OutlinedInput, SelectChangeEvent } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TowAirplaneSchema, MemberSchema, ActiveTowAirplaneSchema } from "../../lib/types";
import { getMemberDisplayValue } from "../../utils/display";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const defaultMenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
    // Add these to fix the anchorEl warning
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
    },
    transformOrigin: {
        vertical: 'top',
        horizontal: 'left',
    }
};

interface ActiveTowAirplanesSelectProps {
    value: number[];
    towAirplanes: TowAirplaneSchema[];
    activeTowAirplanes: ActiveTowAirplaneSchema[];
    disabled: boolean;
    onActivate: (airplaneId: number) => void;
    onDeactivate: (airplaneId: number) => void;
    getMemberById: (id: number) => MemberSchema | undefined;
    getTowAirplaneById: (id: number) => TowAirplaneSchema | undefined;
    displayTowPilotByAirplaneId: (id: number) => string;
}

export function ActiveTowAirplanesSelect({
    value,
    towAirplanes,
    activeTowAirplanes,
    disabled,
    onActivate,
    onDeactivate,
    getMemberById,
    getTowAirplaneById,
    displayTowPilotByAirplaneId,
}: ActiveTowAirplanesSelectProps) {
    const { t } = useTranslation();

    // Debug logs
    console.log('Active Tow Airplanes:', activeTowAirplanes);
    console.log('All Tow Airplanes:', towAirplanes);
    console.log('Value:', value);

    // Get the actual active airplane IDs
    const activeAirplaneIds = activeTowAirplanes?.map(a => a.airplane_id) || [];
    console.log('Active Airplane IDs:', activeAirplaneIds);

    const handleChange = (event: SelectChangeEvent<number[]>) => {
        const selectedIds = event.target.value as number[];
        const currentIds = activeTowAirplanes.map(a => a.airplane_id);
        
        // Find which airplane was clicked by comparing arrays
        const deactivatedId = currentIds.find(id => !selectedIds.includes(id));
        const activatedId = selectedIds.find(id => !currentIds.includes(id));

        if (deactivatedId) {
            onDeactivate(deactivatedId);
        } else if (activatedId) {
            onActivate(activatedId);
        }
    };

    return (
        <FormControl fullWidth sx={{ height: '56px' }}>
            <InputLabel id="active-tow-airplanes-label">{t("ACTIVE_TOW_AIRPLANES")}</InputLabel>
            <Select
                disabled={disabled}
                labelId="active-tow-airplanes-label"
                id="active-tow-airplanes"
                multiple
                value={activeAirplaneIds}
                onChange={handleChange}
                input={<OutlinedInput label={t("ACTIVE_TOW_AIRPLANES")} />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((airplaneId) => {
                            const towAirplane = getTowAirplaneById(airplaneId);
                            const activeTowAirplane = activeTowAirplanes?.find(
                                (active) => active.airplane_id === airplaneId
                            );
                            const towPilot = activeTowAirplane ? getMemberById(activeTowAirplane.tow_pilot_id) : null;
                            return (
                                <Chip 
                                    key={airplaneId} 
                                    label={`${towAirplane?.call_sign}${towPilot ? ` (${getMemberDisplayValue(towPilot)})` : ''}`}
                                    disabled={disabled}
                                />
                            );
                        })}
                    </Box>
                )}
                MenuProps={defaultMenuProps}
                sx={{ height: '56px' }}
            >
                {towAirplanes.map((towAirplane) => (
                    <MenuItem 
                        key={towAirplane.id} 
                        value={towAirplane.id}
                    >
                        <Checkbox
                            checked={activeAirplaneIds.includes(towAirplane.id)}
                        />
                        <ListItemText 
                            primary={towAirplane.call_sign}
                            secondary={displayTowPilotByAirplaneId(towAirplane.id)}
                        />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
} 