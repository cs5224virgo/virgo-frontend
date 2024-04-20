export interface User {
	username: string;
	displayName?: string;
}

export interface MessagePopulated {
	content: string;
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
export interface AddUserData {
	username: string;
	roomCode: string;
}
export interface SummarizeData {
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
export interface SummaryResp extends BaseResponse {
	data: {
		summary: string;
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

export type EventTypeResp = "resp-new-message" | "resp-new-room" | "resp-join-room" | "resp-update-unread" | "resp-leave-room"
export type MessageType = "normal" | "system" | "summary"

export interface BaseEventResp {
	eventType: EventTypeResp;
	data: ResumeRoomEventResp | JoinRoomEventResp | NewRoomEventResp | LeaveRoomEventResp | NewMessageEventResp;
}
export interface ResumeRoomEventResp {
	roomCode: string;
}
export interface JoinRoomEventResp {
	user: User;
	roomCode: string;	
}
export interface NewRoomEventResp {
	room: RoomPopulated;
}
export interface LeaveRoomEventResp {
	user: User;
	roomCode: string;
}
export interface NewMessageEventResp {
	message: MessagePopulated;
	room: RoomPopulated;
}

export type EventTypeReq = "req-message" | "req-resume-room" | "req-update-unread" | "req-new-message"

export interface BaseEventReq {
	eventType: EventTypeReq;
	data: ResumeRoomEventReq | NewMessageEventReq | UpdateUnreadEventReq;
}
export interface ResumeRoomEventReq {
	username: string;
	roomCode: string;
}
export interface UpdateUnreadEventReq {
	username: string;
	roomCode: string;
	unread: number;
}
export interface NewMessageEventReq {
	content: string;
	username: string;
	roomCode: string;
}