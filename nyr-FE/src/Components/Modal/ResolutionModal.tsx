import React, { useState } from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Select,
    MenuItem,
    Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


interface ResolutionModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (resolution: {
        resolution: string;
        tags: string[];
    }) => void;
}

const availableTags = ['#Health', '#Education', '#Career', '#Personal', '#Fitness'];

const ResolutionModal: React.FC<ResolutionModalProps> = ({ open, onClose, onSubmit }) => {
    const [description, setDescription] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleTagSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedTags(event.target.value as string[]);
    };

    const handleRemoveTag = (tag: string) => {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
    };

    const handleSubmit = () => {
        onSubmit({ resolution: description, tags: selectedTags });
        setDescription('');
        setSelectedTags([]);
        onClose();
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
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    width: 400,
                }}
            >
                <Box sx={{
                    fontSize: "18px",
                    fontWeight: 400,
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <h3>New Resolution</h3>
                    <CloseIcon onClick={onClose} style={{ cursor: 'pointer' }} />
                </Box>

                {/* Text Area for Resolution Description */}
                <TextField
                    fullWidth
                    placeholder="Resolution Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mt: 5 }}
                    multiline
                    rows={4}
                />

                {/* Multi-select Dropdown for Tags */}
                <Select
                    fullWidth
                    multiple
                    value={selectedTags}
                    onChange={handleTagSelect}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as string[]).map((tag) => (
                                <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} />
                            ))}
                        </Box>
                    )}
                    sx={{ mt: 2 }}
                >
                    {availableTags.map((tag) => (
                        <MenuItem key={tag} value={tag}>
                            {tag}
                        </MenuItem>
                    ))}
                </Select>
                <Box sx={{ mt: 6, display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            color: "black",
                            background: "#f2f2f2",
                            px: 3,
                            py: 0.5
                        }}
                        onClick={handleSubmit}
                    >
                        Post
                    </Button>
                </Box>
            </Box>
        </Modal >
    );
};

export default ResolutionModal;
