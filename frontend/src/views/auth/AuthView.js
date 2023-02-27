import { useNavigate } from "react-router";

const AuthView = () => {

    const navigate = useNavigate();

    return (
        
    <div className="auth-container view background-img"> 
        <div className="auth-card">
            <h2>AREA</h2>
            <div className="buttons-div auth-div">
                <div className="btn-cont">
                    <button className="login" onClick={() => navigate('/auth/login/auth')}>
                        <p>CONNEXION</p>
                    </button>
                </div>
                <div className="btn-cont">
                    <button className="login" onClick={() => navigate('/auth/login/oauth')}>
                        <p>PAGE D'OAUTH</p>
                    </button>
                </div>
                <div className="btn-cont">
                    <button className="register" onClick={() => navigate('/auth/register')}>
                        <p>INSCRIPTION</p>
                    </button>
                </div>
            </div>
            <div className="divider vertical"></div>
        </div>
    </div>

    );
}
 
export default AuthView;