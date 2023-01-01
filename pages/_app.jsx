import '../styles/globals.css';

import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';

import Navbar from '../components/Navbar';

const activeChainId = ChainId.Goerli;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ThirdwebProvider desiredChainId={activeChainId}>
        <div className="bg-black">
          <Navbar />
          <Component {...pageProps} />
        </div>
      </ThirdwebProvider>
    </>
  );
}

export default MyApp;
