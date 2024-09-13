import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";

function HomePage() {
  const navigate = useNavigate();
  const [pin, setPin] = useState<string>("");

  const generatePIN = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  const createGame = async () => {
    try {
      const Gpin = generatePIN();

      const gameRef = doc(db, "games", Gpin);
      await setDoc(gameRef, {
        gameStatus: "Not started",
        game_info: {
          created_at: serverTimestamp(),
        },
        players: {
          creator: {}, // Create creator player immediately
        },
      });

      navigate(`/waiting/${Gpin}`, {
        state: { mode: "create", pin: Gpin, playerKey: "creator" },
      });
    } catch (error) {
      console.error("Error creating the game:", error);
    }
  };

  const pinExists = async (pin: string) => {
    try {
      const gameRef = doc(db, "games", pin);
      const gameDoc = await getDoc(gameRef);
      return gameDoc.exists() ? gameDoc.data() : null;
    } catch (error) {
      console.error("Error checking PIN existence:", error);
      return null;
    }
  };

  const handleJoinWithPin = async () => {
    const gameData = await pinExists(pin);
    if (gameData) {
      const players = gameData.players || {};
      const joinerNumber = Object.keys(players).length + 1;
      const playerKey = `joiner${joinerNumber}`;

      const gameRef = doc(db, "games", pin);
      await updateDoc(gameRef, {
        [`players.${playerKey}`]: {}, // Create joiner player immediately
      });

      navigate(`/waiting/${pin}`, {
        state: { mode: "join", pin: pin, playerKey },
      });
    } else {
      alert("Invalid PIN");
    }
  };

  return (
    <div className="bg-gradient-bg flex flex-col items-center justify-start h-screen p-8">
      <h1 className="font-Montserrat text-4xl text-black-800 font-bold m-5">
        2 ROOMS 1 BOOM
      </h1>
      <h2 className="font-Montserrat font-bold text-2xl text-black mb-4 underline underline-offset-2">
        Game Overview
      </h2>
      <ul className="font-Montserrat list-disc font-semibold text-left max-w-lg text-lg mb-4 px-4 text-black-950">
        <li className="mb-2">There are 2 teams in 2 rooms.</li>
        <li className="mb-2">
          Players are equally distributed between the 2 rooms and each player is
          randomly dealt a facedown character card.
        </li>
        <li className="mb-2">
          There are 3 rounds, each round shorter than the previous one.
        </li>
        <li>
          At the end of each round, the hostages selected by the leaders will be
          traded into opposing rooms.
        </li>
      </ul>
      <div className="flex flex-col items-center mt-6">
        <button
          onClick={createGame}
          className="bg-black text-white font-Montserrat font-medium rounded-lg px-6 py-4 text-lg mb-4 transition-colors duration-300 border-2 hover:border-white hover:scale-105"
        >
          Create a Game
        </button>
        <div className="flex items-center mt-8">
          <input
            type="text"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="bg-black text-white font-Montserrat font-medium rounded-lg px-4 py-2 text-lg mb-4 transition-colors duration-300 border-2 hover:border-white hover:scale-105"
          />
          <button
            onClick={handleJoinWithPin}
            className="bg-black text-white font-Montserrat font-medium rounded-lg px-4 py-2 ml-5 text-lg mb-4 transition-colors duration-300 border-2 hover:border-white hover:scale-105"
          >
            Join game
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
