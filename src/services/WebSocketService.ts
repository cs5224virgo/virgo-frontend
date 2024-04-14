import { JoinRoomEventReq,
    JoinRoomEventResp,
    BaseEventResp,
    BaseEventReq,
    UpdateUnreadEventReq,
 } from './../types';
import { ChatEvent } from '../constants';
import { fromEvent, Observable } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { filter, map } from 'rxjs/operators';

export class WebSocketService {
	private socket: WebSocketSubject<any> = {} as WebSocketSubject<any>;

	public init(): WebSocketService {
		console.log('Initializing Socket Service');
        // this.socket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_SERVER_URL}`)
        this.socket = webSocket(`${process.env.REACT_APP_WEBSOCKET_SERVER_URL}`);
		return this;
	}

    public join(data: JoinRoomEventReq): void {
        const req: BaseEventReq = {
            eventType: "join-room",
            data: data,
        };
        this.socket.next(req);
	}

    public updateUnread(data: UpdateUnreadEventReq): void {
        const req: BaseEventReq = {
            eventType: "update-unread",
            data: data,
        };
        this.socket.next(req);
	}

    public onJoinRoom(): Observable<JoinRoomEventResp> {
		// return fromEvent(this.socket, ChatEvent.JOIN);
        return this.socket.pipe<BaseEventResp, JoinRoomEventResp>(
            filter(e => e.type === "join-room"), 
            map<BaseEventResp, JoinRoomEventResp>(e => e.data as JoinRoomEventResp))
	}
}
