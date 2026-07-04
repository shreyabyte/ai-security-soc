export interface RequestData {
    id: string;
    payload: any;
}

export interface ResponseData {
    status: string;
    data?: any;
    error?: string;
}