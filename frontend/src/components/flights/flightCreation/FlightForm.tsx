import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Autocomplete, TextField, Chip, Card, CardContent, Grid } from '@mui/material';
import { FlightType, PayersType, GliderSchema, MemberSchema } from '../../../lib/types';
import { RootState } from '../../../store';
import { getSoloStudents } from '../../../store/members/selectors';
import { getMemberDisplayValue } from '../../../utils/display';
import { TEXTS, SUPPORTED_FLIGHT_TYPES } from '../../../utils/consts';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SearchIcon from '@mui/icons-material/Search';

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
        
        // Filter for instructors if selecting pilot 2 for instruction flights
        if (flightType === "Instruction" && excludePilotId === pilot1Id) {
            const instructors = members.filter(member => 
                roles.some(role => 
                    role.member_id === member.id && 
                    ["ResponsibleCFI", "CFI"].includes(role.role)
                )
            );
            options = instructors;
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

    const getFlightTypeIcon = (type: FlightType) => {
        switch (type) {
            case "Instruction":
                return <SchoolIcon sx={{ fontSize: 40 }} />;
            case "Solo":
                return <PersonIcon sx={{ fontSize: 40 }} />;
            case "Members":
                return <GroupIcon sx={{ fontSize: 40 }} />;
            case "ClubGuest":
            case "MembersGuest":
                return <PeopleIcon sx={{ fontSize: 40 }} />;
            case "InstructorsCourse":
                return <SupervisorAccountIcon sx={{ fontSize: 40 }} />;
            case "Inspection":
                return <SearchIcon sx={{ fontSize: 40 }} />;
            default:
                return null;
        }
    };

    const getFlightTypeDescription = (type: FlightType) => {
        switch (type) {
            case "Instruction":
                return t("INSTRUCTION_FLIGHT_DESCRIPTION");
            case "Solo":
                return t("SOLO_FLIGHT_DESCRIPTION");
            case "Members":
                return t("MEMBERS_FLIGHT_DESCRIPTION");
            case "ClubGuest":
                return t("CLUB_GUEST_FLIGHT_DESCRIPTION");
            case "MembersGuest":
                return t("MEMBERS_GUEST_FLIGHT_DESCRIPTION");
            case "InstructorsCourse":
                return t("INSTRUCTORS_COURSE_FLIGHT_DESCRIPTION");
            case "Inspection":
                return t("INSPECTION_FLIGHT_DESCRIPTION");
            default:
                return "";
        }
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {!flightType ? (
                <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>{t(TEXTS.FLIGHT_TYPE)}</Typography>
                    <Grid container spacing={2}>
                        {SUPPORTED_FLIGHT_TYPES.map((type) => (
                            <Grid item xs={12} sm={6} md={4} key={type}>
                                <Card 
                                    sx={{ 
                                        cursor: 'pointer',
                                        height: '100%',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            boxShadow: 4
                                        }
                                    }}
                                    onClick={() => onFlightTypeChange(type)}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                            {getFlightTypeIcon(type)}
                                            <Typography variant="h6" align="center">
                                                {t(TEXTS[type.toUpperCase()])}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" align="center">
                                                {getFlightTypeDescription(type)}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ) : (
                <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {t(TEXTS.FLIGHT_TYPE)}
                        <Chip
                            label={t(TEXTS[flightType.toUpperCase()])}
                            onDelete={() => onFlightTypeChange(null)}
                            icon={getFlightTypeIcon(flightType)}
                            sx={{ ml: 2 }}
                        />
                    </Typography>
                </Box>
            )}

            {flightType && (
                <>
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>{t(TEXTS.GLIDER)}</Typography>
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
                    </Box>

                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>{getPilot1Label()}</Typography>
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
                    </Box>

                    {flightType !== "Solo" && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {getPilot2Label()}
                                {flightType === "Members" && (
                                    <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        ({t("OPTIONAL")})
                                    </Typography>
                                )}
                            </Typography>
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
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
} 