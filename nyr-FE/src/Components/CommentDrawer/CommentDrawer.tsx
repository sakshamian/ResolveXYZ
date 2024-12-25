import React, { useState } from 'react'
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import { CardContent, CardActions, Typography, IconButton, Box, Card, Drawer, List, Divider, ListItem, ListItemAvatar, ListItemText, Avatar, Button, TextField, Chip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import { addComment, fetchResolutionById, likeResolution } from '../../services/api';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { convertTimeToDaysAgo } from '../../utils/utils';

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

interface UserDetail {
    name: string;
    user_id: string;
}
interface Comment {
    _id: string; // Unique ID for the comment
    comment: string; // The comment text
    created_at: string; // Timestamp of comment creation
    r_id: string; // Related resolution ID
    updated_at: string; // Timestamp of the last update
    user_detail: UserDetail; // Name of the user who wrote the comment
}

interface CommentDrawerProps {
    isCommentDrawerOpen: boolean;
    setIsCommentDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;  // Function to close the drawer
    name: string;
    resolution: string;
    likeCount: number;
    commentCount: number;
    createdAt: string;
    tags: string[];
    r_id: string;
    comments: Comment[]; // Array of Comment objects
    user_id: string;
    hasLiked: boolean;
}
const CommentDrawer: React.FC<CommentDrawerProps> = ({
    isCommentDrawerOpen,
    setIsCommentDrawerOpen,
    name,
    resolution,
    likeCount,
    commentCount,
    createdAt,
    tags,
    r_id,
    comments,
    user_id,
    hasLiked,
}) => {

    // console.log("comments:",comments)
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState<string>('');

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            return; // Do nothing if the comment is empty
        }

        setLoading(true); // Set loading state to true
        setError(''); // Clear any previous error
        console.log("at drawer", newComment)
        try {
            // Call the addComment API function
            const response = await addComment(r_id, user_id, newComment);
            console.log('New comment added:', response);
            // Assuming the response contains the updated list of comments, you can update the state
            // You can directly append the new comment to the existing comments list if needed
            setNewComment(''); // Clear the comment input field after submission

        } catch (err) {
            console.error('Error adding comment:', err);
            setError('Failed to add comment. Please try again later.');
        } finally {
            setLoading(false); // Reset loading state after the request is completed
        }
    };

    const handleLikeResolution = async () => {
        setLoading(true); // Start loading
        await likeResolution(r_id);
    };
    console.log("comments", comments)

    const getTagColor = (tagName: string): string | undefined => {
        const tag = availableTags.find(t => t.tag === tagName);
        return tag ? tag.color : undefined; // Returns color or undefined if tag not found
      };
    return (
        <Drawer
            anchor="right"
            open={isCommentDrawerOpen}
            onClose={() => setIsCommentDrawerOpen(false)}
            sx={{
                "& .MuiDrawer-paper": {
                    width: "40vw", // Set width to 50% of the viewport
                    maxWidth: "50vw", // Ensure it doesn't exceed 50vw
                },
            }}
            PaperProps={{
                sx: {
                    backgroundColor: "#242936",
                    color: "#FFFFFF", // Text color for contrast
                },
            }
            }
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                <Typography variant="h6">Comments</Typography>
                <IconButton onClick={() => setIsCommentDrawerOpen(false)} sx={{ color: "#FFFFFF" }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider sx={{ borderColor: "#3A3F47" }} />
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start", p: 2 }}>
                {/* Avatar */}
                <Avatar
                    src="/path/to/avatar.jpg"
                    alt={name}
                    sx={{
                        bgcolor: "#FF4081", // Background color for the avatar
                        color: "#fff", // Text color
                        marginRight: 2, // Spacing between avatar and text column
                    }}
                >
                    {name.charAt(0).toUpperCase()}
                </Avatar>

                {/* Name and Resolution */}
                <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    {/* Name */}
                    <Typography variant="body1" fontWeight="bold" color="#FFFFFF" fontSize="16px">
                        {name}
                    </Typography>
                    {/* Resolution */}
                    <Typography variant="body2" color="#B0BEC5" mt={0.5} fontSize="18px">
                        {resolution}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', p:2 }}>
                {tags.map((tag, index) => (
                    <Chip
                        key={index}
                        label={tag}
                        sx={{
                            borderColor: "#242936", // Green border color for example
                            borderWidth: 1,
                            borderStyle: 'solid',
                            backgroundColor: '#242936',
                            color: getTagColor(tag),
                        }}
                    />
                ))}
            </Box>

            {/* Likes and Comments */}
            <Box display="flex" alignItems="center" justifyContent="" gap={"2vw"} p={2} >
                <Box display="flex" alignItems="center" onClick={() => handleLikeResolution()}>
                    {hasLiked ? (
                        <FavoriteIcon sx={{ marginRight: 1, color: "#E03673" }} />
                    ) : (
                        <FavoriteBorderIcon sx={{ marginRight: 1, color: "#fff" }} />
                    )}
                    <Typography variant="body2" fontSize="18px">{likeCount}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    <CommentIcon sx={{ marginRight: 1, color: "#2196F3" }} />
                    <Typography variant="body2" fontSize="18px">{commentCount} </Typography>
                </Box>
            </Box>

            {/* User Picture and Name */}




            <Divider sx={{ borderColor: "#3A3F47" }} />

            {/* Comment Box */}
            <Box p={2}>
                <TextField
                    fullWidth
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    multiline
                    rows={2}
                    sx={{
                        backgroundColor: "#3A3F47",
                        borderRadius: 1,
                        color: "#FFFFFF",
                    }}
                    InputProps={{
                        sx: { color: "#FFFFFF" },
                    }}
                />
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ marginTop: 1, backgroundColor: "#2196F3", color: "#fff", fontWeight: 600 }}
                    onClick={handleAddComment}
                >
                    Post Comment
                </Button>
            </Box>

            <Divider sx={{ borderColor: "#3A3F47" }} />

            {/* Comments Section */}
            <List>
                {comments.map((comment) => (
                    <ListItem key={comment._id} alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar
                                src="/path/to/avatar.jpg"
                                alt={comment.user_detail.name}
                                sx={{
                                    bgcolor: "#FF4081", // Background color for the avatar
                                    color: "#fff", // Text color

                                }}
                            >
                                {comment.user_detail.name.charAt(0).toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Box display="flex" alignItems="center" justifyContent="">
                                    <Typography
                                        variant="body1"
                                        fontWeight="bold"
                                        color="#FFFFFF"
                                        style={{ marginRight: "8px" }}
                                        fontSize="16px"
                                    >
                                        {comment.user_detail.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="#B0BEC5"
                                        fontSize="10px"
                                    >
                                        {convertTimeToDaysAgo(comment.created_at)}
                                    </Typography>
                                </Box>
                            }
                            secondary={
                                <Typography
                                    variant="body2"
                                    color="#B0BEC5"
                                    style={{ marginTop: "4px" }}
                                    fontSize="18px"
                                >
                                    {comment.comment}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>

        </ Drawer >
    )
}

export default CommentDrawer