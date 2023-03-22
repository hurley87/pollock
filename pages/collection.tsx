import type { NextPage } from 'next';
import Layout from '@/components/Layout';
import Collection from '@/components/Collection';

const Home: NextPage = () => {
  return (
    <Layout>
      <Collection />
    </Layout>
  );
};

export default Home;
