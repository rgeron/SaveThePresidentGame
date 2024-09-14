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

import Button from "../components/Button";

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
    <div className="flex flex-col items-center justify-start h-screen pt-8">
      <div className="bg-red-600 w-full text-center">
        <h1 className="font-zcool text-5xl text-white m-5">
          Save the <br /> president !
        </h1>
      </div>

      <div className="bg-blue-500 mt-8 p-5 w-[85%] mx-auto">
        <div className="flex flex-row items-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-8 text-white"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>

          <h2 className="text-white font-sans font-semibold text-2xl ml-3">
            Blue team vs Red team
          </h2>
        </div>

        <div className="flex flex-row items-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-8 text-white"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-white font-sans font-semibold text-2xl ml-3">
            3 rounds (3-2-1-BOOM)
          </h2>
        </div>

        <div className="flex flex-row items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-8 text-white"
          >
            <path
              fillRule="evenodd"
              d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              clipRule="evenodd"
            />
          </svg>

          <h2 className="text-white font-sans font-semibold text-2xl ml-3">
            Will the president and the terrorists <br /> end up in the same
            room?
          </h2>
        </div>
      </div>

      <div className="mt-10">
        <Button onClick={createGame} text="CREATE" color="red" />
      </div>

      <div className="mt-10">
        <Button onClick={handleJoinWithPin} text="JOIN" color="blue" />
      </div>
    </div>
  );
}

export default HomePage;
