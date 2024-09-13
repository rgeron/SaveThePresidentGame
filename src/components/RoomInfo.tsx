import React from "react";

interface Player {
  name: string;
}

interface RoomInfoProps {
  roomNumber: number;
  players: Player[];
}

const RoomInfo: React.FC<RoomInfoProps> = ({ roomNumber, players }) => {
  return (
    <div className=" text-center border-2 rounded-lg p-6 m-6 bg-gray-800 bg-opacity-80 shadow-lg">
      <h2 className="mb-4 text-3xl font-Montserrat font-bold text-white">
        You are in ROOM {roomNumber}
      </h2>
      <p className="font-Montserrat font-semibold mb-3 text-gray-300">
        People in the room
      </p>
      <ul className="flex flex-wrap justify-center list-none p-0 m-0">
        {players.map((player, index) => (
          <li
            key={index}
            className="m-2 px-4 py-2 bg-black text-white rounded-md font-Montserrat font-medium transition-transform transform hover:scale-105"
          >
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomInfo;
