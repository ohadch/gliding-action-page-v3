import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { FlightCreateSchema, FlightType, PayersType } from '../../../lib/types';
import { getClubTwoSeaterGliders, getClubGliders, getTwoSeaterGliders, getClubSingleSeaterGliders } from '../../../store/aircraft/selectors';

export function useFlightCreation() {
    const state = useSelector((state: RootState) => state);
    const aircraftState = useSelector((state: RootState) => state.aircraft);
    const action = useSelector((state: RootState) => 
        state.actionDays.list.actions?.find(
            (action) => action.id === state.actionDays.currentDay.currentActionId
        )
    );

    const [gliderId, setGliderId] = useState<number | null>(null);
    const [pilot1Id, setPilot1Id] = useState<number | null>(null);
    const [pilot2Id, setPilot2Id] = useState<number | null>(null);
    const [flightType, setFlightType] = useState<FlightType | null>(null);
    const [payersType, setPayersType] = useState<PayersType | null>(null);

    // Get filtered gliders based on flight type
    const availableGliders = useMemo(() => {
        if (flightType === "Instruction") {
            return getClubTwoSeaterGliders({ ...state, aircraft: aircraftState });
        }
        if (flightType === "Solo") {
            return getClubSingleSeaterGliders({ ...state, aircraft: aircraftState });
        }
        return aircraftState.gliders || [];
    }, [flightType, aircraftState, state]);

    // Clear glider if it's not in available gliders after flight type change
    useEffect(() => {
        if (gliderId && availableGliders.every(g => g.id !== gliderId)) {
            setGliderId(null);
        }
    }, [availableGliders, gliderId]);

    const handleGliderChange = (newGliderId: number | null) => setGliderId(newGliderId);
    const handlePilot1Change = (newPilotId: number | null) => setPilot1Id(newPilotId);
    const handlePilot2Change = (newPilotId: number | null) => setPilot2Id(newPilotId);
    const handleFlightTypeChange = (newType: FlightType | null) => setFlightType(newType);
    const handlePayersTypeChange = (newType: PayersType | null) => setPayersType(newType);

    const isSubmitEnabled = () => {
        // Basic requirements for all flight types
        const hasBasicRequirements = Boolean(gliderId && pilot1Id && flightType);

        // For Solo flights, we only need pilot 1
        if (flightType === "Solo") {
            return hasBasicRequirements;
        }

        // For Members flights, we allow either one or two pilots
        if (flightType === "Members") {
            return hasBasicRequirements;
        }

        // For all other flight types (Instruction, ClubGuest, MembersGuest, etc.), we need both pilots
        return hasBasicRequirements && Boolean(pilot2Id);
    };

    const createFlightPayload = (): FlightCreateSchema => ({
        action_id: action?.id || 0,
        state: "Draft",
        glider_id: gliderId,
        pilot_1_id: pilot1Id,
        pilot_2_id: pilot2Id,
        flight_type: flightType,
        payers_type: payersType,
        take_off_at: null,
        landing_at: null,
        tow_airplane_id: null,
        tow_pilot_id: null,
        tow_release_at: null,
        tow_type: null,
        payment_method: null,
        payment_receiver_id: null,
        paying_member_id: null,
    });

    return {
        gliderId,
        pilot1Id,
        pilot2Id,
        flightType,
        payersType,
        availableGliders,
        handleGliderChange,
        handlePilot1Change,
        handlePilot2Change,
        handleFlightTypeChange,
        handlePayersTypeChange,
        isSubmitEnabled,
        createFlightPayload,
    };
} 