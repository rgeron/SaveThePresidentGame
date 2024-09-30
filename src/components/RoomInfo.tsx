import React, { useEffect, useState } from "react";

interface Player {
  name: string;
}

interface RoomInfoProps {
  roomNumber: number;
  players: Player[];
}

const RoomInfo: React.FC<RoomInfoProps> = ({ roomNumber, players }) => {
  const [positions, setPositions] = useState<{
    [key: number]: {
      top: number;
      left: number;
      directionX: number;
      directionY: number;
    };
  }>({});

  useEffect(() => {
    // Initialize positions with directions (velocity) for X and Y
    const initializePositions = () => {
      const initialPositions = players.reduce((acc, _, index) => {
        acc[index] = {
          top: Math.random() * 60, // Start between 20% - 80% for top
          left: Math.random() * 80, // Start between 0% - 80% for left
          directionX: Math.random() > 0.5 ? 1 : -1, // Random initial X direction (left/right)
          directionY: Math.random() > 0.5 ? 1 : -1, // Random initial Y direction (up/down)
        };
        return acc;
      }, {} as { [key: number]: { top: number; left: number; directionX: number; directionY: number } });
      setPositions(initialPositions);
    };

    initializePositions();

    const updatePositions = () => {
      setPositions((prevPositions) => {
        const newPositions = { ...prevPositions };

        players.forEach((_, index) => {
          let { top, left, directionX, directionY } = newPositions[index];

          // Update position based on current direction
          top += directionY * 0.5; // Adjust speed by changing the multiplier
          left += directionX * 0.5;

          // Bounce off the top and bottom edges (staying within 20%-80%)
          if (top <= 0 || top >= 60) {
            directionY *= -1; // Reverse direction
          }

          // Bounce off the left and right edges (staying within 0%-80%)
          if (left <= 0 || left >= 80) {
            directionX *= -1; // Reverse direction
          }

          // Update the new position and direction
          newPositions[index] = { top, left, directionX, directionY };
        });

        return newPositions;
      });
    };

    const intervalId = setInterval(updatePositions, 30); // Update positions frequently for smooth movement

    return () => clearInterval(intervalId);
  }, [players]);

  return (
    <div className="flex flex-col w-full text-center items-center">
      <h2 className=" relative text-5xl font-Montserrat font-bold text-black underline">
        ROOM {roomNumber}
      </h2>
      <div className="p-2 m-3 bg-blue-600 bg-opacity-80 h-48 w-3/4 rounded-xl ">
        <div className="relative h-full">
          {/* Ensure this div takes up remaining space */}
          {players.map((player, index) => (
            <div
              key={index}
              className="absolute text-white text-xl font-Montserrat font-bold transition-transform transform hover:scale-110 p-3"
              style={{
                top: `${positions[index]?.top || 0}%`,
                left: `${positions[index]?.left || 0}%`,
                transition: "top 0.05s linear, left 0.05s linear", // Smooth movement
              }}
            >
              {player.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;
