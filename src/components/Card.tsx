import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";

interface CardProps {
  team: string;
  role: string;
}

const Card: React.FC<CardProps> = ({ team, role }) => {
  const [isFlipped, setIsFlipped] = useState(true);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const isBlueTeam = team === "Blue";
  const roleClass = isBlueTeam ? "w-1/3 bg-blue-400" : "w-1/3 bg-red-600";
  const cardFrontClass = isBlueTeam ? "w-4/5 bg-blue-700" : "w-4/5 bg-red-800";
  const circleColor = isBlueTeam ? "bg-blue-400" : "bg-red-600";

  const cardFrontCircles = (
    <>
      <div
        className={`absolute top-4 right-5 w-16 h-16 rounded-full ${circleColor}`}
      ></div>
      <div
        className={`absolute top-28 left-5 w-6 h-6 rounded-full ${circleColor}`}
      ></div>
      <div
        className={`absolute top-32 left-16 w-8 h-8 rounded-full ${circleColor}`}
      ></div>
      <div
        className={`absolute bottom-14 left-5 w-10 h-10 rounded-full ${circleColor}`}
      ></div>
      <div
        className={`absolute bottom-7 right-5 w-8 h-8 rounded-full ${circleColor}`}
      ></div>
    </>
  );

  const cardBackClass = "relative bg-gray-500 text-white";
  const cardBackCircles = (
    <>
      <div className="absolute top-9 left-1/2 w-20 h-20 rounded-full bg-gray-300"></div>
      <div className="absolute top-5 left-9 w-12 h-12 rounded-full bg-gray-300"></div>
      <div className="absolute bottom-1/4 right-1/3 w-16 h-16 rounded-full bg-gray-300"></div>
    </>
  );

  const commonCardClasses =
    "w-48 h-72 shadow-lg flex cursor-pointer transition-transform duration-3000";

  return (
    <div className="card-container mb-5 " style={{ perspective: "1000px" }}>
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        {/* Front of the card */}
        <div className={commonCardClasses} onClick={handleFlip}>
          <div
            className={`${roleClass} text-white flex font-semibold text-4xl items-center justify-center `}
          >
            <p className="-rotate-90 whitespace-nowrap">{role}</p>
          </div>
          <div
            className={`${cardFrontClass} relative flex items-center justify-center text-white`}
          >
            {cardFrontCircles}
          </div>
        </div>

        {/* Back of the card */}
        <div
          className={`${commonCardClasses} ${cardBackClass}`}
          onClick={handleFlip}
        >
          {cardBackCircles}
        </div>
      </ReactCardFlip>
    </div>
  );
};

export default Card;
