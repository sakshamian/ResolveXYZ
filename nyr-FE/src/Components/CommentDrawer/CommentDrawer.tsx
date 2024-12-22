import React, { useState } from 'react'
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import { CardContent, CardActions, Typography, IconButton, Box, Card, Drawer, List, Divider, ListItem, ListItemAvatar, ListItemText, Avatar, Button, TextField } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import { addComment } from '../../services/api';

interface Comment {
    _id: string; // Unique ID for the comment
    comment: string; // The comment text
    created_at: string; // Timestamp of comment creation
    r_id: string; // Related resolution ID
    updated_at: string; // Timestamp of the last update
    user_id: string; // ID of the user who wrote the comment
    user_name: string; // Name of the user who wrote the comment
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
    user_id:string;
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
    user_id
}) => {

    // console.log("comments:",comments)
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState<boolean>(false);  // To manage the loading state
    const [error, setError] = useState<string>('');
    
    const handleAddComment = async () => {
        if (!newComment.trim()) {
            return; // Do nothing if the comment is empty
        }

        setLoading(true); // Set loading state to true
        setError(''); // Clear any previous error
       console.log("at drawer",newComment)
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

    return (
        <Drawer
            anchor="right"
            open={isCommentDrawerOpen}
            onClose={() => setIsCommentDrawerOpen(false)} 
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

            {/* User Picture and Name */}
            <Box display="flex" alignItems="center" p={2}>
                <Avatar alt="User Name" src="/path/to/post-user-avatar.jpg" sx={{ marginRight: 2 }} />
                <Typography variant="body1">{name}</Typography>
            </Box>

            {/* Post Text */}
            <Box px={2}>
                <Typography variant="body2">
                    {resolution}
                </Typography>
            </Box>

            {/* Likes and Comments */}
            <Box display="flex" alignItems="center" justifyContent="space-between" px={2} py={1}>
                <Box display="flex" alignItems="center">
                    <FavoriteIcon sx={{ marginRight: 1, color: "#FF4081" }} />
                    <Typography variant="body2">{likeCount} Likes</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    <CommentIcon sx={{ marginRight: 1, color: "#2196F3" }} />
                    <Typography variant="body2">{commentCount} Comments</Typography>
                </Box>
            </Box>
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
                    sx={{ marginTop: 1, backgroundColor: "#2196F3" }}
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
                            <Avatar alt={comment.user_name} src="/path/to/avatar.jpg" />
                        </ListItemAvatar>
                        <ListItemText
                            primary={comment.user_name}
                            secondary={comment.comment}
                            primaryTypographyProps={{ color: "#FFFFFF" }}
                            secondaryTypographyProps={{ color: "#B0BEC5" }}
                        />
                    </ListItem>
                ))}
            </List>

        </ Drawer >
    )
}

export default CommentDrawer