import {createContext} from "react";
import {ActionSchema} from "./lib/types.ts";

interface IActionContext {
    action: ActionSchema | null;
    setAction: (action: ActionSchema) => void;
}

export const ActionContext = createContext<IActionContext>({
    action: null,
    setAction: () => {},
})
