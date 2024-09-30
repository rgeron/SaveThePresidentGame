import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebaseConfig";
import Button from "../components/Button";
import Card from "../components/Card";
import NumberExchangeRule from "../components/NumberExchangeRule";
import RoomInfo from "../components/RoomInfo";

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

const Preparation: React.FC = () => {
  const { pin } = useParams<{ pin: string }>();
  const location = useLocation();
  const { playerKey } = location.state;
  const navigate = useNavigate();

  const [gameData, setGameData] = useState<GameData | null>(null);
  const [fixedPlayersInRoom, setFixedPlayersInRoom] = useState<Player[]>([]);

  useEffect(() => {
    const gameRef = doc(db, "games", pin as string);

    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      const data = snapshot.data();
      if (data) {
        setGameData(data as GameData);

        // Check if it's round 1, and navigate if necessary
        if (data.gameStatus === "round1") {
          navigate(`/round1/${pin}`, {
            state: { playerKey, playerData: data.players[playerKey], data },
          });
        }
      } else {
        console.error("No data found for the game");
      }
    });

    return () => unsubscribe();
  }, [navigate, pin, playerKey]);

  // When the gameData is first set, compute the players in the same room and store it in the fixed state
  useEffect(() => {
    if (gameData) {
      const currentPlayerData = gameData.players[playerKey];
      const currentRoom = currentPlayerData.Room[0];

      const playersInSameRoom = Object.values(gameData.players).filter(
        (player) => player.Room[0] === currentRoom
      );

      setFixedPlayersInRoom(playersInSameRoom);
    }
  }, [gameData, playerKey]);

  const handleStartRound = async () => {
    if (!gameData) {
      console.error("Game data is not available");
      return;
    }

    const gameRef = doc(db, "games", pin as string);
    await updateDoc(gameRef, { gameStatus: "round1" });

    navigate(`/round1/${pin}`, {
      state: {
        playerKey,
        playerData: gameData.players[playerKey],
        data: gameData,
      },
    });
  };

  if (!gameData) {
    return <div>Loading game data...</div>; // Loading state
  }

  const currentPlayerData = gameData.players[playerKey];
  if (!currentPlayerData) {
    return <div>Player data not found</div>; // Player not found state
  }

  const { team, role, Room } = currentPlayerData;
  const currentRoom = Room[0]; // Room assignment for round 1

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-bg mt-3">
      {/* Pass the fixed players to the RoomInfo component */}
      <RoomInfo roomNumber={currentRoom} players={fixedPlayersInRoom} />

      <div className="w-full max-w-xl mt-5 bg-red-600 text-center rounded-xl">
        <h1 className="mt-4 text-3xl font-Montserrat font-bold text-white underline">
          Rules for {Object.keys(gameData.players).length} players
        </h1>
        <NumberExchangeRule
          numberOfPlayers={Object.keys(gameData.players).length}
        />
      </div>

      <div className=" m-3 rounded-xl underline">
        <h1 className="m-3 text-3xl font-Montserrat font-bold text-black">
          Closely watch your card
        </h1>
      </div>
      <Card team={team} role={role} />

      {playerKey === "creator" && (
        <Button onClick={handleStartRound} color="red" text="Start Round 1" />
      )}
    </div>
  );
};

export default Preparation;
