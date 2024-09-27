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
      className += " border-4 border-yellow-400";
    }
    return className;
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-lg w-full">
      <h2 className="text-xl font-bold mb-4">{text}</h2>
      <div className="flex justify-between w-full">
        {/* Room 1 */}
        <div className="flex flex-col items-center w-1/2">
          <h3 className="text-lg font-semibold mb-2">Room 1</h3>
          {players
            .filter((player) => player.Room[state] === 1)
            .map((player, index) => (
              <div
                key={index}
                className={`py-2 px-4 text-white rounded-md mb-2 ${getPlayerClassName(
                  player
                )}`}
              >
                {player.name} - {player.role}
              </div>
            ))}
        </div>
        {/* Room 2 */}
        <div className="flex flex-col items-center w-1/2">
          <h3 className="text-lg font-semibold mb-2">Room 2</h3>
          {players
            .filter((player) => player.Room[state] === 2)
            .map((player, index) => (
              <div
                key={index}
                className={`py-2 px-4 text-white rounded-md mb-2 ${getPlayerClassName(
                  player
                )}`}
              >
                {player.name} - {player.role}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ResultBox;
