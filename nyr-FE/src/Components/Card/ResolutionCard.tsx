import React, { useState } from 'react';
import { CardContent, CardActions, Typography, IconButton, Box, Card, Drawer, List, Divider, ListItem, ListItemAvatar, ListItemText, Avatar, Button, TextField } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import "./ResolutionCard.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";

interface Comment {
    id: number;
    user: string;
    text: string;
    avatar: string;
}

interface CartProps {
    ideaTitle: string;
    ideaDescription: string;
}

const ResolutionCard: React.FC<CartProps> = ({ ideaTitle, ideaDescription }) => {
    const [liked, setLiked] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(0); // State to track the number of likes
    const [commentCount, setCommentCount] = useState<number>(0); // State to track the number of comments
    const [comment, setComment] = useState<string>(''); // Track the inputted comment
    // const [comments, setComments] = useState<string[]>([]); // Array to store the list of comments
    const [isCommentDrawerOpen, setIsCommentDrawerOpen] = React.useState(false);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState<Comment[]>([
        { id: 1, user: "Alice", text: "Great post!", avatar: "/path/to/avatar1.jpg" },
        { id: 2, user: "Bob", text: "Really insightful!", avatar: "/path/to/avatar2.jpg" },
    ]);

    const toggleDrawer = (newOpen: boolean) => () => {
        setIsCommentDrawerOpen(newOpen);
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments([
                ...comments,
                { id: comments.length + 1, user: "You", text: newComment, avatar: "/path/to/your-avatar.jpg" },
            ]);
            setNewComment("");
        }
    };

    // Handle Like Button
    const handleLike = () => {
        if (liked) {
            setLikeCount(likeCount - 1); // Decrease like count when unliking
        } else {
            setLikeCount(likeCount + 1); // Increase like count when liking
        }
        setLiked(!liked); // Toggle like status
    };

    // Handle Comment Button
    const handleCommentSubmit = () => {
        if (comment.trim()) {
            const newCommentObj: Comment = {
                id: comments.length + 1, // Generate a unique ID
                user: "You", // Replace with the current user's name if available
                text: newComment, // Use the value from the input
                avatar: "/path/to/your-avatar.jpg", // Replace with the user's avatar URL
            };

            setComments([...comments, newCommentObj]); // Add new comment to the list
            setCommentCount(commentCount + 1); // Increment comment count
            setComment(''); // Clear the comment input field after submitting
        }
    };

    return (
        <Card className='custom-card'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 200,
                borderRadius: '8px',
                boxShadow: 3,
                backgroundColor: '#242936',
                color: '#f5f5f5',
                position: 'relative',
                padding: '10px',
                marginBottom: '20px', // Space between cards
            }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {ideaTitle}
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                    {ideaDescription}
                </Typography>
            </CardContent>
            <CardActions sx={{
                display: 'flex',
                margin: '10px',
                padding: '0 10px',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleLike} sx={{ color: liked ? 'primary.main' : '#fff' }}>
                        <ThumbUpIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ marginLeft: 1 }}>
                        {likeCount}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={toggleDrawer(true)}>
                    <IconButton onClick={handleCommentSubmit} sx={{ color: '#fff' }}>
                        <CommentIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ marginLeft: 1 }}>
                        {commentCount}
                    </Typography>
                </Box>
            </CardActions>
            <Drawer
                anchor="left"
                open={isCommentDrawerOpen}
                onClose={toggleDrawer(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: "#242936",
                        color: "#FFFFFF", // Text color for contrast
                    },
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                    <Typography variant="h6">Comments</Typography>
                    <IconButton onClick={toggleDrawer(false)} sx={{ color: "#FFFFFF" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ borderColor: "#3A3F47" }} />

                {/* User Picture and Name */}
                <Box display="flex" alignItems="center" p={2}>
                    <Avatar alt="User Name" src="/path/to/post-user-avatar.jpg" sx={{ marginRight: 2 }} />
                    <Typography variant="body1">John Doe</Typography>
                </Box>

                {/* Post Text */}
                <Box px={2}>
                    <Typography variant="body2">
                        This is a sample post text. It's great to share thoughts with the community!
                    </Typography>
                </Box>

                {/* Likes and Comments */}
                <Box display="flex" alignItems="center" justifyContent="space-between" px={2} py={1}>
                    <Box display="flex" alignItems="center">
                        <FavoriteIcon sx={{ marginRight: 1, color: "#FF4081" }} />
                        <Typography variant="body2">123 Likes</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <CommentIcon sx={{ marginRight: 1, color: "#2196F3" }} />
                        <Typography variant="body2">{comments.length} Comments</Typography>
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
                        <ListItem key={comment.id} alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt={comment.user} src={comment.avatar} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={comment.user}
                                secondary={comment.text}
                                primaryTypographyProps={{ color: "#FFFFFF" }}
                                secondaryTypographyProps={{ color: "#B0BEC5" }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Card>
    );
};

export default ResolutionCard; // Export with the new name
