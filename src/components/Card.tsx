import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";

interface CardProps {
  team: string;
  role: string;
}

const Card: React.FC<CardProps> = ({ team, role }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Team-based classes for colors
  const isBlueTeam = team === "Blue";
  const roleClass = isBlueTeam ? "w-1/5 bg-blue-300" : "w-1/5 bg-red-400";
  const cardFrontClass = isBlueTeam ? "w-4/5 bg-blue-500" : "w-4/5 bg-red-600";

  // Circles on the front, with team-based colors
  const circleColor = isBlueTeam ? "bg-blue-300" : "bg-red-400";
  const cardFrontCircles = (
    <>
      <div
        className={`absolute top-1/4 left-1/4 w-16 h-16 rounded-full ${circleColor} opacity-50`}
      ></div>
      <div
        className={`absolute bottom-1/3 right-1/4 w-10 h-10 rounded-full ${circleColor} opacity-40`}
      ></div>
    </>
  );

  // Card back with dark grey and lighter grey circles
  const cardBackClass = "relative bg-gray-800 text-white";
  const cardBackCircles = (
    <>
      <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-gray-500 opacity-50"></div>
      <div className="absolute top-2/3 right-1/4 w-12 h-12 rounded-full bg-gray-600 opacity-40"></div>
      <div className="absolute bottom-1/4 right-1/3 w-16 h-16 rounded-full bg-gray-400 opacity-30"></div>
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
          className={`${roleClass} text-white flex items-center justify-center`}
        >
          <p className="rotate-90">{role}</p>
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
