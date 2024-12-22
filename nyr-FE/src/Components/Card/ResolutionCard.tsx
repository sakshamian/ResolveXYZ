import React, { useState } from 'react';
import { CardContent, CardActions, Typography, IconButton, Box, Card } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import "./ResolutionCard.css";

interface CartProps {
    ideaTitle: string;
    ideaDescription: string;
}

const ResolutionCard: React.FC<CartProps> = ({ ideaTitle, ideaDescription }) => {
    const [liked, setLiked] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(0); // State to track the number of likes
    const [commentCount, setCommentCount] = useState<number>(0); // State to track the number of comments
    const [comment, setComment] = useState<string>(''); // Track the inputted comment
    const [comments, setComments] = useState<string[]>([]); // Array to store the list of comments

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
            setComments([...comments, comment]); // Add new comment to the list
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleCommentSubmit} sx={{ color: '#fff' }}>
                        <CommentIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ marginLeft: 1 }}>
                        {commentCount}
                    </Typography>
                </Box>
            </CardActions>
        </Card>
    );
};

export default ResolutionCard; // Export with the new name
