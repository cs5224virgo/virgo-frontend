import {
    JoinRoomEventResp,
    BaseEventReq,
    UpdateUnreadEventReq,
    ResumeRoomEventReq,
    NewRoomEventResp,
    LeaveRoomEventResp,
    NewMessageEventResp,
    NewMessageEventReq,
 } from './../types';
import { Observable, ReplaySubject, defer, from } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { delay, filter, map, retryWhen, switchMap, tap } from 'rxjs/operators';
import chatHttp from './Http';

export class WebSocketService {
    private wsSubject?: WebSocketSubject<any>;
    private wrapperSubject: ReplaySubject<any> = new ReplaySubject(100, 1000);

    public onJoinRoom: Observable<JoinRoomEventResp> = this.wrapperSubject.pipe(
        filter(e => e.eventType === "resp-join-room"),
        map(e => e.data as JoinRoomEventResp),
    );

    public onNewRoom: Observable<NewRoomEventResp> = this.wrapperSubject.pipe(
        filter(e => e.eventType === "resp-new-room"),
        map(e => e.data as NewRoomEventResp),
    );

    public onLeaveRoom: Observable<LeaveRoomEventResp> = this.wrapperSubject.pipe(
        filter(e => e.eventType === "resp-leave-room"),
        map(e => e.data as LeaveRoomEventResp),
    );

    public onNewMessage: Observable<NewMessageEventResp> = this.wrapperSubject.pipe(
        filter(e => e.eventType === "resp-new-message"),
        map(e => e.data as NewMessageEventResp),
    );

	// public init2(): WebSocketService {
    //     const tokenPromise = chatHttp.getWsToken().then(({ wsToken }) => wsToken);
    //     from(tokenPromise).pipe(
    //         switchMap(token => {
    //             this.wsSubject = webSocket(`${process.env.REACT_APP_WEBSOCKET_SERVER_URL}?token=${token}`);
    //             console.log("websocket returned");
    //             return this.wsSubject
    //         })
    //     ).subscribe(msg => { console.log('Received message:', msg); });
    //     return this
	// }

    public init(): void {
        const tokenStream = defer(() => from(chatHttp.getWsToken()));

        tokenStream.pipe(
            switchMap(({ wsToken }) => {
                // Creating the WebSocket connection with the token
                const url = process.env.REACT_APP_WEBSOCKET_SERVER_URL ? `${process.env.REACT_APP_WEBSOCKET_SERVER_URL}?token=${wsToken}` : `${window.location.origin}:30001?token=${wsToken}`;
                this.wsSubject = webSocket(url);
                return this.wsSubject;
            }),
            retryWhen(errors =>
                errors.pipe(
                    // Optionally you can log the error or handle specific types of errors here
                    tap(error => console.error('WebSocket connection failed, retrying...', error)),
                    // Delay before retrying connection
                    delay(1000),
                )
            )
        ).subscribe({
            next: msg => { 
                console.log('Received message:', msg); 
                this.wrapperSubject.next(msg); 
            },
            error: err => { 
                console.error('WebSocket error:', err); 
                this.wrapperSubject.error(err); 
            },
            complete: () => { 
                console.log('WebSocket connection closed'); 
                this.wrapperSubject.complete(); 
            },
        });
        // this.wsSubject = webSocket(`${process.env.REACT_APP_WEBSOCKET_SERVER_URL}?token=${wsToken}`);
        // this.wsSubject.pipe(
        //     retry(-1)
        // ).subscribe({
        //     next: msg => { 
        //         console.log('Received message:', msg); 
        //         this.wrapperSubject.next(msg); 
        //     },
        //     error: err => { 
        //         console.error('WebSocket error:', err); 
        //         this.wrapperSubject.error(err); 
        //     },
        //     complete: () => { 
        //         console.log('WebSocket connection closed'); 
        //         this.wrapperSubject.complete(); 
        //     },
        // });
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

    public resume(data: ResumeRoomEventReq): void {
        console.log("sending event resume room");
        const req: BaseEventReq = {
            eventType: "req-resume-room",
            data: data,
        };
        this.wsSubject?.next(req);
    }

    public updateUnread(data: UpdateUnreadEventReq): void {
        const req: BaseEventReq = {
            eventType: "req-update-unread",
            data: data,
        };
        this.wsSubject?.next(req);
    }

    public send(data: NewMessageEventReq): void {
        const req: BaseEventReq = {
            eventType: "req-new-message",
            data: data,
        };
        this.wsSubject?.next(req);
    }
}
