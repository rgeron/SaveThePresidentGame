import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Make sure to import your Firebase config
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
  const location = useLocation();
  const { data: gameData } = location.state as LocationState;
  const { pin } = useParams<{ pin: string }>(); // Get the game pin from the route parameters
  const navigate = useNavigate();

  // Find the bomber and president players
  const bomber = Object.values(gameData.players).find(
    (player) => player.role === "The Bomber"
  );
  const president = Object.values(gameData.players).find(
    (player) => player.role === "The President"
  );

  // Get their room numbers in the final state (round 3)
  const bomberRoom = bomber?.Room[3];
  const presidentRoom = president?.Room[3];

  // Determine the winner based on their final rooms
  const determineWinner = () => {
    if (!bomber || !president) {
      return {
        winner: "Error",
        resultText:
          "Unable to determine winner: Bomber or President is missing.",
      };
    }

    if (bomberRoom === presidentRoom) {
      return {
        winner: "Red",
        resultText: "Red Team wins!",
      };
    } else {
      return {
        winner: "Blue",
        resultText: "Blue Team wins!",
      };
    }
  };

  const { winner, resultText } = determineWinner();

  // Set the background color based on the winner
  const backgroundColor =
    winner === "Blue"
      ? "bg-blue-600"
      : winner === "Red"
      ? "bg-red-700"
      : "bg-gray-50";

  // Handle ending the game
  const handleEndGame = async () => {
    if (pin) {
      const gameRef = doc(db, "games", pin);

      try {
        // Delete the game document from Firestore
        await deleteDoc(gameRef);
        console.log("Game document deleted successfully.");

        // Navigate back to the home screen
        navigate("/");
      } catch (error) {
        console.error("Error deleting game document: ", error);
      }
    }
  };

  return (
    <div className={`p-6 min-h-screen ${backgroundColor} text-center`}>
      <div className="text-center p-4 rounded-lg mb-6">
        <h2 className="text-5xl text-white font-zcool">{resultText}</h2>
      </div>

      {/* Result boxes for each stage of the game */}
      <ResultBox gameData={gameData} state={0} text="Initial Room Assignment" />
      <ResultBox gameData={gameData} state={1} text="After Round 1" />
      <ResultBox gameData={gameData} state={2} text="After Round 2" />
      <ResultBox gameData={gameData} state={3} text="Final State" />

      {/* End Game Button */}
      <Button onClick={handleEndGame} text="END GAME" color="red" />
    </div>
  );
};

export default Results;
