import { useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store";
import { 
    updateAction, 
    setCurrentActionId, 
    addActiveTowAirplane, 
    deleteActiveTowAirplane 
} from "../store/actionDays";
import { ActionSchema } from "../lib/types";

export function useActionConfiguration() {
    const dispatch = useAppDispatch();
    const action = useSelector((state: RootState) => 
        state.actionDays.list.actions?.find(
            (action) => action.id === state.actionDays.currentDay.currentActionId
        )
    );
    const { currentDay } = useSelector((state: RootState) => state.actionDays);

    const handleActionSelect = useCallback((actionId: number) => {
        dispatch(setCurrentActionId(actionId));
    }, [dispatch]);

    const handleActionUpdate = useCallback((updatePayload: Partial<ActionSchema>) => {
        if (!action) return;

        dispatch(updateAction({
            actionId: action.id,
            updatePayload: {
                ...action,
                ...updatePayload
            }
        }));
    }, [action, dispatch]);

    const handleActiveTowAirplaneAdd = useCallback((airplaneId: number, towPilotId: number) => {
        if (!action) return;

        dispatch(addActiveTowAirplane({
            actionId: action.id,
            airplaneId,
            towPilotId
        }));
    }, [action, dispatch]);

    const handleActiveTowAirplaneRemove = useCallback((airplaneId: number) => {
        if (!action) return;

        const activeTowAirplane = currentDay.activeTowAirplanes?.find(
            (active) => active.airplane_id === airplaneId
        );

        if (!activeTowAirplane) return;

        dispatch(deleteActiveTowAirplane(activeTowAirplane.id));
    }, [action, currentDay.activeTowAirplanes]);

    return {
        action,
        activeTowAirplanes: currentDay.activeTowAirplanes || [],
        handleActionSelect,
        handleActionUpdate,
        handleActiveTowAirplaneAdd,
        handleActiveTowAirplaneRemove
    };
} 