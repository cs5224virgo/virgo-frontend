import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './style.css';
import Room from '../Room';
import SignUp from '../Signup';
import Login from '../Login';
import NotFound from '../NotFound';
import { SocketService } from '../../services/SocketService';
import { USER_INITIAL_VALUE } from '../../constants';
import { UserContext } from '../../context/UserContext';
import { ChatContext } from '../../context/ChatContext';
import { StylesProvider } from '@material-ui/core/styles';
import { WsChatContext } from '../../context/WsChatContext';
import { WebSocketService } from '../../services/WebSocketService';

const routes = [
	{ path: '/signup', component: SignUp },
	{ path: '/login', component: Login },
	{ path: '/room', component: Room },
	{ path: '/', component: Login }
];

// const chat = new SocketService();
const wsChat = new WebSocketService();

function App() {
	const userJSON = localStorage.getItem('chat-app-user');
	const [ userDetails, setUserDetails ] = useState(userJSON !== null ? JSON.parse(userJSON) : USER_INITIAL_VALUE);

	return (
		<StylesProvider injectFirst>
			<UserContext.Provider value={{ userDetails, setUserDetails }}>
				{/* <ChatContext.Provider value={chat}> */}
					<WsChatContext.Provider value={wsChat}>
					<div className="app">
						<Router>
							<Switch>
								{routes.map(({ path, component }) => <Route key={path} path={path} component={component} exact />)}
								<Route component={NotFound} />
							</Switch>
						</Router>
					</div>
					</WsChatContext.Provider>
				{/* </ChatContext.Provider> */}
			</UserContext.Provider>
		</StylesProvider>
	);
}

export default App;
