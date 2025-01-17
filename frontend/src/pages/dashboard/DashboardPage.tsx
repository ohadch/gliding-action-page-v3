import { useState } from "react";
import { FlightCreateSchema, FlightSchema } from "../../lib/types";
import { ActionConfiguration } from "../../components/dashboard/ActionConfiguration";
import { FlightsList } from "../../components/dashboard/FlightsList";
import { QuickActions } from "../../components/dashboard/QuickActions";
import { FlightDialogs } from "../../components/dashboard/FlightDialogs";
import { useFlightData } from "../../hooks/useFlightData";
import { useAppDispatch } from "../../store";
import { updateAction, deleteFlight } from "../../store/actions/action";
import { createEvent } from "../../store/actions/event";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useFlightStateManager } from "../../utils/flightStateManager";

export default function DashboardPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { action, flights } = useFlightData();
    
    // Dialog states
    const [flightCreationWizardDialogOpen, setFlightCreationWizardDialogOpen] = useState(false);
    const [summaryGeneratorWizardDialogOpen, setSummaryGeneratorWizardDialogOpen] = useState(false);
    const [editedFlightId, setEditedFlightId] = useState<number | null>(null);
    const [editedFlightData, setEditedFlightData] = useState<FlightCreateSchema | null>(null);
    const [editFlightDetailsDialogOpen, setEditFlightDetailsDialogOpen] = useState(false);
    const [startTowDialogFlight, setStartTowDialogFlight] = useState<FlightSchema | null>(null);
    const [endTowDialogFlight, setEndTowDialogFlight] = useState<FlightSchema | null>(null);
    const [settlePaymentDialogFlight, setSettlePaymentDialogFlight] = useState<FlightSchema | null>(null);

    const handleCloseAction = () => {
        if (!action || !confirm(t("CLOSE_ACTION_CONFIRMATION"))) {
            return;
        }

        const draftFlights = flights?.filter((flight) => flight.state === "Draft") || [];
        draftFlights.forEach((flight) => dispatch(deleteFlight(flight.id)));

        dispatch(
            updateAction({
                actionId: action.id,
                updatePayload: {
                    ...action,
                    closed_at: moment().utcOffset(0, true).set({
                        date: moment(action?.date).date(),
                        month: moment(action?.date).month(),
                        year: moment(action?.date).year(),
                    }).toISOString()
                }
            })
        );

        if (confirm(t("CLOSE_ACTION_EVENT_CONFIRMATION"))) {
            dispatch(
                createEvent({
                    action_id: action.id,
                    type: "action_closed",
                    payload: {
                        field_responsible_id: action?.field_responsible_id,
                    }
                })
            );
        }
    };

    const handleFlightStateUpdate = useFlightStateManager();

    if (!action) {
        return null;
    }

    const dialogProps = {
        flightCreationWizardDialogOpen,
        setFlightCreationWizardDialogOpen,
        editFlightDetailsDialogOpen,
        setEditFlightDetailsDialogOpen,
        editedFlightId,
        setEditedFlightId,
        editedFlightData,
        setEditedFlightData,
        startTowDialogFlight,
        setStartTowDialogFlight,
        endTowDialogFlight,
        setEndTowDialogFlight,
        settlePaymentDialogFlight,
        setSettlePaymentDialogFlight,
    };

    return (
        <>
            <ActionConfiguration 
                onNewFlightClick={() => setFlightCreationWizardDialogOpen(true)} 
            />

            <FlightsList
                onEditFlight={(flightId, flight) => {
                    setEditFlightDetailsDialogOpen(true);
                    setEditedFlightId(flightId);
                    setEditedFlightData({...flight});
                }}
                onDuplicateFlight={(flight) => {
                    setEditFlightDetailsDialogOpen(true);
                    setEditedFlightData({...flight});
                }}
                onFlightStateUpdated={(flightId, state) => {
                    const flight = flights?.find(f => f.id === flightId);
                    if (!flight) return;
                    
                    handleFlightStateUpdate(
                        flight,
                        state,
                        setStartTowDialogFlight,
                        setEndTowDialogFlight
                    );
                }}
                onSettlePayment={(flight) => setSettlePaymentDialogFlight(flight)}
            />

            <QuickActions 
                onGenerateSummary={() => setSummaryGeneratorWizardDialogOpen(true)}
                onCloseAction={handleCloseAction}
            />

            <FlightDialogs
                {...dialogProps}
                actionId={action.id}
            />
        </>
    );
}
