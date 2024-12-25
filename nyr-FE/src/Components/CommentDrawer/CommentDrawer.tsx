import React, { useState } from 'react'
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import { CardContent, CardActions, Typography, IconButton, Box, Card, Drawer, List, Divider, ListItem, ListItemAvatar, ListItemText, Avatar, Button, TextField, Chip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import { addComment, likeResolution } from '../../services/api';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { convertTimeToDaysAgo } from '../../utils/utils';

const availableTags = [
    { tag: 'Productivity', c: 'rgb(134 239 172/var(--tw-text-opacity,1))', bgc: 'rgba(5,46,22,.4)', bc: 'rgba(5,46,22,.4)' },
    { tag: 'Family', c: 'rgb(216 180 254 / var(--tw-text-opacity, 1))', bgc: 'rgba(59, 7, 100, .4)', bc: 'rgb(107 33 168 / 1)' },
    { tag: 'Health', c: 'rgb(134 239 172 / var(--tw-text-opacity, 1))', bgc: ' rgba(5, 46, 22, .4)', bc: 'rgb(22 101 52/var(--tw-border-opacity,1))' },
    { tag: 'Education', c: 'rgb(147 197 253/var(--tw-text-opacity,1))', bgc: 'rgba(23,37,84,.4)', bc: 'rgb(30 64 175/var(--tw-border-opacity,1))' },
    { tag: 'Fitness', color: 'rgb(216 180 254/var(--tw-text-opacity,1))', bgc: 'rgba(59,7,100,.4)', bc: 'rgb(107 33 168/var(--tw-border-opacity,1))' },
    { tag: 'Finance', c: 'rgb(209 213 219/var(--tw-text-opacity,1))', bgc: 'rgba(17,24,39,.4)', bc: 'rgb(31 41 55/var(--tw-border-opacity,1))' },
    { tag: 'Career', c: 'rgb(253 186 116/var(--tw-text-opacity,1))', bgc: 'rgba(67,20,7,.4)', bc: 'rgb(154 52 18/var(--tw-border-opacity,1))' },
    { tag: 'Happiness', c: 'rgb(216 180 254 / var(--tw-text-opacity, 1))', bgc: 'rgba(59, 7, 100, .4)', bc: 'rgb(107 33 168 / 1)' },
    { tag: 'Mindfulness', c: 'rgb(216 180 254 / var(--tw-text-opacity, 1))', bgc: 'rgba(59, 7, 100, .4)', bc: 'rgb(107 33 168 / 1)' },
    {
        tag: 'Technology',
        c: 'rgb(147 197 253/var(--tw-text-opacity,1))', bgc: 'rgba(23,37,84,.4)', bc: 'rgb(30 64 175/var(--tw-border-opacity,1))'
    },
];

interface UserDetail {
    name: string;
    user_id: string;
}
interface Comment {
    _id: string;
    comment: string;
    created_at: string;
    r_id: string;
    updated_at: string;
    user_detail: UserDetail;
}

interface CommentDrawerProps {
    isCommentDrawerOpen: boolean;
    setIsCommentDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    name: string;
    resolution: string;
    likeCount: number;
    commentCount: number;
    createdAt: string;
    tags: string[];
    r_id: string;
    comments: Comment[];
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

    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            return; // Do nothing if the comment is empty
        }

        setLoading(true);
        setError('');
        try {
            const response = await addComment(r_id, user_id, newComment);
            setNewComment('');
        } catch (err) {
            setError('Failed to add comment. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleLikeResolution = async () => {
        setLoading(true);
        await likeResolution(r_id);
    };

    const getTagColor = (tagName: string): string | undefined => {
        const tag = availableTags.find(t => t.tag === tagName);
        return tag ? tag.color : undefined;
    };

    return (
        <Drawer
            anchor="right"
            open={isCommentDrawerOpen}
            onClose={() => setIsCommentDrawerOpen(false)}
            sx={{
                "& .MuiDrawer-paper": {
                    width: { xs: "100vw", sm: "60vw", md: "50vw" }, // Responsive width based on screen size
                    maxWidth: "90vw", 
                    '@media (max-width: 900px)': {
                        width: '100%',  // Full width for screens <= 900px
                    },
                },
            }}
            PaperProps={{
                sx: {
                    backgroundColor: "#242936",
                    color: "#FFFFFF",
                    padding: 2,
                },
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                <Typography variant="h6">Comments</Typography>
                <IconButton onClick={() => setIsCommentDrawerOpen(false)} sx={{ color: "#FFFFFF" }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider sx={{ borderColor: "#3A3F47" }} />

            {/* User Details */}
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start", p: 2 }}>
                <Avatar
                    src="/path/to/avatar.jpg"
                    alt={name}
                    sx={{
                        bgcolor: "#FF4081",
                        color: "#fff",
                        marginRight: 2,
                    }}
                >
                    {name.charAt(0).toUpperCase()}
                </Avatar>

                <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <Box sx={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                        <Typography variant="body1" fontWeight="bold" color="#FFFFFF" fontSize="16px">
                            {name}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="#B0BEC5"
                            fontSize="12px"
                        >
                            {convertTimeToDaysAgo(createdAt)}
                        </Typography>
                    </Box>

                    <Typography variant="body2" color="#B0BEC5" mt={0.5} fontSize="18px">
                        {resolution}
                    </Typography>
                </Box>
            </Box>

            {/* Tags */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' , p: 2 }}  >
                                {tags.map((tag, index) => {
                                    // Find the corresponding tag data in the availableTags array
                                    const tagData = availableTags.find(item => item.tag === tag);
            
                                    return (
                                        <Chip
                                            key={index}
                                            label={tag}
                                            sx={{
                                                height: '30px',
                                                borderWidth: 1,
                                                borderStyle: 'solid',
                                                backgroundColor: tagData?.bgc || 'rgba(0, 0, 0, 0.1)', // Default background if not found
                                                borderColor: tagData?.bc || '#ccc', // Default border if not found
                                                color: tagData?.c || '#fff', // Default text color if not found
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: tagData?.bc || '#ccc', // Change background on hover
                                                    color: 'white', // Optional hover effect
                                                },
                                            }}
                                        />
                                    );
                                })}
                            </Box>

            {/* Likes and Comments */}
            <Box display="flex" alignItems="center" justifyContent="" gap={2} p={2}>
                <Box display="flex" alignItems="center" onClick={handleLikeResolution}>
                    {hasLiked ? (
                        <FavoriteIcon sx={{ marginRight: 1, color: "#E03673" }} />
                    ) : (
                        <FavoriteBorderIcon sx={{ marginRight: 1, color: "#fff" }} />
                    )}
                    <Typography variant="body2" fontSize="18px">{likeCount}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    <CommentIcon sx={{ marginRight: 1, color: "#2196F3" }} />
                    <Typography variant="body2" fontSize="18px">{commentCount}</Typography>
                </Box>
            </Box>

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
                    disabled={loading}
                >
                    {loading ? "Posting..." : "Post Comment"}
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
                                    bgcolor: "#FF4081",
                                    color: "#fff",
                                }}
                            >
                                {comment.user_detail.name.charAt(0).toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Box display="flex" alignItems="center">
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

        </Drawer>
    );
};

export default CommentDrawer;
