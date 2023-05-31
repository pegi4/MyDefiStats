import axios from "axios";
import { useState } from 'react';

export default function User({ session, onLogout, setWallet }) {

  // Wallet connection status
  const [walletConnected, setWalletConnected] = useState(false);

  async function signOut() {
    await axios(`${process.env.REACT_APP_SERVER_URL}/logout`, {
      withCredentials: true,
    });
    setWalletConnected(false);
    console.log("Wallet connect: ", walletConnected);
    onLogout();
  }

  if(!walletConnected) {
    setWallet(session.address);
    setWalletConnected(true);
    console.log("Wallet connect: ", walletConnected);
  }

  return (
    <div>
      <button className="walletButton" type="button" onClick={signOut}>
        Sign out
      </button>
    </div>
  );
}