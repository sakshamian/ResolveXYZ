import React, { useEffect } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const SignIn: React.FC = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = async (response: any) => {
        console.log("Google Login Success:", response);

        if (response.credential) {
            try {
                const res = await fetch('http://localhost:8080/auth/google/callback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: response.credential, // Send the ID token
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log('Login successful:', data);

                    // Store token from your backend
                    localStorage.setItem('token', data.token);

                    // Redirect to dashboard
                    // navigate('/');
                } else {
                    console.error('Authentication failed:', res.statusText);
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        } else {
            console.error('No credential received from Google');
        }
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
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
            <div className="auth-container">
                <div className="auth-form">
                    {/* <h2>Sign In</h2> */}
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginFailure}
                        text="signin_with"
                    // useOneTap
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

// src/components/Login.tsx