import React, { useState } from 'react';
import { Typography, IconButton, Box, Card, Avatar, Chip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import { fetchResolutionById, likeResolution } from '../../services/api';
import { convertTimeToDaysAgo } from '../../utils/utils';
import CommentDrawer from '../CommentDrawer/CommentDrawer';  // Import the CommentDrawer component
import { useAuth } from '../../Context/AuthContext';
import RedirectToLoginModal from '../Modal/RedirectToLoginModal';

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


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
interface CartProps {
    ideaTitle: string;
    ideaDescription: string;
    likeCount: number;
    commentCount: number;
    createdAt: string;
    tags: string[];
    r_id: string;
    user_id: string;
    hasLiked: boolean;
}

const ResolutionCard: React.FC<CartProps> = ({ ideaTitle, ideaDescription, likeCount: initialLikeCount, commentCount, createdAt, tags, r_id, user_id, hasLiked: initialHasLiked }) => {

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

    const { user } = useAuth();

    const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState<boolean>(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isRedirectLoginModalOpen, setRedirectLoginModalOpen] = useState(false);
    const [localLikeCount, setLocalLikeCount] = useState(initialLikeCount);
    const [localHasLiked, setLocalHasLiked] = useState(initialHasLiked);


    // Toggle the drawer open or close
    const toggleDrawer = (newOpen: boolean, resolutionId: string) => async () => {
        setIsCommentDrawerOpen(newOpen); // Open or close the drawer

        if (!newOpen) return; // If we're closing the drawer, do nothing

        try {
            console.log("Fetching data for resolution ID:", resolutionId);
            const fetchedData = await fetchResolutionById(resolutionId); // Fetch the resolution data by ID
            console.log(fetchedData);
            // console.log(fetchedData.resolution.comments);
            console.log(comments);
            // Assuming the fetched data contains a "comments" field
            setComments(fetchedData.data.comments);// Set comments from fetched data
        } catch (error) {
            console.error("Error fetching resolution data:", error); // Log error if API fails
        }
    };

    const handleLikeResolution = async () => {
        if (!user) {
            setRedirectLoginModalOpen(true);
            return;
        }
        try {
            await likeResolution(r_id);
            setLocalHasLiked(!localHasLiked);
            setLocalLikeCount(prevCount => localHasLiked ? prevCount - 1 : prevCount + 1);
        } catch (error) {
            console.error("Error liking resolution:", error);
            // Revert local state if the API call fails
            setLocalHasLiked(localHasLiked);
            setLocalLikeCount(localLikeCount);
        }
    };

    const LikeButton = ({ className = '' }) => (
        <Box
            display="flex"
            alignItems="center"
            onClick={handleLikeResolution}
            sx={{ cursor: 'pointer' }}
            className={className}
        >
            {localHasLiked ? (
                <FavoriteIcon sx={{ marginRight: 1, color: "#E03673" }} />
            ) : (
                <FavoriteBorderIcon sx={{ marginRight: 1, color: "#fff" }} />
            )}
            <Typography variant="body2" fontSize="18px">{localLikeCount}</Typography>
        </Box>
    );

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#242936', color: '#f5f5f5', position: 'relative', height: "250px", p: 2, maxWidth: '400px', justifyContent: 'space-between', }}>

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
                        height: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitBoxOrient: "vertical",
                        whiteSpace: "normal",
                        display: "-webkit-box", // Use flex container for ellipsis in multiple lines
                        WebkitLineClamp: 5,
                        my: 2,
                        color: "#f2f2f2",
                        cursor: 'pointer'
                    }}
                    onClick={toggleDrawer(true, r_id)}
                >{ideaDescription}</Typography>
            </Box>

            <Box sx={{
                display: 'flex',
                gap: '20px',
                flexDirection: 'column',
            }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {tags.map((tag, index) => {
                        // Find the corresponding tag data in the availableTags array
                        const tagData = availableTags.find(item => item.tag === tag);

                        return (
                            <Chip
                                key={index}
                                label={tag}
                                sx={{
                                    height: '22px',
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

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',

                }}>
                    <Box sx={{
                        display: 'flex',
                    }}>
                        {/* Likes and Comments */}
                        <Box display="flex" alignItems="center" justifyContent="space-between" gap="10px">
                            <LikeButton />
                            <Box display="flex" alignItems="center" onClick={toggleDrawer(true, r_id)} sx={{ cursor: 'pointer' }}>
                                <CommentIcon sx={{ marginRight: 1, color: "#2196F3" }} />
                                <Typography variant="body2" fontSize="18px">{commentCount}</Typography>
                            </Box>
                        </Box>
                    </Box>
                    {/* timestamp */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', fontSize: '12px' }}>
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
                    likeCount={localLikeCount}
                    commentCount={commentCount}
                    createdAt={createdAt}
                    tags={tags}
                    r_id={r_id}
                    comments={comments}
                    hasLiked={localHasLiked}
                    LikeButton={LikeButton}
                />
            }
            <RedirectToLoginModal
                open={isRedirectLoginModalOpen}
                onClose={() => setRedirectLoginModalOpen(false)}
                heading="Please login to like resolutions!"
            />
        </Card >
    );
};

export default ResolutionCard;
