import {
  Box,
  GridItem,
  Img,
  SimpleGrid,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Skeleton,
  Link,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import useActionContract from '@/hooks/contracts/useActionContract';
import { create } from 'ipfs-http-client';
import _ from 'lodash';
import { useAccount } from 'wagmi';

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

const Collection: NextPage = () => {
  const actionContract = useActionContract();
  const [nfts, setNfts] = useState<any>([]);
  const [nftsLoaded, setNftsLoaded] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const { address } = useAccount();

  const getFromIPFS = async (cid: string) => {
    const decoder = new TextDecoder();
    let content = '';
    for await (const chunk of ipfs.cat(cid)) {
      content += decoder.decode(chunk);
    }
    return content;
  };

  // re write getNFTs using useCallback
  const getNFTs = useCallback(async () => {
    const totalSupply = await actionContract?.totalSupply();
    const nfts = [];
    for (let i = 0; i < totalSupply; i++) {
      const id = await actionContract?.contract?.tokenByIndex(i);
      const owner = await actionContract?.contract?.ownerOf(id);
      const tokenURI = await actionContract?.contract?.tokenURI(id);
      const ipfsHash = tokenURI.replace('https://ipfs.io/ipfs/', '');

      const content = await getFromIPFS(ipfsHash);

      try {
        const ipfsObject = JSON.parse(content);
        nfts.push({
          i,
          id,
          uri: tokenURI,
          owner,
          ...ipfsObject,
        });
      } catch (e) {
        console.log(e);
      }
    }
    setNftsLoaded(true);
    setNfts(nfts);
  }, [actionContract]);

  //   get total supply on load in useEffect
  useEffect(() => {
    if (!nftsLoaded) getNFTs();
  }, [actionContract]);

  const showNFT = (nft: any) => {
    onOpen();
    setSelectedNFT(nft);
  };

  return (
    <SimpleGrid
      columns={{ base: 2, md: 2, lg: 4 }}
      maxWidth="6xl"
      mx="auto"
      columnGap={2}
      rowGap={2}
    >
      {!nftsLoaded &&
        [1, 2, 3, 4, 5, 6, 7, 8].map((i: any) => (
          <GridItem
            key={i}
            bg="blue.500"
            display="relative"
            h="full"
            borderRadius="md"
            borderColor="blue.500"
            borderWidth="1px"
            shadow="xl"
          >
            <Skeleton w="full" h="300px" />
          </GridItem>
        ))}
      {nftsLoaded &&
        nfts
          .filter((n: any) => n.owner.toLowerCase() === address?.toLowerCase())
          .map((nft: any) => (
            <GridItem
              key={nft.i}
              bg="blue.500"
              display="relative"
              h="full"
              borderRadius="md"
              borderColor="blue.500"
              borderWidth="1px"
              shadow="xl"
              cursor="pointer"
              onClick={() => showNFT(nft)}
            >
              <Box
                _hover={{
                  shadow: 'md',
                  transform: 'translateX(2px) translateY(2px) translateZ(0px)',
                  transitionDuration: '0.5s',
                  transitionTimingFunction: 'ease-in-out',
                }}
              >
                <Img w="full" h="auto" src={nft.image} borderRadius="md" />
                <Stack
                  w="full"
                  bg="black"
                  borderBottomRadius="md"
                  p="4"
                  gap="0px"
                >
                  <Text fontSize="sm" fontWeight="bold" color="white" pb="0">
                    {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
                  </Text>
                </Stack>
              </Box>
            </GridItem>
          ))}
      <Modal size={'md'} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody bg="black" color="white">
            <Stack p="8" gap="2">
              <Img
                w="full"
                h="auto"
                src={selectedNFT?.image}
                borderRadius="md"
              />
              <Text fontSize="lg" fontWeight="bold">
                {selectedNFT?.name} #{selectedNFT?.i + 1}
              </Text>
              <Text fontSize="xs" fontWeight="bold">
                Experience:{' '}
                {
                  selectedNFT?.attributes.filter(
                    (a: any) => a.trait_type === 'Experience'
                  )[0].value
                }
              </Text>
              <Text fontSize="xs" fontWeight="bold">
                Technique:{' '}
                {
                  selectedNFT?.attributes.filter(
                    (a: any) => a.trait_type === 'Technique'
                  )[0].value
                }
              </Text>
              <Text fontSize="xs" fontWeight="bold">
                Color:{' '}
                {
                  selectedNFT?.attributes.filter(
                    (a: any) => a.trait_type === 'Color'
                  )[0].value
                }
              </Text>
              <Link fontSize="xs" href="/rarity" color="blue.500">
                View rarity &#x2192;
              </Link>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SimpleGrid>
  );
};

export default Collection;
