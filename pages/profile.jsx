import Web3 from 'web3';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Radio from '../smart-contracts/build/contracts/Radio.json';
import NFT from '../smart-contracts/build/contracts/NFT.json';

const CreatorDashboard = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3 = new Web3(window.ethereum);
    const networkId = await web3.eth.net.getId();

    // Get listed NFTs
    const radioContract = new web3.eth.Contract(
      Radio.abi,
      Radio.networks[networkId].address
    );
    const accounts = await web3.eth.getAccounts();
    const listings = await radioContract.methods
      .getMyListedNfts()
      .call({ from: accounts[0] });
    // Iterate over my listed NFTs and retrieve their metadata
    const nfts = await Promise.all(
      listings.map(async (i) => {
        try {
          const NFTContract = new web3.eth.Contract(
            NFT.abi,
            NFT.networks[networkId].address
          );
          const tokenURI = await NFTContract.methods.tokenURI(i.tokenId).call();
          const meta = await axios.get(tokenURI);
          let item = {
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          };
          return item;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );
    setNfts(nfts.filter((nft) => nft !== null));
    setLoadingState('loaded');
  }
  return (
    <div>
      <div className="flex justify-center items-center mb-4 mt-4">
        <div className="text-4xl font-bold text-center">My Beats</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4 pt-4  w-full  py-6 px-6">
        {nfts.map((nft, i) => (
          <div
            key={i}
            className="p-6 border-[2px] border-[#2a2a2a] shadow overflow-hidden hover:scale-[1.03] transform transition duration-500 ease-in-out mb-4"
          >
            <figure className="flex items-center justify-center  w-full">
              <audio
                controls
                controlsList="nodownload"
                className="w-full border-b-[2px] border-black"
              >
                <source src={nft.image} type="audio/mpeg" />
              </audio>
            </figure>

            <div className="p-4 space-y-2">
              <p className="text-2xl font-semibold">{nft.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatorDashboard;
