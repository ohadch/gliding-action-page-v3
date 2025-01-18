import { useActionConfiguration } from "../../hooks/useActionConfiguration";
import { useTranslation } from "react-i18next";
import { Grid, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getMemberDisplayValue } from "../../utils/display";
import { getFieldResponsibles, getInstructors } from "../../store/members";
import { TowAirplanesSelect } from "./TowAirplanesSelect";
import AddIcon from '@mui/icons-material/Add';

interface ActionConfigurationComponentProps {
    onNewFlightClick: () => void;
}

// Define consistent heights - use a smaller height that works for all components
const FORM_CONTROL_HEIGHT = '56px';

const SHARED_STYLES = {
    height: FORM_CONTROL_HEIGHT,
    '& .MuiSelect-select, & .MuiButtonBase-root': {
        height: '100% !important',
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.1rem'  // Larger text for all inputs
    },
    '& .MuiInputLabel-root': {
        fontSize: '1.1rem'  // Larger label text
    },
    '& .MuiMenuItem-root': {
        fontSize: '1.1rem'  // Larger menu item text
    }
};

const BUTTON_STYLES = {
    height: '100%',
    fontSize: '1.1rem',
    gap: 1,  // Space between icon and text
    '& .MuiSvgIcon-root': {
        fontSize: '1.3rem'  // Slightly larger icon
    }
};

export function ActionConfigurationComponent({ onNewFlightClick }: ActionConfigurationComponentProps) {
    const { t } = useTranslation();
    const { 
        action,
        activeTowAirplanes,
        handleActionUpdate,
        handleActiveTowAirplaneAdd,
        handleActiveTowAirplaneRemove 
    } = useActionConfiguration();

    const fieldResponsibles = useSelector(getFieldResponsibles);
    const instructors = useSelector(getInstructors);
    const aircraftState = useSelector((state: RootState) => state.aircraft);
    const membersState = useSelector((state: RootState) => state.members);

    if (!action) {
        return null;
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
                <FormControl fullWidth sx={SHARED_STYLES}>
                    <Button
                        variant="contained"
                        onClick={onNewFlightClick}
                        disabled={!action.field_responsible_id || !action.responsible_cfi_id || Boolean(action?.closed_at)}
                        fullWidth
                        sx={BUTTON_STYLES}
                        startIcon={<AddIcon />}
                    >
                        {t("NEW_FLIGHT")}
                    </Button>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={9}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth sx={SHARED_STYLES}>
                            <InputLabel id="field-responsible-label">
                                {t("FIELD_RESPONSIBLE")}
                            </InputLabel>
                            <Select
                                labelId="field-responsible-label"
                                value={action.field_responsible_id || ''}
                                label={t("FIELD_RESPONSIBLE")}
                                onChange={(e) => handleActionUpdate({
                                    field_responsible_id: Number(e.target.value)
                                })}
                                disabled={Boolean(action?.closed_at)}
                                sx={{ height: '100%' }}
                            >
                                {fieldResponsibles.map((member) => (
                                    <MenuItem key={member.id} value={member.id}>
                                        {getMemberDisplayValue(member)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth sx={SHARED_STYLES}>
                            <InputLabel id="responsible-cfi-label">
                                {t("RESPONSIBLE_CFI")}
                            </InputLabel>
                            <Select
                                labelId="responsible-cfi-label"
                                value={action.responsible_cfi_id || ''}
                                label={t("RESPONSIBLE_CFI")}
                                onChange={(e) => handleActionUpdate({
                                    responsible_cfi_id: Number(e.target.value)
                                })}
                                disabled={Boolean(action?.closed_at)}
                                sx={{ height: '100%' }}
                            >
                                {instructors.map((member) => (
                                    <MenuItem key={member.id} value={member.id}>
                                        {getMemberDisplayValue(member)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TowAirplanesSelect
                            activeTowAirplanes={activeTowAirplanes}
                            disabled={Boolean(action?.closed_at)}
                            onAdd={handleActiveTowAirplaneAdd}
                            onRemove={handleActiveTowAirplaneRemove}
                            sx={{ height: '100%' }}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}