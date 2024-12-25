import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, Button, Typography } from "@mui/material";
import { fetchResolutions, postResolutions } from "../../services/api";
import ResolutionCard from "../../Components/Card/ResolutionCard";
import "./Main.css";
import HourglassLoader from "../../Components/Loader/Loader";
import AddIcon from '@mui/icons-material/Add';
import ResolutionModal from "../../Components/Modal/ResolutionModal";
import { useAuth } from "../../Context/AuthContext";
import RedirectToLoginModal from "../../Components/Modal/RedirectToLoginModal";

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
    hasLiked:boolean;
}

const Main = () => {
    const { user } = useAuth();
    const [cards, setCards] = useState<Resolution[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRedirectLoginModalOpen, setRedirectLoginModalOpen] = useState(false);

    const handleOpen = () => {
        if (user) {
            setIsModalOpen(true);
        } else {
            setRedirectLoginModalOpen(true);
        }
    }
    const handleClose = () => setIsModalOpen(false);

    const handleSubmitResolution = (resolution: { resolution: string; tags: string[] }) => {
        postResolutions(resolution);
    };

    const loadCards = async () => {
        try {
            const data = await fetchResolutions(page);

            if (!data || data.resolutions.length === 0) {
                setHasMore(false); // Stop fetching if no more data
                return;
            }

            setCards((prevResolutions) => [...prevResolutions, ...data.resolutions]);
            console.log(data)
            if (data.resolutions.length < 10) {
                setHasMore(false); // No more items to fetch
            }
            setPage((prevPage) => prevPage + 1);
        } catch (error) {
            setHasMore(false);
            console.error("Failed to load cards:", error);
        }
    };

    useEffect(() => {
        loadCards();
    }, []);

    return (
        <div className="main-container">
            <Box display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    sx={{
                        // display
                        textTransform: "none",
                        color: "black",
                        background: "#fff"
                    }}
                    onClick={handleOpen}
                >
                    <AddIcon fontSize="small" sx={{ marginRight: "15px" }} />
                    Add Resolution
                </Button>
            </Box>
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
                        <Typography variant="body1" align="center" color="textSecondary">
                            &#128104; You saw all the resolutions.
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
                        {cards?.map((card, ind) => {
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
                                        hasLiked={card.hasLiked}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                </InfiniteScroll>
            </div>
            <ResolutionModal
                open={isModalOpen}
                onClose={handleClose}
                onSubmit={handleSubmitResolution}
            />
            <RedirectToLoginModal
                open={isRedirectLoginModalOpen}
                onClose={() => setRedirectLoginModalOpen(false)}
                heading="Please login to add resolutions!"
            />
        </div >
    );
};

export default Main;
