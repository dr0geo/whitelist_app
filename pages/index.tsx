import type { NextPage } from 'next';
import { useState, useRef, useEffect } from 'react';
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import Head from 'next/head';
import Image from 'next/image';

const [walletConnected, setWalletConnected] = useState(false);
const [addressWhitelisted, setAddressWhitelisted] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [whitelistedAddresses, setWhitelistedAddresses] = useState(0);
const web3ModalRef = useRef<Web3Modal>();

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

const Home: NextPage = () => {
  return <h1>Test</h1>;
}

export default Home;
