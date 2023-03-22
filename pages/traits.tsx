import { Stack, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Layout from '@/components/Layout';

const TraitsPage: NextPage = () => {
  return (
    <Layout>
      <Stack py="12px" maxW="800px" gap="4">
        <Text>
          All Pollockesque NFTs are generated using a combination of the
          following traits. Each trait has a different impact on the final
          artwork, and each Pollockesque NFT is unique. {"There's"} a rarity
          score for each trait, which indicates how common that trait is in the
          collection. The rarity score is based on the number of Pollockesque
          NFTs that have that trait, and the total number of Pollockesque NFTs
          that have been minted.
        </Text>
        <Text fontWeight="bold" fontSize="xl" pt="10">
          Techniques
        </Text>
        <Text>
          Drip painting (40%) <br /> Pollock is most famous for his drip
          paintings, in which he would drip, pour, or fling paint onto a canvas.
          He would move around the canvas, dripping and splattering paint from
          different angles, creating intricate and dynamic compositions.
        </Text>
        <Text>
          Splatter painting(30%) <br /> Similar to drip painting, Pollock would
          fling or splatter paint onto a canvas, creating a more random and
          chaotic pattern.
        </Text>
        <Text>
          Pouring(20%) <br /> Pollock would pour paint onto the canvas, allowing
          the paint to flow and mingle, creating a layered and complex effect.
        </Text>
        <Text>
          Palette knife(9%) <br /> Pollock would also use a palette knife to
          apply paint to the canvas, creating a more textured and layered
          effect.
        </Text>
        <Text>
          Brushwork(1%) <br /> Although less prominent in his work, Pollock
          would also use brushes to apply paint to the canvas, creating more
          controlled and precise marks.
        </Text>
        <Text fontWeight="bold" fontSize="xl" pt="10">
          Colors
        </Text>
        <Text>
          Monochromatic(40%) <br /> Pollock often used a single color in his
          paintings, such as black, white, or a range of grays.
        </Text>
        <Text>
          Earth tones(30%) <br /> Pollock frequently used earth tones such as
          browns, greens, and ochres, often in combination with black and white.
        </Text>
        <Text>
          Brights(20%) <br /> Pollock also used bright, bold colors such as red,
          yellow, and blue in his work, often in combination with other colors.
        </Text>
        <Text>
          Metallics(9%) <br /> Pollock occasionally used metallic paints such as
          silver or gold in his paintings, adding a reflective quality to the
          work.
        </Text>
        <Text>
          Muted tones(1%) <br /> Pollock also experimented with more muted
          colors, such as soft pinks, blues, and greens.
        </Text>
        <Text fontWeight="bold" fontSize="xl" pt="10">
          Experiences
        </Text>
        <Text>
          Visual experience(40%) <br /> {"Pollock's"} paintings offer a rich
          visual experience, with their complex layers of color, texture, and
          form. The viewer can be drawn into the painting, exploring its details
          and experiencing its visual impact.
        </Text>
        <Text>
          Emotional experience(30%) <br /> {"Pollock's"} paintings also offer a
          strong emotional experience, with their raw energy and expressive
          brushwork. The viewer can be moved by the intensity of the painting,
          which conveys a sense of emotional depth and complexity.
        </Text>
        <Text>
          Sensory experience(20%) <br /> {"Pollock's"} paintings offer a sensory
          experience that engages the {"viewer's"} senses beyond just sight. The
          viewer can experience the texture of the paint, the sound of the brush
          as it hits the canvas, and the smell of the paint.
        </Text>
        <Text>
          Spatial experience(9%) <br /> {"Pollock's"} large-scale paintings
          offer a spatial experience that immerses the viewer in the painting,
          creating a sense of depth and scale that can be both exhilarating and
          disorienting.
        </Text>
        <Text>
          Psychological experience(1%) <br /> {"Pollock's"} paintings also offer
          a psychological experience, with their abstract forms and colors
          evoking different moods, feelings, and associations in the viewer.
        </Text>
      </Stack>
    </Layout>
  );
};

export default TraitsPage;
