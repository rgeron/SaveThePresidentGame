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
    [key: number]: { top: number; left: number };
  }>({});

  useEffect(() => {
    const updatePositions = () => {
      const newPositions = players.reduce((acc, _, index) => {
        acc[index] = {
          top: Math.random() * 80, // Random top position within the div
          left: Math.random() * 80, // Random left position within the div
        };
        return acc;
      }, {} as { [key: number]: { top: number; left: number } });

      setPositions(newPositions);
    };

    const intervalId = setInterval(updatePositions, 2000); // Update positions every 2 seconds

    return () => clearInterval(intervalId);
  }, [players]);

  return (
    <div className="relative text-center border-2 rounded-lg p-6 m-6 bg-gray-800 bg-opacity-80 shadow-lg h-64 w-full">
      <h2 className="mb-4 text-3xl font-Montserrat font-bold text-white">
        You are in ROOM {roomNumber} with
      </h2>
      {players.map((player, index) => (
        <div
          key={index}
          className="absolute bg-black text-white rounded-md font-Montserrat font-medium transition-transform transform hover:scale-110 p-2"
          style={{
            top: `${positions[index]?.top || 0}%`,
            left: `${positions[index]?.left || 0}%`,
            transition: "top 1s ease, left 1s ease", // Smooth transition
          }}
        >
          {player.name}
        </div>
      ))}
    </div>
  );
};

export default RoomInfo;
