import { Box, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { create } from 'ipfs-http-client';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import useActionContract from '@/hooks/contracts/useActionContract';
import PrimaryButton from './PrimaryButton';
import { Connect } from './Connect';
import toast from 'react-hot-toast';

const projectId = process.env.NEXT_PUBLIC_INFRA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFRA_SECRET;
const projectIdAndSecret = `${projectId}:${projectSecret}`;

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(projectIdAndSecret).toString(
      'base64'
    )}`,
  },
});

const experiencesRarity = [
  { rarity: 0.4, trait: 'Visual' },
  { rarity: 0.3, trait: 'Emotional' },
  { rarity: 0.2, trait: 'Sensory' },
  { rarity: 0.09, trait: 'Spatial' },
  { rarity: 0.01, trait: 'Psychological' },
];

const colorsRarity = [
  { rarity: 0.4, trait: 'Monochromatic' },
  { rarity: 0.3, trait: 'Earth tones' },
  { rarity: 0.2, trait: 'Metallics' },
  { rarity: 0.09, trait: 'Muted tones' },
  { rarity: 0.01, trait: 'Brights' },
];

const techniquesRarity = [
  { rarity: 0.4, trait: 'Drip' },
  { rarity: 0.3, trait: 'Splatter' },
  { rarity: 0.2, trait: 'Pouring' },
  { rarity: 0.09, trait: 'Palette Knife' },
  { rarity: 0.01, trait: 'Brush' },
];

// create function that randomly selects an item from an array based on rarity
const randomItemRarity = (array: { rarity: number; trait: string }[]) => {
  const totalRarity = array.reduce((acc, curr) => acc + curr.rarity, 0);
  const randomRarity = Math.random() * totalRarity;
  let currentRarity = 0;
  for (let i = 0; i < array.length; i++) {
    currentRarity += array[i].rarity;
    if (randomRarity < currentRarity) {
      return array[i].trait;
    }
  }
};

const Mint: NextPage = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const { address } = useAccount();
  const actionContract = useActionContract();
  const [totalSupply, setTotalSupply] = useState(0);
  const [countdown, setCountdown] = useState('');

  // crete a function that is a countdown to march 31st, 2023 at midnight in the format 5d 3h 59m 45s
  const formatCountdown = () => {
    const now = new Date();
    const march31st2023 = new Date('March 31, 2023 00:00:00');
    const diff = march31st2023.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
  };

  //   update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      formatCountdown();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  //   get total supply on load in useEffect
  useEffect(() => {
    async function init() {
      const totalSupply = await actionContract?.totalSupply();
      console.log('Total Supply: ', totalSupply);
      const supply = totalSupply.toNumber();
      setTotalSupply(supply);
    }
    init();
  }, [actionContract]);

  const handleMint = async () => {
    setIsMinting(true);
    console.log('Calling OpenAI...');

    const technique = randomItemRarity(techniquesRarity)?.toLocaleLowerCase();
    const color = randomItemRarity(colorsRarity)?.toLocaleLowerCase();
    const experience = randomItemRarity(experiencesRarity)?.toLocaleLowerCase();

    const prompt = `A ${technique} painting by Jackson Pollock that features a ${color} palette and invokes a primarily ${experience} experience. Don't show the frame of the painting and show the pattern of the paint right to the edge of the image.`;

    console.log('Prompt: ', prompt);

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    const { url } = data;

    console.log('OpenAI Response: ', url);

    const mintJson = {
      name: 'AI Art',
      description: prompt,
      image: url,
      attributes: [
        { trait_type: 'Experience', value: experience },
        { trait_type: 'Technique', value: technique },
        { trait_type: 'Color', value: color },
      ],
    };
    const uploaded = await ipfs.add(JSON.stringify(mintJson));
    console.log('Uploaded Hash: ', uploaded);
    const path = uploaded.path;

    try {
      if (address) {
        const transaction = await actionContract.mint(address, path);
        console.log('Transaction: ', transaction.transactionHash);
        setTransactionHash(transaction.transactionHash);
        toast.success('NFT minted!');
        setTotalSupply(totalSupply + 1);
      }
      setIsMinting(false);
    } catch (e) {
      console.log('Error minting NFT: ', e);
      toast.error('Error minting NFT');
      setIsMinting(false);
    }
  };

  return (
    <Box pt="2" position="absolute" bottom="10" bg="black" right="5" left="5">
      {!address ? (
        <Connect />
      ) : (
        <>
          {transactionHash !== '' ? (
            <PrimaryButton
              text="View Transaction"
              onClick={() =>
                window
                  ?.open(
                    `https://base-goerli.blockscout.com/tx/${transactionHash}`,
                    '_blank'
                  )
                  ?.focus()
              }
            />
          ) : (
            <PrimaryButton
              text="Mint - 0.025 ETH"
              isLoading={isMinting}
              onClick={handleMint}
            />
          )}

          <Text pb="4" pt="2" textAlign="center">
            {totalSupply} minted • {countdown}
          </Text>
        </>
      )}
    </Box>
  );
};

export default Mint;
