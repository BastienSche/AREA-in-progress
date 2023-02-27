import { createSlice } from '@reduxjs/toolkit';

export const adminSlice = createSlice({
	name: 'admin',
	initialState: {
		user: null,
	},
	reducers: {
		setUser: (state, action) => {
            state.user = action.payload;
		},
	},
})

export const { setUser } = adminSlice.actions;

export default adminSlice.reducer;
