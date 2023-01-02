import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Web3 from 'web3';
import Radio from '../backend/build/contracts/Radio.json';
import NFT from '../backend/build/contracts/NFT.json';

const upload = () => {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(true);
  const [web3, setWeb3] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [fileUrl, setFileUrl] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [formInput, updateFormInput] = useState({
    name: '',
    coverImage: '',
  });
  const router = useRouter();

  useEffect(() => {
    loadBlockchainData();
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

  const loadBlockchainData = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  async function onChange(e) {
    // upload image to IPFS
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log(url);
      setFileUrl(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function createCoverImage(e) {
    // upload image to IPFS
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log(url);
      setCoverImage(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function uploadToIPFS() {
    const { name, coverImage } = formInput;
    if (!name || !coverImage || !fileUrl) {
      return;
    } else {
      // first, upload metadata to IPFS
      const data = JSON.stringify({
        name,
        coverImage,
        image: fileUrl,
      });
      try {
        const added = await client.add(data);
        const url = `https://ipfs.io/ipfs/${added.path}`;
        // after metadata is uploaded to IPFS, return the URL to use it in the transaction
        return url;
      } catch (error) {
        console.log('Error uploading file: ', error);
      }
    }
  }

  async function listNFTForSale() {
    // const notification = toast.loading(
    //   'Make sure to confirm both transactions!',
    //   {
    //     style: {
    //       border: '2px solid #000',
    //       // make bold
    //       fontWeight: 'bold',
    //     },
    //   }
    // );

    try {
      const web3 = new Web3(window.ethereum);
      const provider = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const url = await uploadToIPFS();
      const networkId = await web3.eth.net.getId();

      // Mint the NFT
      const NFTContractAddress = NFT.networks[networkId].address;
      const NFTContract = new web3.eth.Contract(NFT.abi, NFTContractAddress);
      const accounts = await web3.eth.getAccounts();
      const radioContract = new web3.eth.Contract(
        Radio.abi,
        Radio.networks[networkId].address
      );

      setLoading(true);
      NFTContract.methods
        .mint(url)
        .send({ from: accounts[0] })
        .on('receipt', function (receipt) {
          console.log('minted');
          // List the NFT
          const tokenId = receipt.events.NFTMinted.returnValues[0];
          radioContract.methods
            .listNft(NFTContractAddress, tokenId)
            .send({ from: accounts[0] })
            .on('receipt', function () {
              console.log('listed');

              // toast.success('NFT listed', {
              //   id: notification,
              //   style: {
              //     border: '2px solid #000',
              //   },
              // });

              setLoading(false);
              // wait 2 seconds, then reload the page
              setTimeout(() => {
                router.push('/radio');
              }, 2000);
            });
        });
    } catch (error) {
      console.log(error);
      // toast.error('Error creating stem', { id: notification });
    }
  }

  return (
    <div className="h-screen">
      <input
        class="block w-full text-sm text-black bg-gray-50  border border-black cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-100 dark:border-gray-100 dark:placeholder-gray-400"
        id="file_input"
        type="file"
        onChange={onChange}
        required
      />
      <input
        type="text"
        placeholder="Stem Title"
        className="input border-black"
        onChange={(e) =>
          updateFormInput({ ...formInput, name: e.target.value })
        }
      />
      <label htmlFor="description" className="text-black">
        Cover Image
      </label>
      <input
        class="block w-full text-sm text-black bg-gray-50  border border-black cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-100 dark:border-gray-100 dark:placeholder-gray-400"
        id="file_input"
        type="file"
        onChange={createCoverImage}
        required
      />
      {/* display the coverimage url */}
      {coverImage && <h1 className="text-white">{coverImage}</h1>}

      <input
        type="text"
        placeholder="Stem Title"
        className="input border-black"
        onChange={(e) =>
          updateFormInput({ ...formInput, coverImage: e.target.value })
        }
      />
      <div
        onClick={listNFTForSale}
        className="relative inline-block px-4 py-2  group cursor-pointer"
      >
        <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-[#6AB313] group-hover:-translate-x-0 group-hover:-translate-y-0 border-black border-[2px]"></span>
        <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-[#6AB313]"></span>
        <span className="relative text-black group-hover:text-black text-center flex flex-col">
          Create Stem
        </span>
      </div>
    </div>
  );
};

export default upload;
