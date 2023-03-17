import { Box } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const paintings = [
  '/painting1.png',
  '/painting2.png',
  '/painting3.png',
  '/painting4.png',
  '/painting5.png',
];

const Art: NextPage = () => {
  // function that randomly selects an item from paintings array
  const [painting, setPainting] = useState(paintings[0]);

  const randomPainting = () => {
    setPainting(paintings[Math.floor(Math.random() * paintings.length)]);
  };

  useEffect(() => {
    // change the painting every 5 seconds
    const interval = setInterval(() => {
      randomPainting();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      position="relative"
      mx="auto"
      width={{ base: 300, xl: 500 }}
      height={{ base: 300, xl: 500 }}
    >
      <img src={painting} alt="Pollockesque Art" height="100%" width="100%" />
    </Box>
  );
};

export default Art;
