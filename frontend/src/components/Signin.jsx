import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import axios from 'axios';

export default function SignIn({ onLogin }) {
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const handleAuth = async () => {
    // disconnects the web3 provider if it's already active
    if (isConnected) {
      await disconnectAsync();
    }

    try {
      // enabling the web3 provider metamask
      const { account, chain } = await connectAsync({
        connector: new InjectedConnector(),
      });
      
      const userData = { address: account, chain: chain.id, network: 'evm' };

      const { data } = await axios.post(
        // making a post request to our 'request-message' endpoint
        `${process.env.REACT_APP_SERVER_URL}/request-message`,
        userData,
        {
          headers: {
            'content-type': 'application/json',
          },
        }
      );
      const message = data.message;
      // signing the received message via metamask
      const signature = await signMessageAsync({ message });

      // if user cancelled the signature request, signature will be undefined or null
      if (!signature) {
        console.log("User cancelled signature request");
        return;  // return from the function immediately
      }

      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/verify`,
        {
          message,
          signature,
        },
        { withCredentials: true } // set cookie from Express server
      ).then(({ data }) => {
        onLogin(data);
      });

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={handleAuth}>Add wallet</button>
    </div>
  );
}
