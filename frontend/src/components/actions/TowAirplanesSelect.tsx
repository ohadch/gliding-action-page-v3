import { useTranslation } from "react-i18next";
import { 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Box, 
    Chip,
    Autocomplete,
    TextField
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getMemberDisplayValue } from "../../utils/display";
import { getTowPilots } from "../../store/members";
import { ActiveTowAirplaneSchema, MemberSchema } from "../../lib/types";

interface TowAirplanesSelectProps {
    activeTowAirplanes: ActiveTowAirplaneSchema[] | null;
    disabled?: boolean;
    onAdd: (airplaneId: number, towPilotId: number) => void;
    onRemove: (airplaneId: number) => void;
    sx?: { height?: string };
}

const SELECT_STYLES = {
    '& .MuiSelect-select': {
        height: '100% !important',
        display: 'flex',
        flexWrap: 'nowrap',
        gap: 0.5,
        alignItems: 'center',
        overflow: 'hidden',
        fontSize: '1.1rem',
        '& .MuiBox-root': {
            display: 'flex',
            flexWrap: 'nowrap',
            maxHeight: '100%',
            overflow: 'hidden'
        },
        '& .MuiChip-label': {
            fontSize: '1rem',
            whiteSpace: 'nowrap'
        }
    },
    '& .MuiInputLabel-root': {
        fontSize: '1.1rem'
    },
    '& .MuiMenuItem-root': {
        fontSize: '1.1rem'
    }
};

export function TowAirplanesSelect({ 
    activeTowAirplanes,
    disabled = false,
    onAdd,
    onRemove,
    sx
}: TowAirplanesSelectProps) {
    const { t } = useTranslation();
    const towPilots = useSelector(getTowPilots);
    const aircraftState = useSelector((state: RootState) => state.aircraft);
    const membersState = useSelector((state: RootState) => state.members);

    return (
        <FormControl 
            fullWidth 
            sx={{ 
                height: sx?.height || '56px',
                ...SELECT_STYLES
            }}
        >
            <InputLabel id="active-tow-airplanes-label">{t("ACTIVE_TOW_AIRPLANES")}</InputLabel>
            <Select
                labelId="active-tow-airplanes-label"
                multiple
                value={activeTowAirplanes?.map(a => a.airplane_id) || []}
                label={t("ACTIVE_TOW_AIRPLANES")}
                disabled={disabled}
                renderValue={(selected) => (
                    <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'nowrap',
                        gap: 0.5,
                        alignItems: 'center',
                        maxHeight: '100%',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                    }}>
                        {activeTowAirplanes?.map((active) => {
                            const airplane = aircraftState.towAirplanes?.find(a => a.id === active.airplane_id);
                            const pilot = membersState.members?.find(m => m.id === active.tow_pilot_id);
                            if (!airplane || !pilot) return null;
                            
                            return (
                                <Chip
                                    key={airplane.id}
                                    label={`${airplane.call_sign} - ${getMemberDisplayValue(pilot)}`}
                                    size="small"
                                    sx={{
                                        maxWidth: 'none',
                                        whiteSpace: 'nowrap'
                                    }}
                                />
                            );
                        })}
                    </Box>
                )}
            >
                {aircraftState.towAirplanes?.map((airplane) => {
                    const activeTowAirplane = activeTowAirplanes?.find(
                        active => active.airplane_id === airplane.id
                    );
                    const selectedPilot = activeTowAirplane 
                        ? towPilots.find(p => p.id === activeTowAirplane.tow_pilot_id)
                        : null;

                    return (
                        <MenuItem 
                            key={airplane.id} 
                            value={airplane.id}
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 2,
                                gap: 4
                            }}
                        >
                            <Box sx={{ 
                                minWidth: 100, 
                                fontWeight: 'medium'
                            }}>
                                {airplane.call_sign}
                            </Box>
                            <Autocomplete
                                size="small"
                                sx={{ width: 300 }}
                                options={towPilots}
                                value={selectedPilot}
                                onChange={(_e, pilot) => {
                                    if (pilot) {
                                        onAdd(airplane.id, pilot.id);
                                    } else if (activeTowAirplane) {
                                        onRemove(airplane.id);
                                    }
                                }}
                                getOptionLabel={(option) => getMemberDisplayValue(option)}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        placeholder={t("SELECT_TOW_PILOT")}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                )}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
} 