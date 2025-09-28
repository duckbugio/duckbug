export class HttpError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.name = 'HttpError';
    }
}

export const mapHttpError = (response: Response): HttpError => {
    const status = response.status;
    let message = `HTTP error ${status}`;
    if (status === 401) {
        message = 'Unauthorized';
    } else if (status === 403) {
        message = 'Forbidden';
    } else if (status === 404) {
        message = 'Not found';
    } else if (status >= 500) {
        message = 'Server error';
    }

    return new HttpError(status, message);
};
