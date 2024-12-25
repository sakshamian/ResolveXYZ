import React, { useState } from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Select,
    MenuItem,
    Chip,
    InputLabel,
    FormHelperText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SelectChangeEvent } from '@mui/material/Select';

interface ResolutionModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (resolution: {
        resolution: string;
        tags: string[];
    }) => void;
}

const availableTags = [
    { tag: 'Productivity', color: '#4CAF50' },
    { tag: 'Health', color: '#FF6347' },
    { tag: 'Education', color: '#1E90FF' },
    { tag: 'Career', color: '#FFD700' },
    { tag: 'Fitness', color: '#32CD32' },
    { tag: 'Finance', color: '#FF8C00' },
    { tag: 'Family', color: '#FF1493' },
    { tag: 'Happiness', color: '#FFEB3B' },
    { tag: 'Mindfulness', color: '#B0E0E6' },
    { tag: 'Technology', color: '#0000FF' },
];

const ResolutionModal: React.FC<ResolutionModalProps> = ({ open, onClose, onSubmit }) => {
    const [description, setDescription] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tagLimitReached, setTagLimitReached] = useState(false);

    // Handle tag selection
    const handleTagSelect = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value;
        if (Array.isArray(value)) {
            if (value.length <= 3) {
                setSelectedTags(value);
                setTagLimitReached(false);
            } else {
                setTagLimitReached(true);  // Enable tag limit error message
            }
        }
    };

    // Handle tag removal (via the cross icon)
    const handleRemoveTag = (tagToDelete: string) => (event: React.MouseEvent) => {
        console.log(tagToDelete, "here")
        event.preventDefault();
        event.stopPropagation();
        setSelectedTags((tags) => tags.filter((tag) => tag !== tagToDelete));
        setTagLimitReached(false);
    };

    // Handle form submission
    const handleSubmit = () => {
        onSubmit({ resolution: description, tags: selectedTags });
        setDescription('');
        setSelectedTags([]);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} sx={{ color: "#f2f2f2" }}>
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
                <Box sx={{ fontSize: "18px", fontWeight: 400, mb: 2, display: "flex", justifyContent: "space-between" }}>
                    <h3>New Resolution</h3>
                    <CloseIcon onClick={onClose} style={{ cursor: 'pointer' }} />
                </Box>

                {/* Text Area for Resolution Description */}
                <InputLabel sx={{ mt: 3 }}>Resolution</InputLabel>
                <TextField
                    fullWidth
                    placeholder="Write here..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ '& .MuiInputBase-root': { paddingTop: '0px' } }}
                    multiline
                    rows={3}
                />

                {/* Multi-select Dropdown for Tags */}
                <InputLabel sx={{ mt: 2 }}>Select tags (max 3)</InputLabel>
                <Select
                    fullWidth
                    multiple
                    value={selectedTags}
                    onChange={handleTagSelect}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as string[]).map((tag) => {
                                const tagObj = availableTags.find(t => t.tag === tag);
                                return (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={handleRemoveTag(tag)}
                                        onMouseDown={(event) => {
                                            event.stopPropagation();
                                        }}
                                        sx={{
                                            borderColor: tagObj?.color,
                                            borderWidth: 2,
                                            borderStyle: 'solid',
                                            backgroundColor: 'transparent',
                                            color: tagObj?.color,
                                            borderRadius: '16px',
                                            padding: '5px 10px',
                                            '&:hover': {
                                                borderColor: tagObj?.color,
                                            },
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    )}
                >
                    {availableTags.map((availableTag) => (
                        <MenuItem key={availableTag.tag} value={availableTag.tag}>
                            {availableTag.tag}
                        </MenuItem>
                    ))}
                </Select>

                {/* Display Error Message if Limit Reached */}
                {tagLimitReached && (
                    <FormHelperText error sx={{ mt: 1 }}>
                        You can select up to 3 tags only.
                    </FormHelperText>
                )}

                {/* Submit Button */}
                <Box sx={{ mt: 1, display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            color: "black",
                            background: "#f2f2f2",
                            px: 3,
                            py: 0.5,
                        }}
                        onClick={handleSubmit}
                        disabled={description.trim() === ''}
                    >
                        Post
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ResolutionModal;
