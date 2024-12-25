import React, { useEffect, useState } from 'react'
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import { CardContent, CardActions, Typography, IconButton, Box, Card, Drawer, List, Divider, ListItem, ListItemAvatar, ListItemText, Avatar, Button, TextField, Chip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import { addComment, likeResolution } from '../../services/api';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { convertTimeToDaysAgo } from '../../utils/utils';
import RedirectToLoginModal from '../Modal/RedirectToLoginModal';
import { useAuth } from '../../Context/AuthContext';

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
    hasLiked: boolean;
}

const CommentDrawer: React.FC<CommentDrawerProps> = ({
    isCommentDrawerOpen,
    setIsCommentDrawerOpen,
    name,
    resolution,
    likeCount: initialLikeCount,
    commentCount: initialCommentCount,
    createdAt,
    tags,
    r_id,
    comments: initialComments,
    hasLiked: initialHasLiked,
}) => {

    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [isRedirectLoginModalOpen, setRedirectLoginModalOpen] = useState(false);
    const [localComments, setLocalComments] = useState<Comment[]>(initialComments);
    const [localCommentCount, setLocalCommentCount] = useState(initialCommentCount);
    const [localLikeCount, setLocalLikeCount] = useState(initialLikeCount);
    const [localHasLiked, setLocalHasLiked] = useState(initialHasLiked);

    const { user } = useAuth();

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            return; // Do nothing if the comment is empty
        }
        if (!user) {
            setRedirectLoginModalOpen(true);
        }
        // setLoading(true);
        setError('');
        try {
            const response = await addComment(r_id, newComment);
            const newCommentObj: Comment = {
                _id: response._id || Date.now().toString(),
                comment: newComment,
                created_at: new Date().toISOString(),
                r_id,
                updated_at: new Date().toISOString(),
                user_detail: {
                    name: user.name || name,
                    user_id: user.id
                }
            };

            setLocalComments(prev => [newCommentObj, ...prev]);
            setLocalCommentCount(prev => prev + 1);
            setNewComment('');
        } catch (err) {
            setError('Failed to add comment. Please try again later.');
        } finally {
            // setLoading(false);
        }
    };

    const handleLikeResolution = async () => {
        if (!user) {
            setRedirectLoginModalOpen(true);
            return;
        }

        try {
            setLocalHasLiked(prev => !prev);
            setLocalLikeCount(prev => prev + (localHasLiked ? -1 : 1));
            await likeResolution(r_id);
        } catch (err) {
            setLocalHasLiked(prev => !prev);
            setLocalLikeCount(prev => prev + (localHasLiked ? 1 : -1));
            console.error(err);
        }
    };

    const getTagColor = (tagName: string): string | undefined => {
        const tag = availableTags.find(t => t.tag === tagName);
        return tag ? tag.color : undefined;
    };

    useEffect(() => {
        setLocalComments(initialComments);
        setLocalCommentCount(initialCommentCount);
        setLocalLikeCount(initialLikeCount);
        setLocalHasLiked(initialHasLiked);
    }, [initialComments, initialCommentCount, initialHasLiked, initialLikeCount]);

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
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', p: 2 }}>
                {tags.map((tag, index) => (
                    <Chip
                        key={index}
                        label={tag}
                        sx={{
                            borderColor: "#242936",
                            borderWidth: 1,
                            borderStyle: 'solid',
                            backgroundColor: '#242936',
                            color: getTagColor(tag),
                        }}
                    />
                ))}
            </Box>

            {/* Likes and Comments */}
            <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                <Box display="flex" alignItems="center" onClick={handleLikeResolution} sx={{ cursor: 'pointer' }}>
                    {localHasLiked ? (
                        <FavoriteIcon sx={{ marginRight: 1, color: "#E03673" }} />
                    ) : (
                        <FavoriteBorderIcon sx={{ marginRight: 1, color: "#fff" }} />
                    )}
                    <Typography variant="body2" fontSize="18px">{localLikeCount}</Typography>
                </Box>
                <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }}>
                    <CommentIcon sx={{ marginRight: 1, color: "#2196F3" }} />
                    <Typography variant="body2" fontSize="18px">{localCommentCount}</Typography>
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
                        '& .MuiInputBase-root': { paddingTop: '0px' }
                    }}
                />
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ marginTop: 1, backgroundColor: "#2196F3", color: "#fff", fontWeight: 600 }}
                    onClick={handleAddComment}
                    disabled={loading || !newComment.trim()}
                >
                    {loading ? "Posting..." : "Post Comment"}
                </Button>
            </Box>

            <Divider sx={{ borderColor: "#3A3F47" }} />

            {/* Comments Section */}
            <List sx={{ mb: 3 }}>
                {localComments.map((comment) => (
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

            <RedirectToLoginModal
                open={isRedirectLoginModalOpen}
                onClose={() => setRedirectLoginModalOpen(false)}
                heading="Please login to add resolutions!"
            />

        </Drawer>
    );
};

export default CommentDrawer;
