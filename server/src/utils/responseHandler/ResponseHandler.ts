export class ResponseHandler {
    public handle(response: any, result: any, returnSuccess: boolean = true): any {
        if (result.errcode) {
            return response.status(500).send(result);
        } else if (returnSuccess && !result.success) {
            return response.status(400).send(result);
        } else {
            return response.status(200).send(result);
        }
    }
}
export interface IResponseMessage {
    success: boolean;
    status: string;
    message: string;
    sessionID?: string;
    data?: any;
    errcode?: string;
}