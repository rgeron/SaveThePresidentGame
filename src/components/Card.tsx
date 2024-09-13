import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";

interface CardProps {
  team: string; // Change from 'Blue' | 'Red' to string if it can accept other values
  role: string;
}

const Card: React.FC<CardProps> = ({ team, role }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const cardBackClass =
    team === "Blue"
      ? "bg-gradient-to-br from-blue-600 via-blue-400 to-blue-200"
      : "bg-gradient-to-br from-red-600 via-red-400 to-red-200";

  const isSpecialRole = role === "Bomber" || role === "President";

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      {/* Front of the card */}
      <div
        className="w-48 h-72 border-2 border-transparent bg-black text-white rounded-lg shadow-lg flex items-center justify-center text-center cursor-pointer transition-transform duration-300 hover:scale-105"
        onClick={handleFlip}
      >
        <h3 className="text-lg font-Montserrat font-semibold">Your Role</h3>
      </div>

      {/* Back of the card */}
      <div
        className={`w-48 h-72 border-2 border-transparent ${cardBackClass} rounded-lg shadow-lg flex flex-col justify-center text-center text-white cursor-pointer transition-transform duration-300 hover:scale-105`}
        onClick={handleFlip}
      >
        <h3 className="flex items-center justify-center text-lg font-Montserrat font-semibold">
          {isSpecialRole && <span className="mr-2 text-yellow-400">⭐</span>}
          {role || "Unknown"}
        </h3>
        {team && role && !isSpecialRole && (
          <p className="mt-2 italic font-Montserrat">Team Member</p>
        )}
      </div>
    </ReactCardFlip>
  );
};

export default Card;
