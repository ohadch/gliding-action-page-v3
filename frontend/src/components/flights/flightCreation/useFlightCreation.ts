import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { FlightCreateSchema, FlightType, PayersType } from '../../../lib/types';
import { getClubTwoSeaterGliders, getClubGliders, getTwoSeaterGliders } from '../../../store/aircraft/selectors';

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
            // Debug information
            const clubGliders = getClubGliders({ ...state, aircraft: aircraftState });
            const twoSeaterGliders = getTwoSeaterGliders({ ...state, aircraft: aircraftState });
            const clubTwoSeaters = getClubTwoSeaterGliders({ ...state, aircraft: aircraftState });
            
            console.log('Debug - Gliders:', {
                allGliders: aircraftState.gliders,
                ownerships: aircraftState.gliderOwnerships,
                clubGliders,
                twoSeaterGliders,
                clubTwoSeaters
            });
            
            return clubTwoSeaters;
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
    const handleFlightTypeChange = (newType: FlightType | null) => {
        console.log('Debug - Flight type changed to:', newType);
        setFlightType(newType);
    };
    const handlePayersTypeChange = (newType: PayersType | null) => setPayersType(newType);

    const handleTemplateSelect = (template: any) => {
        const defaults = template.getDefaults(state);
        console.log('Debug - Template defaults:', defaults);
        
        // First set the flight type to ensure proper glider filtering
        if (defaults.flight_type) {
            setFlightType(defaults.flight_type as FlightType);
        }

        // Set pilots
        if (defaults.pilot_1_id) setPilot1Id(defaults.pilot_1_id);
        if (defaults.pilot_2_id) setPilot2Id(defaults.pilot_2_id);

        // Set glider only if it's available in the filtered list
        if (defaults.glider_id) {
            // For instruction flights, verify the glider is a club-owned two-seater
            if (defaults.flight_type === "Instruction") {
                const clubTwoSeaters = getClubTwoSeaterGliders({ ...state, aircraft: aircraftState });
                console.log('Debug - Available club two-seaters:', clubTwoSeaters);
                if (clubTwoSeaters.some(g => g.id === defaults.glider_id)) {
                    setGliderId(defaults.glider_id);
                }
            } else {
                setGliderId(defaults.glider_id);
            }
        }
    };

    const isSubmitEnabled = () => {
        if (flightType === "Solo") {
            return Boolean(gliderId && pilot1Id && flightType);
        }
        return Boolean(gliderId && pilot1Id && pilot2Id && flightType);
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
        handleTemplateSelect,
        isSubmitEnabled,
        createFlightPayload,
    };
} 