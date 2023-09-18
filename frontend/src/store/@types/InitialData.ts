import {ActionSchema} from "../../lib/types.ts";

export interface BaseInitialState {
    fetchInProgress: boolean;
    error?: string;
}


export interface ActionsStoreState extends BaseInitialState {
    currentAction?: ActionSchema;
    actions: ActionSchema[] | undefined;
    initialWorkspaceStore: boolean;
}
