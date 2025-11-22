export interface Project {
    id: string;
    name: string;
    technologyId: number;
    openErrors?: number;
    logsLast24h?: number;
}
