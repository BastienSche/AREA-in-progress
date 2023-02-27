import { useNavigate } from 'react-router-dom';
import {
    FacebookLogo,
    GithubLogo,
    GoogleLogo,
    InstagramLogo,
    LinkedinLogo,
    SpotifyLogo
} from '../../assets/icons/logos/OrangeLogosExport';

const DashboardView = () => {

    const navigate = useNavigate();

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

    return (
        <div className="view background-img">
        {/* <div className="view"> */}
            <div className="dashboard-container">
                <div className="dashboard-top-banner">
                    <h2 className="" >Dashboard</h2>
                </div>
                <div className="dashboard-services-container">
                    <div className="services-top">
                        <h3>Mes services</h3>
                    </div>
                    <div className="services-bottom">
                        <div className="services-login">
                            { oauthButtons?.map((btn) => (
                                <div className="btn-cont">
                                    <button key={ "key-" + btn?.id } className="login oauth" onClick={() => navigate('/auth/login/identify')}>
                                        <img alt={ `${ btn?.name } logo` } src={ btn?.logo } className="logo"/>
                                        <p>{ btn?.name }</p>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}
 
export default DashboardView;