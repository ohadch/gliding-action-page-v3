import {ModelApi} from "./modelApi.service.ts";
import {ISyllabusItem, ISyllabusItemCreate, ISyllabusItemUpdate} from "../../@types/models/SyllabusItem";

export class SyllabusItemsApiService extends ModelApi<ISyllabusItem, ISyllabusItemCreate, ISyllabusItemUpdate> {
    constructor(syllabusId: number) {
        super(`/syllabuses/${syllabusId}/items`);
    }
}
