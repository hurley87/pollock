import { Box } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { create } from 'ipfs-http-client';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import useActionContract from '@/hooks/contracts/useActionContract';
import PrimaryButton from './PrimaryButton';
import { Connect } from './Connect';
import toast from 'react-hot-toast';
import TotalSupply from './TotalSupply';
import { useRouter } from 'next/router';

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
  const router = useRouter();

  //   get total supply on load in useEffect
  useEffect(() => {
    async function init() {
      const totalSupply = await actionContract?.totalSupply();
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

    const prompt = `A ${technique} painting by Jackson Pollock that features a ${color} palette and invokes a primarily ${experience} experience. The painting fills the output image and is centered.`;

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
      name: 'Pollock721',
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
      router.push('/collection');
      setIsMinting(false);
    } catch (e) {
      console.log('Error minting NFT: ', e);
      toast.error('Error minting NFT');
      setIsMinting(false);
    }
  };

  return (
    <Box pt="2" position="absolute" bottom="5" bg="black" right="5" left="5">
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
              text="Mint - 0.005 ETH"
              isLoading={isMinting}
              onClick={handleMint}
            />
          )}
          <TotalSupply />
        </>
      )}
    </Box>
  );
};

export default Mint;
