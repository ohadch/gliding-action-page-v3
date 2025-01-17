import { FlightSchema, FlightCreateSchema } from "../../lib/types";
import FlightCreationWizardDialog from "../flights/FlightCreationWizardDialog";
import EditFlightDetailsDialog from "../flights/EditFlightDetailsDialog";
import FlightStartTowDialog from "../flights/FlightStartTowDialog";
import FlightEndTowDialog from "../flights/FlightEndTowDialog";
import FlightSettlePaymentWizardDialog from "../flights/FlightSettlePaymentWizardDialog";
import { useAppDispatch } from "../../store";
import { createFlight, updateFlight } from "../../store/actions/action";
import {createEvent} from "../../store/actions/event.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface FlightDialogsProps {
    flightCreationWizardDialogOpen: boolean;
    setFlightCreationWizardDialogOpen: (open: boolean) => void;
    editFlightDetailsDialogOpen: boolean;
    setEditFlightDetailsDialogOpen: (open: boolean) => void;
    editedFlightId: number | null;
    setEditedFlightId: (id: number | null) => void;
    editedFlightData: FlightCreateSchema | null;
    setEditedFlightData: (data: FlightCreateSchema | null) => void;
    startTowDialogFlight: FlightSchema | null;
    setStartTowDialogFlight: (flight: FlightSchema | null) => void;
    endTowDialogFlight: FlightSchema | null;
    setEndTowDialogFlight: (flight: FlightSchema | null) => void;
    settlePaymentDialogFlight: FlightSchema | null;
    setSettlePaymentDialogFlight: (flight: FlightSchema | null) => void;
    actionId: number;
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
    actionId
}: FlightDialogsProps) {
    const dispatch = useAppDispatch();
    const action = useSelector((state: RootState) => 
        state.actions.actions?.find((action) => action.id === actionId)
    );

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

            {startTowDialogFlight?.id && (
                <FlightStartTowDialog
                    open={Boolean(startTowDialogFlight)}
                    flight={startTowDialogFlight}
                    onCancel={() => setStartTowDialogFlight(null)}
                    onSubmit={(flight) => {
                        dispatch(updateFlight({
                            flightId: startTowDialogFlight.id,
                            updatePayload: flight,
                        }));

                        if (actionId) {
                            dispatch(createEvent({
                                action_id: actionId,
                                type: "flight_took_off",
                                payload: {
                                    flight_id: startTowDialogFlight.id,
                                    field_responsible_id: action?.field_responsible_id,
                                }
                            }));
                        }

                        setStartTowDialogFlight(null);
                    }}
                    fieldResponsibleId={action?.field_responsible_id}
                />
            )}

            {endTowDialogFlight?.id && (
                <FlightEndTowDialog
                    open={Boolean(endTowDialogFlight)}
                    flight={endTowDialogFlight}
                    onCancel={() => setEndTowDialogFlight(null)}
                    onSubmit={(flight) => {
                        dispatch(updateFlight({
                            flightId: endTowDialogFlight.id,
                            updatePayload: flight,
                        }));

                        if (actionId) {
                            dispatch(createEvent({
                                action_id: actionId,
                                type: "flight_tow_released",
                                payload: {
                                    flight_id: endTowDialogFlight.id,
                                    field_responsible_id: action?.field_responsible_id,
                                }
                            }));
                        }

                        setEndTowDialogFlight(null);
                    }}
                    fieldResponsibleId={action?.field_responsible_id}
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