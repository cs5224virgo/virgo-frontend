import axios from 'axios';

const instance = axios.create({
	baseURL: `${process.env.REACT_APP_SERVER_URL}/v1`
});

instance.interceptors.request.use((req) => {
	console.log(`${req.method} ${req.url}`);
	if (req.url !== '/register' && req.url !== '/login') {
		req.headers = { ...req.headers, Authorization: `Bearer ${localStorage.getItem('chat-app-auth')}` };
	}
	return req;
});

export default instance;
