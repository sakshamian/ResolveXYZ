import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, Typography } from "@mui/material";
import { fetchResolutions, ResolutionData } from "../../services/api";
import ResolutionCard from "../../Components/Card/ResolutionCard";
import "./Main.css";
import HourglassLoader from "../../Components/Loader/Loader";

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

interface InfiniteScrollProps {
    limit: number;
}

const Main = () => {
    const [cards, setCards] = useState<Resolution[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const loadCards = async () => {

        try {
            const data = await fetchResolutions(page);
            setCards((prevResolutions) => [...prevResolutions, ...data.resolutions]);
            setHasMore(data.has_more);
        } catch (error) {
            console.error("Failed to load cards:", error);
        }
    };

    useEffect(() => {
        loadCards();
    }, []);

    return (
        <div className="card-container">
            <InfiniteScroll
                dataLength={cards.length}
                next={loadCards}
                hasMore={hasMore}
                loader={
                    <Box display="flex" justifyContent="center" px={5} my={5}>
                        <HourglassLoader />
                    </Box>
                }
                endMessage={
                    <Typography variant="body2" align="center" color="textSecondary">
                        You have reached the end.
                    </Typography>
                }
            >
                 <Box
            display="flex"
            flexWrap="wrap"
            gap={2}
            p={2}
            justifyContent="space-between"
        >
            {cards.map((card, ind) => {
                console.log(card);
                return (
                    <Box
                        key={ind}
                        flex="1 1 calc(33.333% - 16px)" // This ensures three cards per row with space between them
                        minWidth="300px" // Minimum width to avoid items being too small
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
            </InfiniteScroll>
        </div>
    );
};

export default Main;
