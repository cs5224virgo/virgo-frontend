import {
	CredAvailabilityData,
	RegisterData,
	LoginData,
	LoginStatusData,
	NewRoomData,
	RoomData,
	CredAvailabilityResp,
	BaseResponse,
	LoginResp,
	UserResp,
	RoomResp,
	RoomsResp,
	MessagesResp,
	WsTokenResp,
	AddUserData,
	SummarizeData,
	SummaryResp,
} from './../types';
import axios from './Axios';

const checkAvailability = async (data: CredAvailabilityData) => {
	return new Promise<CredAvailabilityResp>(async (resolve, reject) => {
		try {
			const response = await axios.post('/users/checkAvailability', data);
			resolve(response.data);
		} catch (error) {
			reject(error);
		}
	});
};

const register = async (data: RegisterData) => {
	return new Promise<BaseResponse>(async (resolve, reject) => {
		try {
			const response = await axios.post('/users/register', data);
			resolve(response.data);
		} catch (error) {
			reject(error);
		}
	});
};

const login = async (data: LoginData) => {
	return new Promise<LoginResp>(async (resolve, reject) => {
		try {
			const response = await axios.post('/users/login', data);
			resolve(response.data);
		} catch (error) {
			reject(error);
		}
	});
};

const getWsToken = async () => {
	return new Promise<WsTokenResp>(async (resolve, reject) => {
		try {
			const response = await axios.get('/users/wstoken');
			resolve(response.data);
		} catch (error) {
			reject(error);
		}
	});
};

const changeLoginStatus = async (data: LoginStatusData) => {
	return new Promise<UserResp>(async (resolve, reject) => {
		try {
			const response = await axios.post('/users/changeStatus', data);
			resolve(response.data);
		} catch (error) {
			reject(error);
		}
	});
};

const createRoom = async (data: NewRoomData) => {
	return new Promise<RoomResp>(async (resolve, reject) => {
		try {
			const response = await axios.post('/rooms/new', data);
			resolve(response.data);
		} catch (error) {
			reject(error);
		}
	});
};

const addUser = async (data: AddUserData) => {
	return new Promise<RoomResp>(async (resolve, reject) => {
		try {
			const response = await axios.post('/rooms/adduser', data);
			resolve(response.data);
		} catch (error) {
			reject(error);
		}
	});
};

const joinRoom = async (data: RoomData) => {
	return new Promise<RoomResp>(async (resolve, reject) => {
		try {
			const response = await axios.post('/rooms/join', data);
			resolve(response.data);
		} catch (error) {
			reject(error);
		}
	});
};

const leaveRoom = async (data: RoomData) => {
	return new Promise<BaseResponse>(async (resolve, reject) => {
		try {
			const response = await axios.post('/rooms/leave', data);
			resolve(response.data);
		} catch (error) {
			reject(error);
		}
	});
};

const getRooms = async () => {
	return new Promise<RoomsResp>(async (resolve, reject) => {
		try {
			const response = await axios.get('/rooms/');
			resolve(response.data);
		} catch (error) {
			reject(error);
		}
	});
};

const deleteRoom = async (data: RoomData) => {
	return new Promise<BaseResponse>(async (resolve, reject) => {
		try {
			const response = await axios.post('/rooms/delete', data);
			resolve(response.data);
		} catch (error) {
			reject(error);
		}
	});
};

const getMessages = async (data: RoomData) => {
	return new Promise<MessagesResp>(async (resolve, reject) => {
		try {
			const response = await axios.post('/messages', data);
			resolve(response.data);
		} catch (error) {
			reject(error);
		}
	});
};

const getSummary = async (data: SummarizeData) => {
	return new Promise<SummaryResp>(async (resolve, reject) => {
		try {
			const response = await axios.post('/summary', data);
			resolve(response.data);
		} catch (error) {
			reject(error);
		}
	});
};

const chatHttp = {
	checkAvailability,
	changeLoginStatus,
	register,
	login,
	getWsToken,
	createRoom,
	addUser,
	joinRoom,
	leaveRoom,
	getRooms,
	getMessages,
	deleteRoom,
	getSummary,
};

export default chatHttp;
