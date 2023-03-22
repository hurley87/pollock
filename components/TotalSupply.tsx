import { Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import useActionContract from '@/hooks/contracts/useActionContract';

const TotalSupply: NextPage = () => {
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
      const supply = totalSupply.toNumber();
      setTotalSupply(supply);
    }
    init();
  }, [actionContract]);

  return (
    <Text pb="4" pt="2" textAlign="center">
      {totalSupply} minted • {countdown}
    </Text>
  );
};

export default TotalSupply;
