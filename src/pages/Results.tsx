import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import ResultBox from "../components/ResultBox";

interface Player {
  name: string;
  team: string;
  role: string;
  Room: number[];
}

interface GameData {
  players: Record<string, Player>;
  gameStatus: string;
}

interface LocationState {
  data: GameData;
}

const Results: React.FC = () => {
  const { pin } = useParams<{ pin: string }>();
  const location = useLocation();
  const { data: gameData } = location.state as LocationState;
  const navigate = useNavigate();

  const determineWinner = () => {
    const bomber = Object.values(gameData.players).find(
      (player) => player.role === "Bomber"
    );
    const president = Object.values(gameData.players).find(
      (player) => player.role === "President"
    );

    if (!bomber || !president) {
      return "Unable to determine winner";
    }

    const bomberRoom = bomber.Room[3]; // Final state (Round 3)
    const presidentRoom = president.Room[3];

    if (bomberRoom === presidentRoom) {
      return bomberRoom === 1 ? "Red Team Wins" : "Blue Team Wins";
    } else {
      return "No team wins";
    }
  };

  const winner = determineWinner();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-center text-2xl font-bold mb-6">Game Results</h1>

      <div className="text-center bg-gray-200 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-gray-800">{winner}</h2>
      </div>

      {/* Result boxes for each stage of the game */}
      <ResultBox gameData={gameData} state={0} text="Initial Room Assignment" />
      <ResultBox gameData={gameData} state={1} text="After Round 1" />
      <ResultBox gameData={gameData} state={2} text="After Round 2" />
      <ResultBox gameData={gameData} state={3} text="Final State" />

      <Button onClick={() => navigate("/")} text="End Game" color="red" />
    </div>
  );
};

export default Results;
