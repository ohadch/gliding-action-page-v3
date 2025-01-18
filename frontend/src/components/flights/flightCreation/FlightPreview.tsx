import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { FlightType } from "../../../lib/types";
import { getFlightTypeDisplayValue, getMemberDisplayValue } from "../../../utils/display";
import FlightIcon from '@mui/icons-material/Flight';
import PersonIcon from '@mui/icons-material/Person';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import { useCallback } from "react";

interface FlightPreviewProps {
    gliderId: number | null;
    pilot1Id: number | null;
    pilot2Id: number | null;
    flightType: FlightType | null;
}

export function FlightPreview({
    gliderId,
    pilot1Id,
    pilot2Id,
    flightType,
}: FlightPreviewProps) {
    const { t } = useTranslation();
    const membersState = useSelector((state: RootState) => state.members);
    const aircraftState = useSelector((state: RootState) => state.aircraft);

    const getMemberById = useCallback(
        (id: number) => membersState.members?.find((member) => member.id === id),
        [membersState.members]
    );

    if (!gliderId && !pilot1Id && !pilot2Id && !flightType) {
        return (
            <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CardContent>
                    <Typography variant="h6" color="text.secondary" textAlign="center">
                        <FlightIcon sx={{ fontSize: 40, mb: 1, display: 'block', mx: 'auto' }} />
                        {t("SELECT_FLIGHT_DETAILS")}
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AirplanemodeActiveIcon sx={{ fontSize: 30, mr: 1 }} />
                    <Typography variant="h6">
                        {gliderId ? aircraftState.gliders?.find(g => g.id === gliderId)?.call_sign : t("NO_GLIDER_SELECTED")}
                    </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {pilot1Id && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ mr: 1 }} />
                            <Typography>
                                <strong>{t("PILOT_1")}:</strong> {getMemberDisplayValue(getMemberById(pilot1Id)!)}
                            </Typography>
                        </Box>
                    )}
                    
                    {pilot2Id && flightType !== "Solo" && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ mr: 1 }} />
                            <Typography>
                                <strong>{t("PILOT_2")}:</strong> {getMemberDisplayValue(getMemberById(pilot2Id)!)}
                            </Typography>
                        </Box>
                    )}
                    
                    {flightType && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FlightIcon sx={{ mr: 1 }} />
                            <Typography>
                                <strong>{t("FLIGHT_TYPE")}:</strong> {getFlightTypeDisplayValue(flightType)}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
} 