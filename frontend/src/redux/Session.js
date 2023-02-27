import { createSlice } from '@reduxjs/toolkit';
import { setSessionCookie, getSessionCookie, removeSession } from '../helpers/Cookie';

export const sessionSlice = createSlice({
	name: 'session',
	initialState: {
		value: getSessionCookie(),
		isConnected: false,
		userData: null,
		error: false
	},
	reducers: {
		setSession: (state, action) => {
			state.value = action.payload;
			setSessionCookie(state.value);
			if (!state.value)
				return removeSession();
		},

		isConnected: (state) => {
			state.isConnected = state.value && state.value.accessToken && state.value.refreshToken && state.value._id ? true: false;
		},

		setUserData: (state, action) => {
			state.userData = action.payload;
		},

		updateUserData: (state, action) => {
			state.userData = {
				...state.userData,
				...action.payload
			}
		},

		setError: (state, action) => {
			state.error = action.payload;
		},

		setErrorMessage: (state, action) => {
			console.log("ERROR MESSAGE", action.payload)
			state.error = true;
			state.errorMessage = action.payload;
		}

	},
})

export const { setSession, setUserData, isConnected, updateUserData, setError, setErrorMessage } = sessionSlice.actions;

export default sessionSlice.reducer;