import type { Meta, StoryObj } from '@storybook/react';
import { CoinCardGridItem } from '../components/ui/CoinCardGridItem';

const meta: Meta<typeof CoinCardGridItem> = {
  title: 'Components/CoinCardGridItem',
  component: CoinCardGridItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component for displaying coins in a grid layout with hover effects and modal triggering.',
      },
    },
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Using data from the second coin in the coins array
export const Default: Story = {
  args: {
    title: "Faustina II",
    description: "Sestertius, obverse view",
    imageSrc: "1_faustina_II_sestertius_o_qnuswl",
  },
};

export const WithoutImage: Story = {
  args: {
    title: "Featured Coin",
    description: "Explore the details of our latest acquisition",
    imageSrc: undefined,
  },
};

export const AlternateView: Story = {
  args: {
    title: "Faustina II",
    description: "Sestertius, reverse view",
    imageSrc: "1_faustina_II_sestertius_r_hy1nu3",
  },
};

export const LongDescription: Story = {
  args: {
    title: "Roman Imperial Coin",
    description: "A beautifully preserved example of ancient Roman numismatics featuring intricate details and historical significance from the Imperial period",
    imageSrc: "1_faustina_II_sestertius_o_qnuswl",
  },
};