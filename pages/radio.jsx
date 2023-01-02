import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import Web3 from 'web3';
import Radio from '../smart-contracts/build/contracts/Radio.json';
import NFT from '../smart-contracts/build/contracts/NFT.json';

import { motion } from 'framer-motion';

import Rewind from '../icons/Rewind';
import Forward from '../icons/Forward';
import Eye from '../icons/Eye';
import Eyeslash from '../icons/Eyeslash';

import Balancer from 'react-wrap-balancer';

const Alert = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [account, setAccount] = useState('');
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [nft, setNft] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    name: '',
    description: '',
  });
  const router = useRouter();

  useEffect(() => {
    loadBlockchainData();
    loadSongs();
  }, [account]);

  const ipfsClient = require('ipfs-http-client');
  const projectId = '2FdliMGfWHQCzVYTtFlGQsknZvb';
  const projectSecret = '2274a79139ff6fdb2f016d12f713dca1';
  const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
  const client = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });

  const Web3Handler = async () => {
    const notification = toast.loading('Connecting account...');
    try {
      const account = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const web3 = new Web3(window.ethereum);
      setAccount(account[0]);
      setWeb3(web3);
      toast.success('Account connected', {
        id: notification,
      });
      // wait 2 seconds and reload the page
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.log(err);
      toast.error('Account not connected', {
        id: notification,
      });
    }
  };

  const loadBlockchainData = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  async function loadSongs() {
    // changed function name and parameter
    const web3 = new Web3(window.ethereum);

    const networkId = await web3.eth.net.getId();

    // Get all listed NFTs
    const radioContract = new web3.eth.Contract(
      Radio.abi,
      Radio.networks[networkId].address
    );
    const listings = await radioContract.methods.getListedNfts().call();
    // Select a random listed NFT
    const randomIndex = Math.floor(Math.random() * listings.length);
    const selectedListing = listings[randomIndex];
    // Retrieve metadata for the selected NFT
    try {
      const NFTContract = new web3.eth.Contract(
        NFT.abi,
        NFT.networks[networkId].address
      );
      const tokenURI = await NFTContract.methods
        .tokenURI(selectedListing.tokenId)
        .call();
      const meta = await axios.get(tokenURI);
      const nft = {
        tokenId: selectedListing.tokenId,
        seller: selectedListing.seller,
        owner: selectedListing.buyer,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        coverImage: meta.data.coverImage,
      };
      setNft(nft); // changed nfts to nft
      setAudio(new Audio(nft.image)); // set audio element with source from nft.image
    } catch (err) {
      console.log(err);
    }
  }

  const playAudio = () => {
    // added function to play audio
    if (audio) {
      audio.play();
      setIsPlaying(true);

      // added wave visualizer
    }

    // if the audio is playing, pause it
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const playNextSong = () => {
    // Stop the current audio
    audio.pause();
    audio.currentTime = 0;

    // Reset the "isPlaying" state
    setIsPlaying(false);

    // Load the next song
    loadSongs();
  };

  return (
    <div>
      {isOpen ? (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="alert shadow-lg border-b border-[#2a2a2a] alert1"
        >
          <Link href="/upload">
            <div>
              <span>
                Hey there! Want to upload your own beats? Check out the{' '}
                <span className="link"> upload page!</span>
              </span>
            </div>
          </Link>

          <div className="flex-none">
            <button onClick={() => setIsOpen(false)} className="btn btn-sm">
              <Eye />
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="alert shadow-lg bg-black">
          <div />
          <div className="flex-none">
            <button onClick={() => setIsOpen(true)} className="btn btn-sm">
              <Eyeslash />
            </button>
          </div>
        </div>
      )}

      <div className="hero p-12">
        {nft && (
          <div className="card lg:card-side border border-[#2a2a2a] md:w-5/6">
            <figure>
              <img src={nft.coverImage} alt="." className="rounded-xl w-fit" />
            </figure>
            <div className="card-body space-y-4">
              <h2 className="card-title text-center items-center justify-center text-3xl">
                {nft.name}
              </h2>
              <p className="text-center items-center justify-center truncate max-w-[200px] text-[#555555]">
                {nft.seller}
              </p>

              {/* music timeline to show how long the song is */}
              <progress className="progress" value="100" max="100"></progress>

              <div className="card-actions justify-between">
                <button onClick={playNextSong} className="btn btn-primary">
                  <Rewind />
                </button>

                {/* Play Button */}
                <button onClick={playAudio} className="btn btn-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                    />
                  </svg>
                </button>
                <button onClick={playNextSong} className="btn btn-primary">
                  <Forward />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
