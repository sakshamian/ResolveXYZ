import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { fetchResolutions, postResolutions } from "../../services/api";
import ResolutionCard from "../../Components/Card/ResolutionCard";
import "./Main.css";
import HourglassLoader from "../../Components/Loader/Loader";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ResolutionModal from "../../Components/Modal/ResolutionModal";

interface Resolution {
    _id: string;
    resolution: string;
    comment_count: number;
    like_count: number;
    created_at: string;
    updated_at: string;
    tags: string[];
    user_name: string;
    user_id: string;
}

const Main = () => {
    const [cards, setCards] = useState<Resolution[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [resolution, setResolution] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const allTags = ['Personal', 'Work', 'Health', 'Finance', 'Hobbies'];

    const handleResolutionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setResolution(event.target.value);
    };

    const handleTagChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setTags(event.target.value as string[]);
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag)); // Remove tag
    };

    const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility

    const handleOpen = () => setIsModalOpen(true);  // Open modal
    const handleClose = () => setIsModalOpen(false);

    const handleSubmitResolution = (resolution: { resolution: string; tags: string[] }) => {
        postResolutions(resolution);
    };

    const loadCards = async () => {

        try {
            const data = await fetchResolutions(page);
            setPage(page + 1);
            if (!data.resolutions) setCards([])
            else setCards((prevResolutions) => [...prevResolutions, ...data.resolutions]);
            setHasMore(data.has_more);
        } catch (error) {
            console.error("Failed to load cards:", error);
        }
    };

    useEffect(() => {
        loadCards();
    }, []);

    return (
        <div className="main-container">
            <Box display="flex" justifyContent="flex-end">
                {/* <Button
                    variant="contained"
                    sx={{
                        // display
                        textTransform: "none",
                        color: "black",
                        background: "#fff"
                    }}
                    onClick={handleOpen}
                >
                    <FilterList fontSize="small" sx={{ marginRight: "15px" }} />
                    Sort
                </Button> */}
                <Button
                    variant="contained"
                    sx={{
                        // display
                        textTransform: "none",
                        color: "black",
                        background: "#fff"
                    }}
                    onClick={handleOpen}
                >
                    <AddIcon fontSize="small" sx={{ marginRight: "15px" }} />
                    Add Resolution
                </Button>
            </Box>
            <Modal open={isModalOpen} onClose={handleClose} sx={{
                color: "#f2f2f2",
            }}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        // bgcolor: 'background.paper',
                        background: "#242936",
                        color: "#f2f2f2",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        width: 400,
                    }}
                >
                    {/* Modal Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <h3>New Resolution</h3>
                        <CloseIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
                    </Box>

                    {/* Resolution Input */}
                    <InputLabel sx={{ mt: 4, color: "#f2f2f2" }}>Resolution</InputLabel>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Write here...."
                        value={resolution}
                        onChange={handleResolutionChange}
                        sx={{
                            color: "#f2f2f2",
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white', // Change border color when focused
                                },
                                '& input': {
                                    color: 'white', // Change the input text color
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'white', // Change the label color if used
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'white', // Border color when not focused
                            },
                            '& input::placeholder': {
                                color: 'white', // Ensure placeholder color is white
                                opacity: 1, // Important to ensure placeholder is visible and not transparent
                            },
                        }}
                    />

                    {/* Multi-select Dropdown for Tags */}
                    {/* <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Tags</InputLabel>
                        <Select
                            multiple
                            value={tags}
                            onChange={handleTagChange}
                            renderValue={(selected) => (
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {selected.map((tag) => (
                                        <Chip
                                            key={tag}
                                            label={`#${tag}`}
                                            onDelete={() => handleRemoveTag(tag)}
                                            sx={{ margin: '2px', color: "#f2f2f2" }}
                                        />
                                    ))}
                                </div>
                            )}
                        >
                            {allTags.map((tag) => (
                                <MenuItem sx={{ color: "#f2f2f2" }} key={tag} value={tag}>
                                    {tag}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}

                    {/* Footer Button to Save/Submit */}
                    <Box mt={3} display="flex" justifyContent="flex-end">
                        <Button sx={{
                            textTransform: "none",
                            color: "black",
                            background: "#fff"
                        }} onClick={handleClose}>
                            Post
                        </Button>
                    </Box>
                </Box >
            </Modal >
            <div className="card-container">
                <InfiniteScroll
                    dataLength={cards.length}
                    next={loadCards}
                    hasMore={hasMore}
                    loader={
                        <Box display="flex" justifyContent="center" px={5} my={5}>
                            <HourglassLoader />
                        </Box>
                    }
                    endMessage={
                        <Typography variant="body2" align="center" color="textSecondary">
                            You have reached the end.
                        </Typography>
                    }
                >
                    <Box
                        display="flex"
                        flexWrap="wrap"
                        gap={2}
                        p={2}
                        justifyContent="space-between"
                    >
                        {cards?.map((card, ind) => {
                            return (
                                <Box
                                    key={ind}
                                    flex="1 1 calc(33.333% - 16px)" // This ensures three cards per row with space between them
                                    minWidth="300px" // Minimum width to avoid items being too small
                                >
                                    <ResolutionCard
                                        ideaTitle={card.user_name || "Unknown User"}
                                        ideaDescription={card.resolution || "No resolution provided"}
                                        likeCount={card.like_count}
                                        commentCount={card.comment_count}
                                        createdAt={card.created_at}
                                        tags={card.tags}
                                        r_id={card._id}
                                        user_id={card.user_id}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                </InfiniteScroll>
            </div>
            <ResolutionModal
                open={isModalOpen}
                onClose={handleClose}
                onSubmit={handleSubmitResolution}
            />
        </div >
    );
};

export default Main;
