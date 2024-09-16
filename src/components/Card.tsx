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

  // Team-based classes for colors
  const isBlueTeam = team === "Blue";
  const roleClass = isBlueTeam ? "w-1/3 bg-blue-400" : "w-1/3 bg-red-600";
  const cardFrontClass = isBlueTeam ? "w-4/5 bg-blue-700" : "w-4/5 bg-red-800";

  // Circles on the front, with team-based colors
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

  // Card back with dark grey and lighter grey circles
  const cardBackClass = "relative bg-gray-500 text-white";
  const cardBackCircles = (
    <>
      <div className="absolute top-9 left-1/2 w-20 h-20 rounded-full bg-gray-300 "></div>
      <div className="absolute top-5 left-9 w-12 h-12 rounded-full bg-gray-300 "></div>
      <div className="absolute bottom-1/4 right-1/3 w-16 h-16 rounded-full bg-gray-300 "></div>
    </>
  );

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      {/* Front of the card */}
      <div
        className="w-48 h-72 border-2 border-transparent rounded-lg shadow-lg flex cursor-pointer transition-transform duration-300 hover:scale-105"
        onClick={handleFlip}
      >
        {/* Left side with role */}
        <div
          className={`${roleClass} text-white flex font-semibold text-4xl items-center justify-center`}
        >
          <p className="-rotate-90 whitespace-nowrap text-ellipsis">{role}</p>
        </div>

        {/* Right side with team-based background and circles */}
        <div
          className={`${cardFrontClass} relative flex items-center justify-center text-white`}
        >
          {cardFrontCircles}
        </div>
      </div>

      {/* Back of the card */}
      <div
        className={`w-48 h-72 border-2 border-transparent rounded-lg shadow-lg flex cursor-pointer transition-transform duration-300 hover:scale-105 ${cardBackClass}`}
        onClick={handleFlip}
      >
        {cardBackCircles}
      </div>
    </ReactCardFlip>
  );
};

export default Card;
