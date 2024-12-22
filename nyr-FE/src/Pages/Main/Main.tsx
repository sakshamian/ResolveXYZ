import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, Typography, CircularProgress } from "@mui/material";
import { fetchCards, CardData } from "../../services/api";
import ResolutionCard from "../../Components/Card/ResolutionCard";
import "./Main.css";
import ResolutionsSpinner from "../../Components/Loader/Loader";
import QuoteCarousel from "../../Components/Loader/Loader";
import HourglassLoader from "../../Components/Loader/Loader";

const Main = () => {
    const [cards, setCards] = useState<CardData[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const loadCards = async () => {
        try {
            const data = await fetchCards(page);
            if (data.length === 0) {
                setHasMore(false); // No more data to load
            } else {
                setCards((prevCards) => [...prevCards, ...data]);
                setPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.error("Failed to load cards:", error);
        }
    };

    useEffect(() => {
        loadCards();
    }, []);

    // const cards = Array.from({ length: 15 }, (_, index) => ({
    //     title: `Great App Idea ${index + 1}`,
    //     description: 'This is a revolutionary app idea that will change the way we interact with technology.',
    // }));

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
                                ideaTitle={card.title}
                                ideaDescription={card.content}
                            />
                        </div>
                    ))}
                </Box>
            </InfiniteScroll>
        </div>
    );
};

export default Main;
