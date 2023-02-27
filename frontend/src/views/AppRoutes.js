import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';

import ClientSockets from "../components/ClientSocket";

import AuthView from "./auth/AuthView";
import LoginView from "./auth/LoginView";
import RegisterView from "./auth/RegisterView";
import ResetPasswordView from "./auth/ResetPasswordView";
import SpotifyView from "./auth/SpotifyView"

import ProfileView from "./users/ProfileView";

import DashbordView from "./dashboard/DashboardView";

const ProtectedRoute = ({ requireAuth, requireAdmin = false, redirectPath = '/auth' }) => {
    const connected = useSelector(state => state.session.isConnected);
    const userData = useSelector(state => state.session.userData);
    
    if (!(connected === requireAuth)) {
        console.log("YOU ARE NOT CONNECTED");
        // return <Navigate to={ redirectPath } replace />;  // Redirect si non connecté
    }

    return (<>
        { connected && <ClientSockets/>}
        { requireAdmin && userData && userData.role !== "ADMIN" && <Navigate to={ redirectPath } replace /> }
        <Outlet/>
    </>)
};

const AppRoutes = () => {
    const userData = useSelector(state => state.session.userData);

    return (
        <Routes>
            {/* Unauthenticated  */}
                <Route element={<ProtectedRoute requireAuth={ false } redirectPath={'/dashboard'}/>}>
                    <Route path="/auth" element={<AuthView/>}/>
                    <Route path="/auth/login/:authType" element={<LoginView/>}/>
                    {/* <Route path="/auth/login/:authType/spotify" element={<SpotifyView/>}/> */}
                    {/* <Route path="/auth/hidden/login" element={<LoginView admin={ true }/>}/> */}
                    <Route path="/auth/register" element={<RegisterView/>}/>
                    <Route path="/auth/reset" element={<ResetPasswordView/>}/>
                </Route>

            {/* Authenticated */}
                <Route element={<ProtectedRoute requireAuth={ true }/>}>
                    <Route path="/dashboard" element={<DashbordView />}/>                    
                    
                    <Route path="/profile" element={<ProfileView user={userData}/>}/>
                </Route>

            {/* Authenticate & Admin */}
                <Route element={<ProtectedRoute requireAuth={ true } requireAdmin={ true } redirectPath={'/companies/grid'}/>}>
                    <Route path="/users/:userId" element={<ProfileView />}/>
                </Route>

            {/* Not Protected */}

            {/* Error Handler */}
                <Route path="*" element={<Navigate to={'/auth'} replace />}/>
        </Routes>
    )
}

export default AppRoutes;