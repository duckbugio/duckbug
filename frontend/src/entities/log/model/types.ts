export interface Log {
    id: string;
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
    message: string;
    context?: Record<string, unknown> | Array<unknown> | string | null;
    time: number;
}

export interface LogGroup {
    id: string;
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
    message: string;
    firstSeenAt: number;
    lastSeenAt: number;
    counter: number;
}
