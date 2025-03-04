import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import Button from "../components/Button";
import CircularButton from "../components/CircularButton";

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

  const shuffleArray = <T,>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const playerCount = Object.keys(players).length;

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
    if (playerName.trim() === "") {
      alert("Please enter your name before starting the game.");
      return;
    }

    try {
      const gameRef = doc(db, "games", pin);

      await updateDoc(gameRef, {
        [`players.${playerKey}.name`]: playerName, // update the name of the creator in the code base
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

      const shuffledPlayers = shuffleArray(playersObject);
      const updatedPlayers = { ...gameData.players };

      // If the number of players is odd, assign "Gambler" role
      let gamblerIndex = -1;
      if (numPlayers % 2 !== 0) {
        gamblerIndex = Math.floor(Math.random() * numPlayers); // Randomly select an index for Gambler
        const [gamblerKey, gambler] = shuffledPlayers.splice(gamblerIndex, 1)[0]; // Remove Gambler from players array
        updatedPlayers[gamblerKey] = {
          name: (gambler as Player).name,
          team: "Grey",
          role: "The Gambler",
          Room: [1, 1, 1, 1], // Assign room for Gambler
        };
      }

      // Calculate teams for remaining players
      const half = Math.floor(shuffledPlayers.length / 2);
      const blueTeam = shuffledPlayers.slice(0, half);
      const redTeam = shuffledPlayers.slice(half);

      // Assign roles to blue team
      blueTeam.forEach(([key, player], index) => {
        updatedPlayers[key] = {
          name: (player as Player).name,
          team: "Blue",
          role: index === 0 ? "The President" : "Team Member",
        };
      });

      // Assign roles to red team
      redTeam.forEach(([key, player], index) => {
        updatedPlayers[key] = {
          name: (player as Player).name,
          team: "Red",
          role: index === 0 ? "The Bomber" : "Team Member",
        };
      });

      // Update room assignments for both teams
      const Room1 = blueTeam.concat(redTeam).slice(0, half);
      const Room2 = blueTeam.concat(redTeam).slice(half);

      Room1.forEach(([key]) => {
        updatedPlayers[key] = {
          ...updatedPlayers[key],
          Room: [1, 1, 1, 1],
        };
      });

      Room2.forEach(([key]) => {
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

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen text-center">
      {/* Blue Section for PIN Display */}
      <div className="bg-blue-600 flex items-center justify-center w-full px-8 py-4 cursor-pointer">
        <h2 className="font-sans italic font-bold text-8xl text-white">
          #{pin}
        </h2>
      </div>

      <div className="bg-red-600 p-8 rounded-full shadow-md shadow-red-900 mt-10">
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
          <form className="bg-red-600 mt-8 p-3 w-[70%] mx-auto">
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
              className="bg-red-600 text-white text-2xl font-sans font-bold border-none outline-none placeholder-white placeholder-opacity-50 text-center"
            />
          </form>

          {/* List of Players */}
          <div className="w-full md:w-3/5 mt-8 relative mb-8 bg-blue-100 rounded-3xl p-5">
            <h2 className="text-4xl font-bold text-black mb-4">
              {playerCount} people in the game
            </h2>
            <div className="h-64 overflow-y-auto">
              <div className="grid grid-cols-4">
                {/* Hardcoded entry for "You" */}
                <div className="rounded-lg p-2">
                  <span className="font-semibold text-xl">You</span>
                </div>

                {/* Map through existing players */}
                {Object.entries(players).map(([key, player]) =>
                  key !== playerKey ? (
                    <div key={key} className="rounded-lg p-2">
                      <span className="font-semibold text-xl">
                        {player.name}
                      </span>{" "}
                      {player.team && (
                        <span className="text-gray-600">({player.team})</span>
                      )}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>

          <Button color="red" text="Launch" onClick={handleStartGame} />
        </>
      ) : (
        <div className="relative md:w-3/5 mt-10 p-6 bg-blue-500 border-r-[2px] border-r-blue-500">
          <h2 className="text-3xl text-white font-sans font-bold mb-4 text-center">
            More rules
          </h2>
          <div className="text-white font-medium text-left text-xl">
            <p className="pt-2">You have to stay in your room.</p>
            <p className="pt-2">You can show your card.</p>
            <p className="pt-2">Respect the timer.</p>
            <p className="pt-2">Have fun.</p>
            <p className="pt-2">No talks during exchanges.</p>
            <p className="pt-2">Always have a leader in the room.</p>
          </div>

          <CircularButton />
        </div>
      )}
    </div>
  );
};

export default WaitingArea;
