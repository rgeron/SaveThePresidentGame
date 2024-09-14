import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { FormEvent, useEffect, useState } from "react";
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
  const [isReadyButtonVisible, setIsReadyButtonVisible] =
    useState<boolean>(true);
    
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

  const handleNameSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsReadyButtonVisible(false);

    try {
      const gameRef = doc(db, "games", pin);

      // Update the player's name using the playerKey
      await updateDoc(gameRef, {
        [`players.${playerKey}.name`]: playerName,
      });
    } catch (error) {
      console.error("Error updating player name:", error);
    }
  };

  const handleStartGame = async () => {
    try {
      const gameRef = doc(db, "games", pin);
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

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen text-center">
      <div className="bg-blue-600 flex px-8 items-center justify-center">
        <h2 className="font-sans italic font-bold text-8xl text-white mb-8">
          # {pin}
        </h2>
      </div>

      {isReadyButtonVisible && (
        <form onSubmit={handleNameSubmit} className="w-full md:w-2/5">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded mb-4"
          />
        </form>
      )}

      <div className="w-full md:w-3/5 mt-8">
        <h2 className="text-2xl text-gray-800 mb-4">Players:</h2>
        <ul className="list-none">
          {Object.entries(players).map(([key, player]) => (
            <li key={key} className="p-4 bg-white rounded shadow mb-2">
              {player.name}{" "}
              {player.team && (
                <span className="text-gray-600">({player.team})</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {isCreator && (
        <>
          <div className="bg-red-600 mt-8 p-3 w-[70%] mx-auto">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="bg-red-600 text-white text-2xl font-sans italic font-bold border-none outline-none placeholder-opacity-70 w-full text-center"
            />
          </div>



          <Button color="red" text="Launch" onClick={handleStartGame} />
        </>
      )}
    </div>
  );
};

export default WaitingArea;
