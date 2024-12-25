import React, { useState } from 'react';
import { CardContent, CardActions, Typography, IconButton, Box, Card, Avatar } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import { fetchResolutionById, likeResolution } from '../../services/api';
import { convertTimeToDaysAgo } from '../../utils/utils';
import CommentDrawer from '../CommentDrawer/CommentDrawer';  // Import the CommentDrawer component



interface CartProps {
    ideaTitle: string;
    ideaDescription: string;
    likeCount: number;
    commentCount: number;
    createdAt: string;
    tags: string[];
    r_id: string;
    user_id: string;
}

const ResolutionCard: React.FC<CartProps> = ({ ideaTitle, ideaDescription, likeCount, commentCount, createdAt, tags, r_id, user_id }) => {

    interface Comment {
        _id: string; // Unique ID for the comment
        comment: string; // The comment text
        created_at: string; // Timestamp of comment creation
        r_id: string; // Related resolution ID
        updated_at: string; // Timestamp of the last update
        user_id: string; // ID of the user who wrote the comment
        user_name: string; // Name of the user who wrote the comment
    }

    const [liked, setLiked] = useState<boolean>(false);
    const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState<boolean>(false);
    const [comments, setComments] = useState<Comment[]>([]);

    // Toggle the drawer open or close
    const toggleDrawer = (newOpen: boolean, resolutionId: string) => async () => {
        setIsCommentDrawerOpen(newOpen); // Open or close the drawer

        if (!newOpen) return; // If we're closing the drawer, do nothing

        try {
            console.log("Fetching data for resolution ID:", resolutionId);

            const fetchedData = await fetchResolutionById(resolutionId); // Fetch the resolution data by ID
            console.log(fetchedData);
            console.log(fetchedData.resolution.comments);

            console.log(comments);
            // Assuming the fetched data contains a "comments" field

            setComments(fetchedData.resolution.comments);// Set comments from fetched data

        } catch (error) {
            console.error("Error fetching resolution data:", error); // Log error if API fails
        }
    };

    const handleLikeResolution = async () => {
        await likeResolution(r_id);
    };

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#242936', color: '#f5f5f5', position: 'relative', height: "250px", p: 2, maxWidth: '400px' }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center'
                }}>
                    <Avatar alt={ideaTitle} src="/path-to-name" sx={{
                        width: 23,
                        height: 23,
                    }} />
                    <h3>{ideaTitle}</h3>
                </Box>
                <Typography
                    variant="body1"
                    sx={{
                        height: "140px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitBoxOrient: "vertical",
                        whiteSpace: "normal",
                        display: "-webkit-box", // Use flex container for ellipsis in multiple lines
                        WebkitLineClamp: 6,
                        my: 2,
                        color: "#f2f2f2"
                    }}
                >{ideaDescription}</Typography>
            </Box>

            <Box sx={{
                display: 'flex',
                justifyContent: 'start',
                flexDirection: 'column',
            }}>
                <Box sx={{ display: 'flex' }}>
                    {tags.map((tag, idx) => (
                        <Box key={idx} sx={{ display: 'flex', gap: '2px', fontSize: '12px' }}>
                            {tag}
                        </Box>
                    ))}
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    height: '50px'
                }}>
                    <Box sx={{
                        display: 'flex',
                        width: '100%',
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={() => handleLikeResolution()} sx={{ color: liked ? 'primary.main' : '#fff' }}>
                                <ThumbUpIcon />
                            </IconButton>
                            <Typography>{likeCount}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={toggleDrawer(true, r_id)}>
                            <IconButton sx={{ color: '#fff' }}>
                                <CommentIcon />
                            </IconButton>
                            <Typography>{commentCount}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {convertTimeToDaysAgo(createdAt)}
                    </Box>
                </Box>
            </Box>

            {
                isCommentDrawerOpen &&
                <CommentDrawer
                    isCommentDrawerOpen={isCommentDrawerOpen}
                    setIsCommentDrawerOpen={setIsCommentDrawerOpen}
                    name={ideaTitle}
                    resolution={ideaDescription}
                    likeCount={likeCount}
                    commentCount={commentCount}
                    createdAt={createdAt}
                    tags={tags}
                    r_id={r_id}
                    comments={comments}
                    user_id={user_id}
                />
            }
        </Card >
    );
};

export default ResolutionCard;
