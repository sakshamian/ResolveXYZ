import React from 'react';
import { Modal, Box, Button } from '@mui/material';

interface LogoutModalProps {
    open: boolean;
    onClose: () => void;
    onLogout: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ open, onClose, onLogout }) => {
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
                    fontSize: "16px",
                    fontWeight: 400,
                    mb: 2
                }}>
                    Are you sure you want to log out?
                </Box>
                <Box sx={{ mt: 6, display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        sx={{
                            // display
                            textTransform: "none",
                            color: "black",
                            background: "#f2f2f2",
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
                            color: "white",
                            background: "#EE4B2B",
                            px: 3
                        }}
                        onClick={onLogout}
                    >
                        Logout
                    </Button>
                    {/* <Button variant="outlined" color="primary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={onLogout}>
                        Log Out
                    </Button> */}
                </Box>
            </Box>
        </Modal >
    );
};

export default LogoutModal;
