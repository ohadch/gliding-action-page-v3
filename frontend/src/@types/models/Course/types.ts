export interface ICourse {
    id: number;
    name: string;
}

export interface ICourseCreate {
    name: string;
}

export interface ICourseUpdate {
    name?: string;
}
