import { useContract, useProvider, useSigner } from 'wagmi';
import { ethers } from 'ethers';

import ActionContract from './abis/Action.json';

const useActionContract = () => {
  const provider = useProvider();
  const { data: signer } = useSigner();
  const contract = useContract({
    address: '0x7F0F107a3f1143D7743443DdcC47F682152b5C49',
    abi: ActionContract.abi,
    signerOrProvider: signer || provider,
  });

  const mint = async (to: string, tokenId: string) => {
    const tx = await contract?.mint(to, tokenId, {
      gasLimit: ethers.utils.hexlify(1000000),
      value: ethers.utils.parseEther('0.005'),
    });
    const receipt = await tx?.wait();
    return receipt;
  };

  // create function that returns total supple of NFTs that have been minted
  // create function that returns the total supply of NFTs that have been minted by a specific address
  const totalSupply = async () => {
    const totalSupply = await contract?.totalSupply();
    return totalSupply;
  };

  return {
    contract,
    totalSupply,
    mint,
  };
};

export default useActionContract;
