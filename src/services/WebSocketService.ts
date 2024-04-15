import { JoinRoomEventReq,
    JoinRoomEventResp,
    BaseEventResp,
    BaseEventReq,
    UpdateUnreadEventReq,
 } from './../types';
import { ChatEvent } from '../constants';
import { Observable, from } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import chatHttp from './Http';

export class WebSocketService {
    private wsSubject?: WebSocketSubject<any>;

	public init(): WebSocketService {
        const tokenPromise = chatHttp.getWsToken().then(({ wsToken }) => wsToken);
        from(tokenPromise).pipe(
            switchMap(token => {
                this.wsSubject = webSocket(`${process.env.REACT_APP_WEBSOCKET_SERVER_URL}?token=${token}`);
                return this.wsSubject
            })
        );
        return this
	}

    // getWebSocketSubject(): Observable<WebSocketSubject<any>> {
    //     if (!this.wsSubject) {
    //         const tokenPromise = chatHttp.getWsToken().then(({ wsToken }) => wsToken);
    //         return from(tokenPromise).pipe(
    //             switchMap(token => {
    //                 this.wsSubject = webSocket(`${process.env.REACT_APP_WEBSOCKET_SERVER_URL}?token=${token}`);
    //                 return this.wsSubject;
    //             })
    //         );
    //     }

    //     return this.wsSubject;
    //     // return from([this.wsSubject]);
    // }

    public join(data: JoinRoomEventReq): void {
        const req: BaseEventReq = {
            eventType: "join-room",
            data: data,
        };
        this.wsSubject?.next(req);
    }

    public updateUnread(data: UpdateUnreadEventReq): void {
        const req: BaseEventReq = {
            eventType: "update-unread",
            data: data,
        };
        this.wsSubject?.next(req);
    }

    public onJoinRoom(): Observable<JoinRoomEventResp> | undefined {
        // return fromEvent(this.socket, ChatEvent.JOIN);
        return this.wsSubject?.pipe<BaseEventResp, JoinRoomEventResp>(
            filter(e => e.type === "join-room"), 
            map<BaseEventResp, JoinRoomEventResp>(e => e.data as JoinRoomEventResp))
    }
}

// export class WebSocketService {
// 	private socket: WebSocketSubject<any> = {} as WebSocketSubject<any>;

// 	public init(wsToken: string): WebSocketService {
//         console.log('Initializing Socket Service');
//         this.socket = webSocket(`${process.env.REACT_APP_WEBSOCKET_SERVER_URL}?token=${wsToken}`);
// 		return this;
// 	}

//     public join(data: JoinRoomEventReq): void {
//         const req: BaseEventReq = {
//             eventType: "join-room",
//             data: data,
//         };
//         this.socket.next(req);
// 	}

//     public updateUnread(data: UpdateUnreadEventReq): void {
//         const req: BaseEventReq = {
//             eventType: "update-unread",
//             data: data,
//         };
//         this.socket.next(req);
// 	}

//     public onJoinRoom(): Observable<JoinRoomEventResp> {
// 		// return fromEvent(this.socket, ChatEvent.JOIN);
//         return this.socket.pipe<BaseEventResp, JoinRoomEventResp>(
//             filter(e => e.type === "join-room"), 
//             map<BaseEventResp, JoinRoomEventResp>(e => e.data as JoinRoomEventResp))
// 	}
// }
