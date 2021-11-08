import { MessageDetail } from './message-detail';

export interface TransactionResult<TData> {
    _code: number;
    _message: string;
    _eventId: string;
    _data: TData;
    _success: boolean;
    _fail: boolean;
    _warning: boolean;
    _messageDetail: MessageDetail[];
}
