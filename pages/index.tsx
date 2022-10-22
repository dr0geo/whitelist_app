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
          <div className="m-auto">
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (isLoading) {
        return <button className="m-auto">Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className="m-auto">
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className="m-auto p-2">
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
      <div className="m-auto">
        <div>
          <h1 className="m-auto">Welcome to Crypto Devs!</h1>
          <div className="m-auto">
            Its an NFT collection for developers in Crypto.
          </div>
          <div className="m-auto">
            {whitelistedAddresses} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className="m-auto" src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className="m-auto">
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}

export default Home;
