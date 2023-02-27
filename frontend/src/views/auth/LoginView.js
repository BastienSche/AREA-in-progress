import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Input from "../../components/inputs/Input";

import {
    FacebookLogo,
    GithubLogo,
    GoogleLogo,
    InstagramLogo,
    LinkedinLogo,
    SpotifyLogo
} from '../../assets/icons/logos/OrangeLogosExport';

const oauthButtons = [
    {
        id: 1,
        logo: FacebookLogo,
        name: "Facebook",
    },
    {
        id: 2,
        logo: GithubLogo,
        name: "GitHub",
    },
    {
        id: 3,
        logo: GoogleLogo,
        name: "Google",
    },
    {
        id: 4,
        logo: InstagramLogo,
        name: "Instagram",
    },
    {
        id: 5,
        logo: LinkedinLogo,
        name: "LinkedIn",
    },
    {
        id: 6,
        logo: SpotifyLogo,
        name: "Spotify",
    },
]

const LoginView = () => {
    
    const navigate = useNavigate();
    const { authType } = useParams();

    useEffect(() => {
        if (!["oauth", "auth"].includes(authType)) {
            navigate("/auth/login");
        }
    // eslint-disable-next-line
    }, [])
    
    return (
        <div className="auth-container view background-img"> 

            { authType && authType === "oauth" && <div className="auth-card oauth-card">
                <div className="buttons-div">
                    <h3>Connectez-vous via ces services</h3>
                    { oauthButtons?.map((btn) => (
                        <div className="btn-cont">
                            <button key={ "key-" + btn?.id } className="login oauth" onClick={() => navigate('/auth/login/oauth/spotify')}>
                                <img alt={ `${ btn?.name } logo` } src={ btn?.logo } className="logo"/>
                                <p>{ btn?.name }</p>
                            </button>
                        </div>
                    ))}
                    <a className="login-redirect" href="/auth/login/auth">
                        <p>Se connecter avec son compte</p>
                        <div className="underline-effect">
                            <div className="underline-div-hidden" />
                            <div className="underline-div" />
                        </div>
                    </a>
                </div>
                <div className="divider vertical" />
            </div> }

            { authType && authType === "auth" && <div className="auth-card oauth-card">
                <div className="login-div">
                    <h3>Connectez-vous avec votre compte</h3>
                    <form className="login-form">
                        <Input
                            inputs={[
                                {
                                    id: 1,
                                    type: 'text',
                                    gridSize: 8, 
                                    initialValue: '', 
                                    labelValue: 'Adresse mail',
                                    labelInline: false
                                },
                                {
                                    id: 2,
                                    type: 'password',
                                    gridSize: 8, 
                                    initialValue: '', 
                                    labelValue: 'Mot de passe',
                                    labelInline: false
                                }
                            ]}
                            justifyContent="flex-center"
                            alignItems="flex-start"
                        />
                        <div className="btn-cont margin-50">
                            <button className="login" onClick={() => navigate('/auth/login/auth')}>
                                <p>CONNEXION</p>
                            </button>
                        </div>
                        {/* <CustomButton></CustomButton> */}
                    </form>
                    <div className="login-redirect-div">
                        <a className="login-redirect" href="/auth/login/oauth">
                            <p>Se connecter en oauth</p>
                            <div className="underline-effect">
                                <div className="underline-div-hidden" />
                                <div className="underline-div" />
                            </div>
                        </a>
                        <a className="login-redirect" href="/auth/register">
                            <p>Pas encore inscrit ?</p>
                            <div className="underline-effect">
                                <div className="underline-div-hidden" />
                                <div className="underline-div" />
                            </div>
                        </a>
                    </div>
                </div>
                <div className="divider vertical" />
            </div> }

        </div>
    );
}
 
export default LoginView;