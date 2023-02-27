import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './Session';
import adminReducer from './Admin';

export default configureStore({
	reducer: {
		session: sessionReducer,
		admin: adminReducer,
	}
})
