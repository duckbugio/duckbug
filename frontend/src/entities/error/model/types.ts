export interface Err {
    id: string;
    message: string;
    file: string;
    line: number;
    stacktrace?: Array<unknown>;
    context?: Record<string, unknown> | Array<unknown>;
    ip?: string | null;
    url?: string | null;
    method?: string | null;
    headers?: Record<string, unknown> | null;
    queryParams?: Record<string, unknown> | null;
    bodyParams?: Record<string, unknown> | null;
    cookies?: Record<string, unknown> | null;
    session?: Record<string, unknown> | null;
    files?: Record<string, unknown> | null;
    env?: Record<string, unknown> | null;
    time: number;
}

export type ErrorGroupStatus = 'unresolved' | 'resolved' | 'ignored';

export interface ErrGroup {
    id: string;
    message: string;
    file: string;
    line: number;
    firstSeenAt: number;
    lastSeenAt: number;
    counter: number;
    status: ErrorGroupStatus;
}
