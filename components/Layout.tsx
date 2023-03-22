import { Box, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { ReactNode } from 'react';
import Link from 'next/link';
import { Connect } from './Connect';
import { useRouter } from 'next/router';
import Mint from './Mint';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'Pollock721 Art' }: Props) => {
  const router = useRouter();
  return (
    <Box>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Pollock721 Art" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex
        w="full"
        h={{ base: '100%', md: '100vh' }}
        bg="black"
        color="white"
        direction={{ base: 'column', md: 'row' }}
      >
        <Stack
          p="24px"
          maxW={{ base: '100%', md: '400px' }}
          w="full"
          h="full"
          gap="9px"
          position="relative"
          overflowY={{ md: 'scroll' }}
          pb="40px"
        >
          <Text fontSize="4xl" fontWeight="semibold">
            Pollock721
          </Text>
          <Link
            style={{ marginTop: '0px' }}
            target="_blank"
            href="https://twitter.com/davidhurley87"
          >
            <Text display="inline" color="blue.500">
              by hurls
            </Text>
          </Link>
          <Stack
            gap="12px"
            fontSize={{ base: '14px', md: '16px' }}
            maxW="700px"
            position="relative"
            minH="420px"
          >
            <Text>
              Jackson Pollock was an American painter and a major figure in the
              abstract expressionist movement. He is best known for his unique
              style of drip painting, which revolutionized the art world in the
              1940s and 1950s.
            </Text>
            <Text>
              Overall, {"Pollock's"} techniques were focused on creating
              spontaneous and dynamic compositions, often through the use of
              unconventional tools and techniques.
            </Text>
            <Text>
              His work had a significant impact on the development of abstract
              expressionism and modern art in general.
            </Text>
            <Text>
              Mint a randomly generated Pollock721 NFT and own a piece of art
              history.
            </Text>
          </Stack>
          <Mint />
        </Stack>
        <Box w="full" p="24px" position="relative" overflowY="scroll">
          <HStack w="full" justify="space-between" pb="24px">
            <Flex gap="8" fontSize="18px">
              <Link href="/">
                <Text opacity={router.asPath === '/' ? '1' : '0.6'}>
                  Gallery
                </Text>
              </Link>
              <Link href="/collection">
                <Text opacity={router.asPath === '/collection' ? '1' : '0.6'}>
                  Collection
                </Text>
              </Link>
              <Link href="/rarity">
                <Text opacity={router.asPath === '/rarity' ? '1' : '0.6'}>
                  Rarity
                </Text>
              </Link>
              <Link href="/utility">
                <Text opacity={router.asPath === '/utility' ? '1' : '0.6'}>
                  Utility
                </Text>
              </Link>
            </Flex>
            <Box display={{ base: 'none', md: 'block' }}>
              <Connect />
            </Box>
          </HStack>
          <Box>{children}</Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;
