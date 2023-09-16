export interface ISyllabus {
    id: number;
    name: string;
}

export interface ISyllabusCreate {
    name: string;
}

export interface ISyllabusUpdate {
    name?: string;
}
