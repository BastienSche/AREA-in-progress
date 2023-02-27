// import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../components/inputs/Input";

const RegisterView = () => {
    
    const navigate = useNavigate();

    // useEffect(() => {
       
    // // eslint-disable-next-line  
    // }, [])
    
    return (
        <div className="auth-container view background-img"> 

            <div className="auth-card">
                <div className="login-div">
                    <h3 className="register-title">S'inscrire</h3>
                    <form className="login-form">
                        <Input
                            inputs={[
                                {
                                    id: 1,
                                    type: 'text',
                                    gridSize: 8, 
                                    initialValue: '', 
                                    labelValue: 'Nom',
                                    labelInline: false
                                },
                                {
                                    id: 2,
                                    type: 'text',
                                    gridSize: 8, 
                                    initialValue: '', 
                                    labelValue: 'Prénom',
                                    labelInline: false
                                },
                                {
                                    id: 3,
                                    type: 'text',
                                    gridSize: 8, 
                                    initialValue: '', 
                                    labelValue: 'Adresse mail',
                                    labelInline: false
                                },
                                {
                                    id: 4,
                                    type: 'password',
                                    gridSize: 8, 
                                    initialValue: '', 
                                    labelValue: 'Mot de passe',
                                    labelInline: false
                                },
                                {
                                    id: 5,
                                    type: 'password',
                                    gridSize: 8, 
                                    initialValue: '', 
                                    labelValue: 'Confirmer le mot de passe',
                                    labelInline: false
                                }
                            ]}
                            justifyContent="flex-center"
                            alignItems="flex-start"
                        />
                        <div className="btn-cont">
                            <button className="login" onClick={() => navigate('/auth/login/auth')}>
                                <p>S'INSCRIRE</p>
                            </button>
                        </div>
                        {/* <CustomButton></CustomButton> */}
                    </form>
                    <div className="login-redirect-div">
                        <a className="login-redirect" href="/auth/login/auth">
                            <p>Déjà inscrit ? Se connecter</p>
                            <div className="underline-effect">
                                <div className="underline-div-hidden" />
                                <div className="underline-div" />
                            </div>
                        </a>
                    </div>
                </div>
                <div className="divider vertical" />
            </div>
        </div>
    );
}
 
export default RegisterView;