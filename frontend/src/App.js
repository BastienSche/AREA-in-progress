import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider, /* useDispatch, */ useSelector } from 'react-redux';

import AppRoutes from './views/AppRoutes';
// import { isConnected } from './redux/Session';
// import { setError } from './redux/Session';
import { SocketContext } from "./helpers/Socket";
import store from './redux/ReduxStore';

import "./assets/styles/css/base.css";
import "./assets/styles/sass/theme.scss";

const AppRouter = () => {
	// const dispatch = useDispatch();
	
	// const showError = useSelector(state => state.session.error);
	// const errorMessage = useSelector(state => state.session.errorMessage);
	const connected = useSelector(state => state.session.isConnected);

	const [connValue, setConnValue] = useState(null);
	const [clientSocket, setClientSocket] = useState(null);

	useEffect(() => {
	// 	dispatch(isConnected());
		setConnValue(connected);
	}, [connected])

	if (connValue == null)
		return;

	return (
		<div className="main-container">
			<SocketContext.Provider value={{ clientSocket, setClientSocket }}>
				<Router>
					<AppRoutes />
				</Router>
			</SocketContext.Provider>
		</div>
  );
}

const App = () => {

	return (
		<Provider store={ store }>
			<AppRouter/>
		</Provider>
	)
}

export default App;