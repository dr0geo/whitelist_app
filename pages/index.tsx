import type { NextPage } from 'next';
import { useState, useRef, useEffect } from 'react';
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";
import Head from 'next/head';

const Home: NextPage = () => {

  const [walletConnected, setWalletConnected] = useState(false);
  const [addressWhitelisted, setAddressWhitelisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [whitelistedAddresses, setWhitelistedAddresses] = useState(0);
  const web3ModalRef = useRef<Web3Modal>();

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 'Goerli',
        providerOptions: {},
        disableInjectedProvider: false
      });
      connectWallet();
    }
  }, [walletConnected]);

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3provider = new providers.Web3Provider(provider);

    const { chainId } = await web3provider.getNetwork();

    if (chainId !== 5) {
      window.alert("Change the network to Goerli");;
      throw new Error("Change network to Goerli")
    }

    if (needSigner) {
      const signer = web3provider.getSigner();
      return signer;
    }
    return web3provider;
  }

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);

      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const tx = await whitelistContract.addAddressToWhitelist();
      setIsLoading(true);

      await tx.wait();
      setIsLoading(false);

      await getNumberOfWhitelisted();
      setAddressWhitelisted(true);
    } catch (err) {
      console.log(err);
    }
  }

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner();

      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );

      const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setWhitelistedAddresses(_numberOfWhitelisted);
    } catch (err) {
      console.log(err);
    }
  }

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);

      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const address = await signer.getAddress();

      const _whitelistedAddress = await whitelistContract.whitelistedAddress(address);
      setWhitelistedAddresses(_whitelistedAddress);
    } catch (err) {
      console.log(err);
    }
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (err) {
      console.log(err);
    }
  }

  const renderButton = () => {
    if (walletConnected) {
      if (whitelistedAddresses) {
        return (
          <button className="my-8 p-4 bg-green-500 text-white rounded-md" disabled>
            Thanks for joining the Whitelist!
          </button>
        );
      } else if (isLoading) {
        return <button className="my-8 p-4 bg-gray-400 text-gray-700 rounded-md" disabled>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className="my-8 p-4 bg-vblue text-white rounded-md">
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className="my-8 p-4 bg-vblue text-white rounded-md">
          Connect your wallet
        </button>
      );
    }
  };

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen flex flex-col justify-evenly">
        <section className="flex justify-around items-center">
          <div>
            <h1 className="mb-8 text-center text-3xl text-vblue">Welcome to Crypto Devs!</h1>
            <p className="py-2">
              Its an NFT collection for developers in Crypto.
            </p>
            <p className="py-2">
              {whitelistedAddresses} {whitelistedAddresses > 1 ? 'users have' : 'user has'} already joined the Whitelist.
            </p>
            {renderButton()}
          </div>
          <div>
            <img src="./crypto-devs.svg" />
          </div>
        </section>

        <footer className="flex justify-center text-vblue italic">
          Made with &#10084; by Crypto Devs
        </footer>
      </div>
    </div>
  );
}

export default Home;
