import { FlightSchema, FlightCreateSchema, FlightUpdateSchema } from "../../lib/types";
import FlightCreationWizardDialog from "../flights/FlightCreationWizardDialog";
import EditFlightDetailsDialog from "../flights/EditFlightDetailsDialog";
import FlightStartTowDialog from "../flights/FlightStartTowDialog";
import FlightEndTowDialog from "../flights/FlightEndTowDialog";
import FlightSettlePaymentWizardDialog from "../flights/FlightSettlePaymentWizardDialog";
import {useAppDispatch} from "../../store";
import { createFlight, updateFlight } from "../../store";

interface FlightDialogsProps {
    flightCreationWizardDialogOpen: boolean;
    setFlightCreationWizardDialogOpen: (open: boolean) => void;
    editFlightDetailsDialogOpen: boolean;
    setEditFlightDetailsDialogOpen: (open: boolean) => void;
    editedFlightId: number | null;
    setEditedFlightId: (id: number | null) => void;
    editedFlightData: FlightSchema | null;
    setEditedFlightData: (data: FlightCreateSchema | null) => void;
    startTowDialogFlight: FlightSchema | null;
    setStartTowDialogFlight: (flight: FlightSchema | null) => void;
    endTowDialogFlight: FlightSchema | null;
    setEndTowDialogFlight: (flight: FlightSchema | null) => void;
    settlePaymentDialogFlight: FlightSchema | null;
    setSettlePaymentDialogFlight: (flight: FlightSchema | null) => void;
    actionId: number;
    onStartTowSubmit: (flight: FlightUpdateSchema) => void;
    onEndTowSubmit: (flight: FlightUpdateSchema) => void;
}

export function FlightDialogs({
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
    onStartTowSubmit,
    onEndTowSubmit
}: FlightDialogsProps) {
    console.log('FlightDialogs render:', { endTowDialogFlight });

    const dispatch = useAppDispatch();

    return (
        <>
            {editFlightDetailsDialogOpen && editedFlightData && (
                <EditFlightDetailsDialog
                    flightId={editedFlightId}
                    flightData={editedFlightData}
                    open={editFlightDetailsDialogOpen}
                    onCancel={() => {
                        setEditedFlightId(null);
                        setEditFlightDetailsDialogOpen(false);
                    }}
                    onCreate={(createPayload) => {
                        dispatch(createFlight({ createPayload }));
                        setEditFlightDetailsDialogOpen(false);
                        setEditedFlightData(null);
                    }}
                    onUpdate={(flightId, updatePayload) => {
                        dispatch(updateFlight({ flightId, updatePayload }));
                        setEditedFlightId(null);
                        setEditFlightDetailsDialogOpen(false);
                        setEditedFlightData(null);
                    }}
                />
            )}

            {flightCreationWizardDialogOpen && (
                <FlightCreationWizardDialog
                    open={flightCreationWizardDialogOpen}
                    onCancel={() => {
                        setFlightCreationWizardDialogOpen(false);
                        setEditedFlightData(null);
                    }}
                    onSubmit={payload => {
                        dispatch(createFlight({ createPayload: payload }));
                        setFlightCreationWizardDialogOpen(false);
                        setEditedFlightData(null);
                    }}
                    onAdvancedEdit={(flight) => {
                        setEditedFlightId(null);
                        setFlightCreationWizardDialogOpen(false);
                        setEditedFlightData(flight);
                        setEditFlightDetailsDialogOpen(true);
                    }}
                />
            )}

            {startTowDialogFlight && (
                <FlightStartTowDialog
                    open={Boolean(startTowDialogFlight)}
                    flight={startTowDialogFlight}
                    onCancel={() => setStartTowDialogFlight(null)}
                    onSubmit={onStartTowSubmit}
                />
            )}

            {endTowDialogFlight && (
                <FlightEndTowDialog
                    open={Boolean(endTowDialogFlight)}
                    flight={endTowDialogFlight}
                    onCancel={() => setEndTowDialogFlight(null)}
                    onSubmit={onEndTowSubmit}
                />
            )}

            {settlePaymentDialogFlight && (
                <FlightSettlePaymentWizardDialog
                    open={Boolean(settlePaymentDialogFlight)}
                    onClose={() => setSettlePaymentDialogFlight(null)}
                    flight={settlePaymentDialogFlight}
                    onSubmit={(flight) => {
                        dispatch(updateFlight({
                            flightId: settlePaymentDialogFlight.id,
                            updatePayload: flight,
                        }));
                        setSettlePaymentDialogFlight(null);
                    }}
                />
            )}
        </>
    );
} 