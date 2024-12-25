import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';
import { useAuth } from '../../Context/AuthContext';
import { updateProfile } from '../../services/api';

interface UpdateProfileModalProps {
    open: boolean;
    heading: string;
    defaultName: string | null | undefined;
    onClose: () => void;
    // onSave: () => void;
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({ open, onClose, heading, defaultName }) => {
    const [username, setUserName] = useState(defaultName || '');

    useEffect(() => {
        if (defaultName) {
            setUserName(defaultName);
        }
    }, [defaultName]);

    const handleUpdateProfile = async () => {
        const res = await updateProfile(username);
        if (res) onClose();
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
                    width: 400,
                }}
            >
                <Box sx={{
                    fontSize: "16px",
                    fontWeight: 400,
                    mb: 2
                }}>
                    {heading}
                </Box>
                <TextField
                    fullWidth
                    placeholder="Name"
                    margin="normal"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <Box sx={{ mt: 1, display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
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
                            px: 3
                        }}
                        onClick={handleUpdateProfile}
                        disabled={username?.trim() === ''}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal >
    );
};

export default UpdateProfileModal;
