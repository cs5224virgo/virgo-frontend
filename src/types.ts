export interface User {
	username: string;
	displayName?: string;
}

export interface MessagePopulated {
	content: string;
	status?: string;
	isSystem?: boolean;
	user: User;
	roomCode: string;
	createdAt: string;
}

export interface RoomUserPopulated {
	user: User;
	unread: number;
}

export interface RoomPopulated {
	name: string;
	code: string;
	description: string;
	lastActivity?: Date;
	lastMessagePreview?: string;
	users: Array<RoomUserPopulated>;
	createdAt: string;
}

export interface UserRoom {
	name: string;
	room: string;
}

export interface ChatMessage {
	userRoom: UserRoom;
	content: string;
	status?: string;
	isSystem?: boolean;
}

export interface CredAvailabilityData {
	username: string;
}
export interface LoginData {
	username: string;
	password: string;
}
export interface RegisterData extends LoginData {
	displayName: string;
}
export interface LoginStatusData {
	newValue: boolean;
}
export interface NewRoomData {
	name: string;
	description: string;
}
export interface RoomData {
	roomCode: string;
}

export interface BaseResponse {
	success: boolean;
}
export interface CredAvailabilityResp extends BaseResponse {
	isAvailable: boolean;
}
export interface LoginResp extends BaseResponse {
	authorization: string;
	data: {
		userDetails: User;
	};
}
export interface WsTokenResp extends BaseResponse {
	wsToken: string;
}
export interface UserResp extends BaseResponse {
	user: User;
}
export interface RoomResp extends BaseResponse {
	data: {
		room: RoomPopulated;
	};
}
export interface RoomsResp extends BaseResponse {
	data: {
		rooms: RoomPopulated[];
	};
}
export interface RoomEventResp {
	userDetails: User;
}
export interface JoinEventResp extends RoomEventResp {
	joinedRoom: string;
}
export interface LeaveEventResp extends RoomEventResp {
	leftRoom: string;
}
export interface MessageEventResp {
	newMsg: MessagePopulated;
	updatedRoom: RoomPopulated;
}
export interface MessagesResp extends BaseResponse {
	data: {
		messages: MessagePopulated[];
	};
}

export type EventType = "message" | "join-room" | "update-unread"
export type MessageType = "normal" | "system" | "summary"

export interface BaseEventResp {
	eventType: EventType;
	data: JoinRoomEventResp | MessageEventResp;
}
export interface JoinRoomEventResp {
	roomCode: string;	
}
// export interface MessageEventResp {
// 	message: {
// 		type: MessageType;
// 		content: string;
// 	};
// 	room: {
// 		roomCode: string;
// 	}
// }

export interface BaseEventReq {
	eventType: EventType	;
	data: JoinRoomEventReq | MessageEventReq | UpdateUnreadEventReq;
}
export interface JoinRoomEventReq {
	username: string;
	roomCode: string;
}
export interface UpdateUnreadEventReq {
	username: string;
	roomCode: string;
	unread: number;
}
export interface MessageEventReq {
	message: {
		content: string;
	};
	room: {
		roomCode: string;
	}
}