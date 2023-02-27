import { useDispatch, useStore } from 'react-redux';
import { useEffect, useContext } from 'react';

import UserAPI, { PublicUser } from '../helpers/api/UserAPI';
import { isConnected, setErrorMessage, setSession, setUserData, updateUserData } from '../redux/Session';
import { connectSocket, SocketContext } from '../helpers/Socket'


const ClientSocket = () => {
    var {clientSocket, setClientSocket} = useContext(SocketContext);
    const socketEvents = new Map();
    const dispatch = useDispatch();
    const reduxStore = useStore();

    socketEvents.set('expired_auth_token', async(data, store) => {
        try {
            console.log("expired_auth_token: Your token is missing or expired");
            dispatch(setErrorMessage('Your token is expired'));
            clientSocket.disconnect();
            
            const newSession = await UserAPI.refreshToken(store.session.value.refreshToken);
            clientSocket.auth.token = newSession.accessToken;
            
            dispatch(setSession(newSession.toJSON()));
            clientSocket.connect();
            clientSocket.emit('authenticate');
        } catch(err) {
            console.log("expired_auth_token Error:", err);
            socketEvents.get('remove_session')(data, store);
        }
    });

    socketEvents.set('remove_session', (data, store) => {
        try {
            dispatch(setSession(null));
            dispatch(isConnected());
            document.location.reload();
        } catch(err) {
            console.log("remove_session Error:", err.message);
        }
    });

    socketEvents.set('error_handler', (data, store) => {
        dispatch(setErrorMessage(data.message));
    });

    socketEvents.set('set_user_data', (data, store) => {
        try {
            dispatch(setUserData(new PublicUser(data).toJSON()));
        } catch(err) {
            console.log("set_user_data Error:", err.message);
        }
    });

    socketEvents.set('update_data', (data, store) => {
        try {
            var element = null;
            var fcReducer = () => {};

            if (data.type === 'user') {
                element = new PublicUser(store.session.userData);
                fcReducer = updateUserData;
            } else
                throw Error('Invalid update type');

            data.fields.forEach(field => {
                element[`${field.name}`] = field.value;
            })
            return dispatch(fcReducer(element.toJSON()));
        } catch(err) {
            console.log("update_data Error:", err.message, data);
        }
    });

    // eslint-disable-next-line
    useEffect(() => setClientSocket(connectSocket()), [])

    useEffect(() => {
        if (!clientSocket)
            return;
        clientSocket.emit("authenticate");
        clientSocket.onAny((eventName, data) => {
            console.log(`[EVENT] [${new Date().toLocaleString(navigator.language,  {hour: '2-digit', minute:'2-digit', second:'2-digit'})}] ${eventName.toUpperCase()}`, data)
            socketEvents.get(eventName)(data, reduxStore.getState());
        });
        return () => clientSocket.offAny();
    // eslint-disable-next-line
    }, [clientSocket]);
}

export default ClientSocket;
