import React, { useEffect } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const SignUp: React.FC = () => {
    const navigate = useNavigate();

    const handleSignUpSuccess = (response: any) => {
        console.log('Sign Up Success:', response);
        // Send the response credential (token) to your backend for further processing
    };

    const handleSignUpFailure = (error: any) => {
        console.error('Sign Up Failed:', error);
    };

    const toggleAuthMethod = () => {
        navigate('/sign-in');
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
                    <GoogleLogin
                        onSuccess={handleSignUpSuccess}
                        onError={handleSignUpFailure}
                        text="signup_with"
                        useOneTap
                    />
                    <p onClick={toggleAuthMethod} style={{ cursor: 'pointer' }}>
                        Already have an account? Sign In
                    </p>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default SignUp;
