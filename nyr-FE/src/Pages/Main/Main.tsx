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
                <Box display="flex" flexDirection="column" gap={2} p={2}>
                    {cards.map((card, ind) => (
                        <div key={ind} className="card-item">
                            <ResolutionCard
                                ideaTitle={"xyz"}
                                ideaDescription={card.resolution}
                                likeCount={card.like_count}
                                commentCount={card.comment_count}
                                createdAt={card.created_at}
                            />
                        </div>
                    ))}
                </Box>
            </InfiniteScroll>
        </div>
    );
};

export default Main;
