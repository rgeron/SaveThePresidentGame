import React from 'react';

interface Player {
  name: string;
  Room: number[];
  team: string;
  role: string;
}

interface ResultsBoxProps {
  players: Record<string, Player>;
  text: string;
  state: number; // 0 for initial distribution, 1 for after round 1, 2 for after round 2, 3 for final state
}

const ResultsBox: React.FC<ResultsBoxProps> = ({ players, text, state }) => {
  const roomAssignments = {
    Room1: [],
    Room2: [],
  };

  // Assign players to their respective rooms based on the specified state
  Object.values(players).forEach((player) => {
    if (player.Room[state] === 1) {
      roomAssignments.Room1.push(player);
    } else if (player.Room[state] === 2) {
      roomAssignments.Room2.push(player);
    }
  });

  const renderPlayer = (player: Player) => {
    const isBomberOrPresident = player.role === 'bomber' || player.role === 'president';
    const playerClass = `inline-block py-1 px-3 rounded-full text-white font-medium ${
      player.team === 'red' ? 'bg-red-500' : 'bg-blue-500'
    } ${isBomberOrPresident ? 'border-4 border-gold' : ''}`;

    return (
      <li key={player.name} className="mt-2">
        <span className={playerClass}>{player.name}</span>
      </li>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">{text}</h2>
      <div className="flex justify-between">
        {/* Room 1 */}
        <div className="flex flex-col items-center w-1/2">
          <h3 className="font-semibold text-gray-600 mb-2">Room 1</h3>
          <ul className="list-none p-0">
            {roomAssignments.Room1.map(renderPlayer)}
          </ul>
        </div>

        {/* Room 2 */}
        <div className="flex flex-col items-center w-1/2">
          <h3 className="font-semibold text-gray-600 mb-2">Room 2</h3>
          <ul className="list-none p-0">
            {roomAssignments.Room2.map(renderPlayer)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultsBox;
