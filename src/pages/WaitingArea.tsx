import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import Button from "../components/Button";

interface Player {
  name: string;
  team?: string;
  role?: string;
  Room?: number[];
}

interface LocationState {
  mode: string;
  pin: string;
  playerKey: string;
}

const WaitingArea: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, pin, playerKey } = location.state as LocationState;

  const [playerName, setPlayerName] = useState<string>("");
  const [players, setPlayers] = useState<Record<string, Player>>({});

  const isCreator = mode === "create";

  useEffect(() => {
    const gameRef = doc(db, "games", pin);

    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      const data = snapshot.data();
      if (data) {
        setPlayers(data.players || {});

        if (data.gameStatus === "preparation") {
          navigate(`/preparation/${pin}`, { state: { playerKey } });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate, pin, playerKey]);

  const handleStartGame = async () => {
    try {
      const gameRef = doc(db, "games", pin);

      await updateDoc(gameRef, {
        [`players.${playerKey}.name`]: playerName, /// update the name of the creator in the code base
      });

      const gameSnap = await getDoc(gameRef);
      const gameData = gameSnap.data();

      if (!gameData) {
        throw new Error("Game data not found");
      }

      const playersObject = Object.entries(gameData.players);
      const numPlayers = playersObject.length;

      if (numPlayers < 2) {
        alert("Not enough players to start the game.");
        return;
      }

      const half = Math.ceil(numPlayers / 2);

      const shuffledPlayersforRoles = shuffleArray(playersObject);
      const blueTeam = shuffledPlayersforRoles.slice(0, half);
      const redTeam = shuffledPlayersforRoles.slice(half);

      const shuffledPlayersforRoom = shuffleArray(playersObject);
      const Room1 = shuffledPlayersforRoom.slice(0, half);
      const Room2 = shuffledPlayersforRoom.slice(half);

      const updatedPlayers = { ...gameData.players };

      blueTeam.forEach(([key, player], index) => {
        updatedPlayers[key] = {
          ...player,
          team: "Blue",
          role: index === 0 ? "President" : "Team Member",
        };
      });

      redTeam.forEach(([key, player], index) => {
        updatedPlayers[key] = {
          ...player,
          team: "Red",
          role: index === 0 ? "Bomber" : "Team Member",
        };
      });

      Room1.forEach(([key, player]) => {
        updatedPlayers[key] = {
          ...updatedPlayers[key],
          Room: [1, 1, 1, 1],
        };
      });

      Room2.forEach(([key, player]) => {
        updatedPlayers[key] = {
          ...updatedPlayers[key],
          Room: [2, 2, 2, 2],
        };
      });

      await updateDoc(gameRef, {
        players: updatedPlayers,
        gameStatus: "preparation",
      });
    } catch (error) {
      console.error("Error starting the game:", error);
      alert("Failed to start the game. Please try again.");
    }
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const playerCount = Object.keys(players).length;

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen text-center">
      {/* Blue Section for PIN Display */}
      <div className="bg-blue-600 flex items-center justify-center w-full px-8 py-4 cursor-pointer">
        <h2 className="font-sans italic font-bold text-8xl text-white">
          #{pin}
        </h2>
      </div>

      <div className="bg-red-600 p-8 rounded-full shadow-md shadow-red-900 mt-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-8 text-white"
        >
          <path
            fillRule="evenodd"
            d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {isCreator ? (
        <>
          {/* Form for Creator to Enter Name */}
          <form className="w-full md:w-2/5 mt-8">
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded mb-4 text-center"
            />
          </form>

          {/* List of Players */}
          <div className="w-full md:w-3/5 mt-8 relative">
            <h2 className="text-2xl text-gray-800 mb-4">
              {playerCount} people in the game
            </h2>
            <div className="h-64 overflow-y-auto bg-white rounded shadow p-4">
              <ul className="list-none">
                {Object.entries(players).map(([key, player]) =>
                  key !== playerKey ? (
                    <li key={key} className="p-4 bg-white rounded shadow mb-2">
                      {player.name}{" "}
                      {player.team && (
                        <span className="text-gray-600">({player.team})</span>
                      )}
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          </div>

          <Button color="red" text="Launch" onClick={handleStartGame} />
        </>
      ) : (
        <div className="md:w-3/5 mt-5 p-4 bg-blue-500">
          <h2 className="text-xl text-white font-sans font-bold mb-4 text-left">
            More rules
          </h2>
          <div className="text-white font-medium text-left">
            <p>You have to stay in your room.</p>
            <p>You can show your card.</p>
            <p>Respect the timer.</p>
            <p>Have fun.</p>
            <p>No talks during exchanges.</p>
            <p>Always have a leader in the room.</p>
          </div>
          <button
            className="bg-red-600 rounded-full font-sans font-bold text-white p-5"
            onClick={() => alert("Display full rules")}
          >
            Full <br /> rules
          </button>
        </div>
      )}
    </div>
  );
};

export default WaitingArea;
