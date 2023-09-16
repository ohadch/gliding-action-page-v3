import {ModelApi} from "./modelApi.service.ts";
import {IMember, IMemberCreate, IMemberUpdate} from "../../@types";

class MembersApiService extends ModelApi<IMember, IMemberCreate, IMemberUpdate> {
    constructor() {
        super("/members");
    }
}

export const membersApiService = new MembersApiService();
