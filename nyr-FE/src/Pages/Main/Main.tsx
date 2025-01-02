import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { fetchResolutions, postResolutions } from "../../services/api";
import ResolutionCard from "../../Components/Card/ResolutionCard";
import "./Main.css";
import HourglassLoader from "../../Components/Loader/Loader";
import AddIcon from '@mui/icons-material/Add';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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
    hasLiked: boolean;
}

const Main = () => {
    const { user } = useAuth();
    const [cards, setCards] = useState<Resolution[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedSort, setSelectedSort] = useState<string>("Trending");
    const open = Boolean(anchorEl);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRedirectLoginModalOpen, setRedirectLoginModalOpen] = useState(false);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleOpen = () => {
        if (user) {
            setIsModalOpen(true);
        } else {
            setRedirectLoginModalOpen(true);
        }
    };
    const handleClose = () => setIsModalOpen(false);

    const handleSubmitResolution = async (resolution: { resolution: string; tags: string[] }) => {
        await postResolutions(resolution);
        window.location.reload();
    };
    const loadCards = async (sort: string = "likes", reset: boolean = false) => {
        try {
            if (reset) {
                setCards([]);
                setPage(1);
                setHasMore(true);
            }

            const currentPage = reset ? 1 : page;
            const data = await fetchResolutions(currentPage, 10, sort);

            if (!data || data.resolutions.length === 0) {
                setHasMore(false);
                return;
            }

            setCards((prevResolutions) => [...prevResolutions, ...data.resolutions]);
            if (data.resolutions.length < 10) {
                setHasMore(false);
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
            <Box display="flex" justifyContent="space-between" gap={3}>
                <Button
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        color: "black",
                        background: "#fff",
                        fontSize: { xs: '12px', md: '16px' },
                        fontWeight: 600
                    }}
                    onClick={handleOpen}
                >
                    <AddIcon fontSize="small" sx={{ marginRight: { xs: "3px", md: "15px" } }} />
                    ADD RESOLUTION
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        color: "#fff",
                        background: "inherit",
                        fontSize: { xs: '12px', md: '16px' },
                        fontWeight: 600,
                        border: "1px solid #fff"
                    }}
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleMenuOpen}
                >
                    <SwapVertIcon fontSize="small" sx={{ marginRight: { xs: "3px", md: "15px" } }} />
                    {selectedSort}
                </Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                    sx={{
                        '& .MuiPaper-root': {
                            backgroundColor: '#242936',
                            color: '#fff',
                            minWidth: 130
                        }
                    }}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }}
                >
                    <MenuItem sx={{ fontSize: 16, fontWeight: 600 }} onClick={() => {
                        setSelectedSort("Trending");
                        setAnchorEl(null);
                        loadCards("likes", true);  // Pass `true` to reset the state
                    }}>
                        <WhatshotIcon fontSize='small' sx={{ paddingRight: '5px' }} />
                        Trending
                    </MenuItem>
                    <MenuItem sx={{ fontSize: 16, fontWeight: 600 }} onClick={() => {
                        setSelectedSort("Recently Added");
                        setAnchorEl(null);
                        loadCards("created_at", true); // Pass `true` to reset the state
                    }}>
                        <AccessTimeIcon fontSize='small' sx={{ paddingRight: '5px' }} />
                        Recently Added
                    </MenuItem>
                </Menu>
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
                        <Typography sx={{ mt: 8 }} variant="body1" align="center" color="textSecondary">
                            &#128104; That's all folks! You've reached the end.
                        </Typography>
                    }
                    style={{
                        padding: '0px'
                    }}
                >
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
                                    ideaTitle={card.user_name || "Unknown User"}
                                    ideaDescription={card.resolution || "No resolution provided"}
                                    likeCount={card.like_count}
                                    commentCount={card.comment_count}
                                    createdAt={card.created_at}
                                    tags={card.tags}
                                    r_id={card._id}
                                    hasLiked={card.hasLiked}
                                />
                            </Box>
                        ))}
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
        </div>
    );
};

export default Main;
