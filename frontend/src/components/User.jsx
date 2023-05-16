import axios from "axios";

export default function User({ session, onLogout, setWallet }) {
  async function signOut() {
    await axios(`${process.env.REACT_APP_SERVER_URL}/logout`, {
      withCredentials: true,
    });
    onLogout();
  }

  setWallet(session.address);

  return (
    <div>
      <pre>{JSON.stringify(session.address, null, 2)}</pre>
      <button type="button" onClick={signOut}>
        Sign out
      </button>
    </div>
  );
}