import ResolutionCard from "../../Components/Card/ResolutionCard";
import "./Main.css";

const Main = () => {
    const cards = Array.from({ length: 15 }, (_, index) => ({
        title: `Great App Idea ${index + 1}`,
        description: 'This is a revolutionary app idea that will change the way we interact with technology.',
    }));

    return (
        <div className="card-container">
            {cards.map((card, index) => (
                <div key={index} className="card-item">
                    <ResolutionCard
                        ideaTitle={card.title}
                        ideaDescription={card.description}
                    />
                </div>
            ))}
        </div>
    );
};

export default Main;
