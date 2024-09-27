import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebaseConfig";

import Button from "../components/Button";
import ResultsBox from "../components/ResultBox";

interface Player {
  name: string; // Assuming 'name' property is part of Player interface
  Room: number[];
  team: string;
  role: string;
}

interface GameData {
  players: Record<string, Player>;
  gameStatus: string;
}

interface LocationState {
  playerKey: string;
  playerData: Player;
  data: GameData;
}

const Results: React.FC = () => {
  const { pin } = useParams<{ pin: string }>();
  const location = useLocation();
  const { data: gameData } = location.state as LocationState;
  const navigate = useNavigate();

  useEffect(() => {
    const gameRef = doc(db, "games", pin as string);

    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      const data = snapshot.data();
      if (data && data.gameStatus === "finished") {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate, pin]);

  const handleEndGame = async () => {
    await updateDoc(doc(db, "games", pin as string), {
      gameStatus: "finished",
    });
    navigate("/");
  };

  const determineWinner = (players: Record<string, Player>) => {
    const bomber = Object.values(players).find(
      (player) => player.role === "bomber"
    );
    const president = Object.values(players).find(
      (player) => player.role === "president"
    );

    // Ensure both bomber and president are found
    if (!bomber || !president) {
      return "Unable to determine winner";
    }

    // Check the room number for both the bomber and president in the last round
    const bomberRoom = bomber.Room[3]; // Assuming round 3 is the last round
    const presidentRoom = president.Room[3];

    if (bomberRoom === 1 && presidentRoom === 1) {
      return "Team Red";
    } else if (bomberRoom === 2 && presidentRoom === 2) {
      return "Team Blue";
    } else {
      return "No team wins";
    }
  };

  if (!gameData) {
    return <div>Loading...</div>;
  }

  const winner = determineWinner(gameData.players);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

  <p>{JSON.stringify(gameData)}</p>



      <h1 className="text-center text-2xl font-bold mb-6">Game Results</h1>

      <div className="text-center bg-gray-200 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          {winner} won the game!
        </h2>
      </div>

      {/* ResultsBox for each round */}
      {[0, 1, 2, 3].map((round) => (
        <ResultsBox
          key={round}
          players={gameData.players}
          text={
            round === 0 ? "Initial Room Assignment" : `After Round ${round}`
          }
          state={round}
        />
      ))}

      {location.state.playerKey === "creator" && (
        <Button onClick={handleEndGame} text="End Game" color="red" />
      )}
    </div>
  );
};

export default Results;
