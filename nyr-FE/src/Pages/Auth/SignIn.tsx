import React, { useEffect } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const SignIn: React.FC = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = (response: any) => {
        console.log('Login Success:', response);
        // Send the response credential (token) to your backend for further processing
    };

    const handleLoginFailure = (error: any) => {
        console.error('Login Failed:', error);
    };

    const toggleAuthMethod = () => {
        navigate('/sign-up');
    };

    useEffect(() => {
        const handlePopState = () => {
            navigate('/');
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    return (
        <GoogleOAuthProvider clientId="1084055477464-qject72ddsd71e4i65si1pq0okmt36dm.apps.googleusercontent.com">
            <div className="auth-container">
                <div className="auth-form">
                    {/* <h2>Sign In</h2> */}
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginFailure}
                        text="signin_with"
                        useOneTap
                    />
                    <p onClick={toggleAuthMethod} style={{ cursor: 'pointer', textDecoration: 'underline', fontSize: '14px', marginTop: '15px' }}>
                        Don't have an account? Sign Up
                    </p>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default SignIn;
