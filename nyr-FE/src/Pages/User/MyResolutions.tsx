import { Box } from '@mui/material';
import ResolutionCard from '../../Components/Card/ResolutionCard';
import { useEffect, useState } from 'react';
import { fetchMyResolutions } from '../../services/api';

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

const MyResolutions = () => {
    const [cards, setCards] = useState<Resolution[]>([]);

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
            margin: '40px 20px'
        }}>
            <div className="card-container">
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
                                flex="1 1 calc(33.333% - 16px)"
                                minWidth="300px"
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
            </div>
        </div >
    )
}

export default MyResolutions;