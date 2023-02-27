import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SpotifyView = () => {

    const navigate = useNavigate();

    return (
        
    <div className="auth-container view background-img"> 
        <div className="auth-card">
            <h2>SPOTIFY</h2>
            
            <div className="divider vertical"></div>
        </div>
    </div>

    );
}
 
export default SpotifyView;