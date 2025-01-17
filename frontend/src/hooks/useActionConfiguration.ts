import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store";
import { MemberSchema } from "../lib/types";
import { updateAction, deleteActiveTowAirplane, addActiveTowAirplane, fetchActiveTowAirplanes } from "../store/actions/action";
import { createEvent } from "../store/actions/event";
import { useTranslation } from "react-i18next";
import { isCfi, isFieldResponsible } from "../utils/members";
import {getMemberDisplayValue} from "../utils/display.ts";

export function useActionConfiguration() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const membersStoreState = useSelector((state: RootState) => state.members);
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes);
    const action = useSelector((state: RootState) => 
        state.actions.actions?.find((action) => action.id === state.actions.actionId)
    );
    const currentActionStoreState = useSelector((state: RootState) => state.actions);
    const [editedActiveTowAirplaneId, setEditedActiveTowAirplaneId] = useState<number | null>(null);

    useEffect(() => {
        if (action?.id) {
            dispatch(fetchActiveTowAirplanes(action.id));
        }
    }, [action?.id, dispatch]);

    console.log('Action:', action);
    console.log('Current Action Store State:', currentActionStoreState);
    console.log('Active Tow Airplanes:', currentActionStoreState?.activeTowAirplanes);

    const getMemberById = useCallback((id: number) => 
        membersStoreState.members?.find((member) => member.id === id), 
        [membersStoreState.members]
    );

    const getTowAirplaneById = useCallback((id: number) => 
        towAirplanesStoreState.towAirplanes?.find((towAirplane) => towAirplane.id === id), 
        [towAirplanesStoreState.towAirplanes]
    );

    const activeTowPilotIds = currentActionStoreState?.activeTowAirplanes?.map(
        (activeTowAirplane) => activeTowAirplane.tow_pilot_id
    ) || [];

    // Move all the handler functions here
    const handleFieldResponsibleChange = useCallback((newValue: MemberSchema | null) => {
        if (!action) {
            return;
        }

        if (!confirm(t("CHANGE_FIELD_RESPONSIBLE_CONFIRMATION"))) {
            return;
        }

        dispatch(
            updateAction({
                actionId: action.id,
                updatePayload: {
                    ...action,
                    field_responsible_id: newValue?.id || null
                }
            })
        );

        dispatch(
            createEvent({
                action_id: action.id,
                type: newValue ? "field_responsible_assigned" : "field_responsible_unassigned",
                payload: {
                    field_responsible_id: newValue?.id,
                }
            })
        );
    }, [action, dispatch, t]);

    const handleResponsibleCFIChange = useCallback((newValue: MemberSchema | null) => {
        if (!action) {
            return;
        }

        if (!confirm(t("CHANGE_RESPONSIBLE_CFI_CONFIRMATION"))) {
            return;
        }

        dispatch(
            updateAction({
                actionId: action.id,
                updatePayload: {
                    ...action,
                    responsible_cfi_id: newValue?.id || null
                }
            })
        );

        dispatch(
            createEvent({
                action_id: action.id,
                type: newValue ? "responsible_cfi_assigned" : "responsible_cfi_unassigned",
                payload: {
                    responsible_cfi_id: newValue?.id,
                }
            })
        );
    }, [action, dispatch, t]);

    const handleDeactivateTowAirplane = useCallback((airplaneId: number) => {
        if (!action) {
            return;
        }

        const towAirplane = getTowAirplaneById(airplaneId);
        if (!towAirplane) {
            return;
        }

        if (!confirm(`${t("DEACTIVATE_TOW_AIRPLANE_CONFIRMATION")}: ${towAirplane.call_sign}`)) {
            return;
        }

        const activeTowAirplane = currentActionStoreState?.activeTowAirplanes?.find(
            (activeTowAirplane) => activeTowAirplane.airplane_id === airplaneId
        );

        if (!activeTowAirplane) {
            return;
        }

        dispatch(
            createEvent({
                action_id: action.id,
                type: "tow_airplane_deactivated",
                payload: {
                    tow_airplane_id: airplaneId,
                    tow_pilot_id: activeTowAirplane.tow_pilot_id,
                    field_responsible_id: action?.field_responsible_id,
                }
            })
        );

        dispatch(deleteActiveTowAirplane(activeTowAirplane.id));
    }, [action, currentActionStoreState, dispatch, t, getTowAirplaneById]);

    const handleActivateTowAirplane = useCallback((towPilotId: number) => {
        if (!action || !editedActiveTowAirplaneId) {
            return;
        }

        dispatch(
            createEvent({
                action_id: action.id,
                type: "tow_airplane_activated",
                payload: {
                    tow_airplane_id: editedActiveTowAirplaneId,
                    tow_pilot_id: towPilotId,
                    field_responsible_id: action?.field_responsible_id,
                }
            })
        );

        dispatch(
            addActiveTowAirplane({
                action_id: action.id,
                airplane_id: editedActiveTowAirplaneId,
                tow_pilot_id: towPilotId,
            })
        );

        setEditedActiveTowAirplaneId(null);
    }, [action, editedActiveTowAirplaneId, dispatch, setEditedActiveTowAirplaneId]);

    const getFieldResponsibleOptions = useCallback(() => {
        const initialOptions = membersStoreState.members || [];

        return initialOptions.filter(member => 
            isFieldResponsible(member, membersStoreState.membersRoles || []) &&
            ![
                ...activeTowPilotIds,
                action?.responsible_cfi_id
            ].includes(member.id)
        );
    }, [membersStoreState.members, membersStoreState.membersRoles, activeTowPilotIds, action?.responsible_cfi_id]);

    const getResponsibleCfiOptions = useCallback(() => {
        const initialOptions = membersStoreState.members || [];

        return initialOptions.filter(member => 
            isCfi(member, membersStoreState.membersRoles || []) &&
            ![
                ...activeTowPilotIds,
                action?.field_responsible_id
            ].includes(member.id)
        );
    }, [membersStoreState.members, membersStoreState.membersRoles, activeTowPilotIds, action?.field_responsible_id]);

    const displayTowPilotByAirplaneId = useCallback((id: number) => {
        const activeTowAirplane = currentActionStoreState?.activeTowAirplanes?.find(
            (active) => active.airplane_id === id
        );
        
        if (!activeTowAirplane) {
            return '';
        }

        const towPilot = getMemberById(activeTowAirplane.tow_pilot_id);
        return towPilot ? getMemberDisplayValue(towPilot) : '';
    }, [currentActionStoreState?.activeTowAirplanes, getMemberById]);

    return {
        action,
        membersStoreState,
        towAirplanesStoreState,
        currentActionStoreState,
        editedActiveTowAirplaneId,
        setEditedActiveTowAirplaneId,
        getMemberById,
        getTowAirplaneById,
        handleFieldResponsibleChange,
        handleResponsibleCFIChange,
        handleDeactivateTowAirplane,
        handleActivateTowAirplane,
        activeTowPilotIds,
        displayTowPilotByAirplaneId,
        getFieldResponsibleOptions,
        getResponsibleCfiOptions
    };
} 