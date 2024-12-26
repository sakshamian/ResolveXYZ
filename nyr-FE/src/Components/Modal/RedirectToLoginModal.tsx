import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';
import { useAuth } from '../../Context/AuthContext';
import { updateProfile } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface RedirectToLoginModalProps {
    open: boolean;
    heading: string;
    onClose: () => void;
    // onSave: () => void;
}

const RedirectToLoginModal: React.FC<RedirectToLoginModalProps> = ({ open, onClose, heading }) => {
    const navigate = useNavigate();

    const handleRedirectToLoginPage = () => {
        navigate('/sign-in');
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{ color: "#f2f2f2" }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: "#242936",
                    boxShadow: 50,
                    p: 3,
                    borderRadius: 2,
                    width: '90%',
                    maxWidth: 400,
                }}
            >
                <Box sx={{
                    fontSize: "17px",
                    fontWeight: 400,
                    mb: 2
                }}>
                    {heading}
                </Box>
                <Box sx={{ mt: 5, display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            color: "#f2f2f2",
                            border: "1x solid red",
                            background: '#242936',
                            px: 3
                        }}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            color: "black",
                            background: "#f2f2f2",
                            px: 3,
                            fontWeight: '600'
                        }}
                        onClick={handleRedirectToLoginPage}
                    >
                        LOGIN
                    </Button>
                </Box>
            </Box>
        </Modal >
    );
};

export default RedirectToLoginModal;
