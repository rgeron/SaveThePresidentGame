import React from "react";

interface Player {
  name: string;
  team: string;
  role: string;
  Room: number[];
}

interface ResultBoxProps {
  gameData: { players: Record<string, Player> };
  state: number; // 0 = initial, 1 = after round 1, 2 = after round 2, 3 = final state
  text: string;
}

const ResultBox: React.FC<ResultBoxProps> = ({ gameData, state, text }) => {
  const players = Object.values(gameData.players);

  const getPlayerClassName = (player: Player) => {
    let className = player.team === "Red" ? "bg-red-500" : "bg-blue-500";
    if (player.role === "President" || player.role === "Bomber") {
      className += " border-8 border-yellow-300"; // Thicker border for key roles
    }
    return className;
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 shadow-lg w-full mb-5">
      <h2 className="text-4xl font-bold mb-4">{text}</h2>{" "}
      {/* Increased text size */}
      <div className="flex justify-between w-full gap-6">
        {" "}
        {/* Added gap between Room 1 and Room 2 */}
        {/* Room 1 */}
        <div className="flex flex-col items-center w-1/2 border-4 border-black p-4 h-96 overflow-auto">
          {" "}
          {/* Increased height */}
          <h3 className="text-2xl font-semibold mb-4">Room 1</h3>{" "}
          {/* Larger Room text */}
          <div className="grid grid-cols-3 gap-2 w-full">
            {" "}
            {/* 3-column grid for players, full width */}
            {players
              .filter((player) => player.Room[state] === 1)
              .map((player, index) => (
                <div
                  key={index}
                  className={`py-2 px-4 text-white rounded-md flex justify-center items-center ${getPlayerClassName(
                    player
                  )} break-words w-full`} /* Handles long names, keeps inside box */
                >
                  {player.name}
                </div>
              ))}
          </div>
        </div>
        {/* Room 2 */}
        <div className="flex flex-col items-center w-1/2 border-4 border-black p-4 h-96 overflow-auto">
          {" "}
          {/* Increased height */}
          <h3 className="text-2xl font-semibold mb-4">Room 2</h3>{" "}
          {/* Larger Room text */}
          <div className="grid grid-cols-3 gap-2 w-full">
            {" "}
            {/* 3-column grid for players, full width */}
            {players
              .filter((player) => player.Room[state] === 2)
              .map((player, index) => (
                <div
                  key={index}
                  className={`py-2 px-4 text-white rounded-md flex justify-center items-center ${getPlayerClassName(
                    player
                  )} break-words w-full`} /* Handles long names, keeps inside box */
                >
                  {player.name}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultBox;
