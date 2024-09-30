import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import Button from "../components/Button";

export default function InputToJoin() {
  const [name, setName] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const navigate = useNavigate();

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
    if (name.trim() === "") {
      alert("Please enter your name before starting the game.");
      return;
    }

    const gameData = await pinExists(pin);
    if (gameData) {
      const players = gameData.players || {};
      const joinerNumber = Object.keys(players).length;
      const playerKey = `joiner${joinerNumber}`;

      const gameRef = doc(db, "games", pin);
      await updateDoc(gameRef, {
        [`players.${playerKey}`]: { name }, // Add player name
      });

      navigate(`/waiting/${pin}`, {
        state: { mode: "join", pin, playerKey },
      });
    } else {
      alert("Invalid PIN");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen pt-8">
      {/* Blue Section for PIN Input */}
      <div className="bg-blue-600 flex items-center justify-center w-full px-20 py-4 cursor-pointer mt-10 mb-10">
        <span className="text-white text-6xl font-sans italic font-bold px-2">
          #
        </span>
        <input
          id="pinInput"
          type="text"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder=" _ _ _ _ _"
          className="flex bg-blue-600 text-white text-6xl font-sans font-bold border-none outline-none placeholder-white placeholder-opacity-70 w-full text-center"
          maxLength={5}
        />
      </div>

      {/* Red Box for Name Input */}
      <div className="bg-red-600 mt-8 p-3 w-[70%] mx-auto mb-10">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="bg-red-600 text-white text-2xl font-sans font-bold border-none outline-none placeholder-white placeholder-opacity-50 w-full text-center"
        />
      </div>

      {/* Join Button */}
      <div className="mt-8">
        <Button onClick={handleJoinWithPin} text="JOIN" color="blue" />
      </div>
    </div>
  );
}
