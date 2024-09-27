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
  const location = useLocation<{ playerKey: string }>();
  const { playerKey } = location.state;
  const navigate = useNavigate();

  const [gameData, setGameData] = useState<GameData | null>(null);
  const [fixedPlayersInRoom, setFixedPlayersInRoom] = useState<Player[]>([]); // State for fixed players in the same room

  const playerCount = Object.keys(gameData?.players || {}).length;

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
      }
    });

    return () => unsubscribe();
  }, [navigate, pin, playerKey]);

  // When the gameData is first set, compute the players in the same room and store it in the fixed state
  useEffect(() => {
    if (gameData) {
      const currentPlayerData = gameData.players[playerKey];
      const currentRoom = currentPlayerData.Room[0];

      // Create a static copy of players in the same room
      const playersInSameRoom = Object.values(gameData.players).filter(
        (player) => player.Room[0] === currentRoom
      );

      // Set the fixed players in room
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
    return <div>Loading game data...</div>;
  }

  const currentPlayerData = gameData.players[playerKey];
  const { team, role, Room } = currentPlayerData;
  const currentRoom = Room[0]; // Room assignment for round 1

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-bg min-h-screen">
      {/* Pass the fixed players to the RoomInfo component */}
      <RoomInfo roomNumber={currentRoom} players={fixedPlayersInRoom} />

      <div className="w-full max-w-xl mb-8 bg-blue-500">
        <h1>Specific rules for {playerCount} players</h1>
        <NumberExchangeRule numberOfPlayers={playerCount} />
      </div>

      <Card team={team} role={role} />

      {playerKey === "creator" && (
        <Button onClick={handleStartRound} color="red" text="Start Round 1" />
      )}
    </div>
  );
};

export default Preparation;
