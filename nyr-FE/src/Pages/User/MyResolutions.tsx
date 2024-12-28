import { Box, Divider, Typography } from '@mui/material';
import ResolutionCard from '../../Components/Card/ResolutionCard';
import { useEffect, useState } from 'react';
import { fetchMyResolutions } from '../../services/api';
import { useAuth } from '../../Context/AuthContext';

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
    isLiked: boolean;
}

const MyResolutions = () => {
    const [cards, setCards] = useState<Resolution[]>([]);
    const { user } = useAuth();

    const loadCards = async () => {
        try {
            const data = await fetchMyResolutions();
            setCards(data.resolutions);
        } catch (error) {
            console.error("Failed to load cards:", error);
        }
    };

    useEffect(() => {
        loadCards();
    }, []);

    return (
        <div style={{
            margin: '50px 10vw'
        }}>
            <Typography variant='h4' sx={{ color: "#fff" }}>
                My resolutions
            </Typography>
            <div className="card-container">
                <Box
                    display="grid"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    gap={2}
                    justifyContent={cards.length === 1 ? "center" : "start"}
                    justifyItems={cards.length === 1 ? "center" : "stretch"}
                >
                    {cards?.map((card, index) => (
                        <Box
                            key={card._id}
                            gridColumn={cards.length === 2 && index === 1 ? "span 1" : "auto"}
                            flex="1"
                            minWidth="300px"
                        >
                            <ResolutionCard
                                ideaTitle={user?.name || "Unknown User"}
                                ideaDescription={card.resolution || "No resolution provided"}
                                likeCount={card.like_count}
                                commentCount={card.comment_count}
                                createdAt={card.created_at}
                                tags={card.tags}
                                r_id={card._id}
                                hasLiked={card.isLiked}
                            />
                        </Box>
                    ))}
                </Box>
            </div>
        </div >
    )
}

export default MyResolutions;