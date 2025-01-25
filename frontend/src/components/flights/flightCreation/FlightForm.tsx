import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Autocomplete, TextField, Chip } from '@mui/material';
import { FlightType, PayersType, GliderSchema, MemberSchema } from '../../../lib/types';
import { RootState } from '../../../store';
import { getSoloStudents } from '../../../store/members/selectors';
import { getMemberDisplayValue } from '../../../utils/display';
import { TEXTS, SUPPORTED_FLIGHT_TYPES } from '../../../utils/consts';

interface FlightFormProps {
    gliderId: number | null;
    pilot1Id: number | null;
    pilot2Id: number | null;
    flightType: FlightType | null;
    payersType: PayersType | null;
    availableGliders: GliderSchema[];
    onGliderChange: (id: number | null) => void;
    onPilot1Change: (id: number | null) => void;
    onPilot2Change: (id: number | null) => void;
    onFlightTypeChange: (type: FlightType | null) => void;
    onPayersTypeChange: (type: PayersType | null) => void;
}

export function FlightForm({
    gliderId,
    pilot1Id,
    pilot2Id,
    flightType,
    payersType,
    availableGliders,
    onGliderChange,
    onPilot1Change,
    onPilot2Change,
    onFlightTypeChange,
    onPayersTypeChange,
}: FlightFormProps) {
    const { t } = useTranslation();
    const members = useSelector((state: RootState) => state.members.members || []);
    const soloStudents = useSelector(getSoloStudents) || [];
    const roles = useSelector((state: RootState) => state.members.roles || []);

    // Set payers type based on flight type
    useEffect(() => {
        if (flightType === "Instruction" || flightType === "Solo") {
            onPayersTypeChange("FirstPilot");
        } else if (flightType === "Members") {
            onPayersTypeChange("BothPilots");
        }
    }, [flightType, onPayersTypeChange]);

    // Clear pilot2 when switching to solo flight
    useEffect(() => {
        if (flightType === "Solo" && pilot2Id !== null) {
            onPilot2Change(null);
        }
    }, [flightType, pilot2Id, onPilot2Change]);

    const getPilotOptions = (excludePilotId?: number) => {
        let options = members;
        
        // Filter for solo students if flight type is Solo
        if (flightType === "Solo") {
            options = soloStudents;
        }
        
        // Exclude the other pilot if one is selected
        if (excludePilotId) {
            options = options.filter(member => member.id !== excludePilotId);
        }
        
        return options;
    };

    const getMemberRoles = (member: MemberSchema) => {
        return roles
            .filter(role => role.member_id === member.id)
            .map(role => t(TEXTS[role.role]));
    };

    const getFlightTypeDisplayValue = (type: FlightType) => {
        return t(TEXTS[type.toUpperCase()]);
    };

    const getPilot1Label = () => {
        if (!flightType) return t(TEXTS.PILOT_1);
        
        switch (flightType) {
            case "Instruction":
            case "Solo":
                return t("STUDENT");
            case "ClubGuest":
            case "MembersGuest":
                return t("GUEST");
            default:
                return t("PILOT_1");
        }
    };

    const getPilot2Label = () => {
        if (!flightType) return t(TEXTS.PILOT_2);
        
        switch (flightType) {
            case "Instruction":
                return t("INSTRUCTOR");
            case "Members":
                return t("PILOT_2");
            case "ClubGuest":
            case "MembersGuest":
                return t("ACCOMPANYING_PILOT");
            default:
                return t(TEXTS.PILOT_2);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Autocomplete
                value={availableGliders.find(g => g.id === gliderId) || null}
                onChange={(_, newValue) => onGliderChange(newValue?.id || null)}
                options={availableGliders}
                getOptionLabel={(glider) => glider.call_sign}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, glider) => (
                    <Box component="li" {...props} sx={{
                        py: 1,
                        px: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                            bgcolor: 'action.hover',
                        }
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {glider.call_sign}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {t(TEXTS[glider.type.toUpperCase()])} • {glider.num_seats} {t(TEXTS.SEATS)}
                            </Typography>
                        </Box>
                        <Chip
                            label={t(TEXTS[glider.ownerships?.length ? 'PRIVATE' : 'CLUB_OWNED'])}
                            color={glider.ownerships?.length ? 'default' : 'primary'}
                            size="small"
                            sx={{ minWidth: 80 }}
                        />
                    </Box>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={t(TEXTS.GLIDER)}
                        placeholder={t(TEXTS.SELECT_GLIDER)}
                    />
                )}
            />

            <Autocomplete
                value={members.find(m => m.id === pilot1Id) || null}
                onChange={(_, newValue) => onPilot1Change(newValue?.id || null)}
                options={getPilotOptions(pilot2Id)}
                getOptionLabel={getMemberDisplayValue}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, member) => (
                    <Box component="li" {...props} sx={{
                        py: 1,
                        px: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                            bgcolor: 'action.hover',
                        }
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {getMemberDisplayValue(member)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {getMemberRoles(member).join(' • ')}
                            </Typography>
                        </Box>
                    </Box>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={getPilot1Label()}
                        placeholder={t(TEXTS.SELECT_PILOT)}
                    />
                )}
            />

            {flightType !== "Solo" && (
                <Autocomplete
                    value={members.find(m => m.id === pilot2Id) || null}
                    onChange={(_, newValue) => onPilot2Change(newValue?.id || null)}
                    options={getPilotOptions(pilot1Id)}
                    getOptionLabel={getMemberDisplayValue}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderOption={(props, member) => (
                        <Box component="li" {...props} sx={{
                            py: 1,
                            px: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            }
                        }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    {getMemberDisplayValue(member)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {getMemberRoles(member).join(' • ')}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={getPilot2Label()}
                            placeholder={t(TEXTS.SELECT_PILOT)}
                        />
                    )}
                />
            )}

            <Autocomplete
                value={flightType}
                onChange={(_, newValue) => onFlightTypeChange(newValue)}
                options={SUPPORTED_FLIGHT_TYPES}
                getOptionLabel={getFlightTypeDisplayValue}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={t(TEXTS.FLIGHT_TYPE)}
                        placeholder={t(TEXTS.SELECT_FLIGHT_TYPE)}
                    />
                )}
            />
        </Box>
    );
} 