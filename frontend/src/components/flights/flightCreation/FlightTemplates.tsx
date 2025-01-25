import { useTranslation } from "react-i18next";
import { Box, Chip, Typography } from "@mui/material";
import { RootState } from "../../../store";
import { FlightType, PayersType } from "../../../lib/types";
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { getClubTwoSeaterGliders } from "../../../store/aircraft/selectors";

interface FlightTemplate {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    getDefaults: (state: RootState) => {
        flight_type: FlightType;
        pilot_1_id?: number;
        pilot_2_id?: number;
        glider_id?: number;
        payers_type?: PayersType;
    };
}

interface FlightTemplatesProps {
    onTemplateSelect: (template: FlightTemplate) => void;
}

const FLIGHT_TEMPLATES: FlightTemplate[] = [
    {
        id: "TRAINING_FLIGHT",
        label: "TRAINING_FLIGHT",
        description: "TRAINING_FLIGHT_DESCRIPTION",
        icon: <SchoolIcon />,
        getDefaults: (state: RootState) => {
            const action = state.actionDays.list.actions?.find(
                (action) => action.id === state.actionDays.currentDay.currentActionId
            );

            if (!action) {
                return { flight_type: "Instruction" };
            }

            // Find the latest flight with the instructor in the current action
            const latestFlightWithInstructor = state.actionDays.list.flights
                ?.filter(flight => 
                    flight.action_id === action.id && 
                    flight.pilot_2_id === action.responsible_cfi_id
                )
                .sort((a, b) => {
                    if (!a.take_off_at || !b.take_off_at) return 0;
                    return new Date(b.take_off_at).getTime() - new Date(a.take_off_at).getTime();
                })[0];

            return {
                flight_type: "Instruction",
                pilot_2_id: action.responsible_cfi_id,
                // If there was a previous flight with this instructor, use the same glider and student
                ...(latestFlightWithInstructor && {
                    glider_id: latestFlightWithInstructor.glider_id,
                    pilot_1_id: latestFlightWithInstructor.pilot_1_id,
                })
            };
        }
    },
    {
        id: "SOLO_FLIGHT",
        label: "SOLO_STUDENT_FLIGHT",
        description: "SOLO_STUDENT_FLIGHT_DESCRIPTION",
        icon: <PersonIcon />,
        getDefaults: () => ({
            flight_type: "Solo"
        })
    },
    {
        id: "MEMBERS_FLIGHT",
        label: "MEMBERS",
        description: "MEMBERS_FLIGHT_DESCRIPTION",
        icon: <GroupIcon />,
        getDefaults: () => ({
            flight_type: "Members"
        })
    },
    {
        id: "CLUB_GUEST_FLIGHT",
        label: "CLUBGUEST",
        description: "CLUB_GUEST_FLIGHT_DESCRIPTION",
        icon: <PeopleIcon />,
        getDefaults: (state: RootState) => {
            const clubTwoSeaterGliders = getClubTwoSeaterGliders(state);
            return {
                flight_type: "ClubGuest",
                payers_type: "Guest",
                ...(clubTwoSeaterGliders.length > 0 && {
                    glider_id: clubTwoSeaterGliders[0].id
                })
            };
        }
    },
    {
        id: "MEMBER_GUEST_FLIGHT",
        label: "MEMBERSGUEST",
        description: "MEMBER_GUEST_FLIGHT_DESCRIPTION",
        icon: <SupervisorAccountIcon />,
        getDefaults: () => ({
            flight_type: "MembersGuest"
        })
    }
];

export function FlightTemplates({ onTemplateSelect }: FlightTemplatesProps) {
    const { t } = useTranslation();

    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
                {FLIGHT_TEMPLATES.map((template) => (
                    <Chip
                        key={template.id}
                        label={t(template.label)}
                        onClick={() => onTemplateSelect(template)}
                        title={t(template.description)}
                        icon={template.icon}
                        sx={{
                            fontSize: '1rem',
                            height: 'auto',
                            py: 1,
                            '& .MuiChip-label': {
                                px: 2
                            }
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
} 