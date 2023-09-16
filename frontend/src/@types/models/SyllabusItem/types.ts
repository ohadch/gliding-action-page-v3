export interface ISyllabusItem {
    id: number;
    name: string;
    syllabus_id: number;
}

export interface ISyllabusItemCreate {
    name: string;
    syllabus_id: number;
}

export interface ISyllabusItemUpdate {
    name: string;
    syllabus_id: number;
}
