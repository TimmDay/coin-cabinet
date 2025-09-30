import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { CoinCardDetail } from "~/components/ui/CoinCardDetail";
import { mockCoins } from "./mockCoins";

const meta: Meta<typeof CoinCardDetail> = {
  title: "Components/CoinCardDetail",
  component: CoinCardDetail,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A detailed modal view for individual coins with carousel navigation. Features smooth slide transitions, keyboard navigation, and focus management.",
      },
    },
  },
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Controls whether the modal is visible",
    },
    title: {
      control: "text",
      description: "The title displayed in the modal",
    },
    description: {
      control: "text",
      description: "The description text shown below the title",
    },
    imageSrc: {
      control: "text",
      description: "Cloudinary image identifier for the coin image",
    },
    currentIndex: {
      control: "number",
      description:
        "Current index in the carousel (for external state management)",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story with carousel functionality
export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [focusTarget, setFocusTarget] = useState<"previous" | "next" | null>(
      null,
    );

    const currentCoin = mockCoins[currentIndex] ?? mockCoins[0]!;

    const handlePrevious = () => {
      setCurrentIndex((prev) => (prev === 0 ? mockCoins.length - 1 : prev - 1));
      setFocusTarget("previous");
    };

    const handleNext = () => {
      setCurrentIndex((prev) => (prev === mockCoins.length - 1 ? 0 : prev + 1));
      setFocusTarget("next");
    };

    const handleClose = () => {
      setIsOpen(false);
      // Reopen after a short delay for demo purposes
      setTimeout(() => setIsOpen(true), 1000);
    };

    const handleFocusTargetHandled = () => {
      setFocusTarget(null);
    };

    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-slate-200">
            CoinCardDetail Interactive Demo
          </h1>
          <p className="mb-8 text-slate-400">
            Click the arrows or use keyboard navigation (←/→) to browse through
            coins. Press Escape to close (it will reopen automatically for
            demo).
          </p>
          <div className="text-slate-300">
            <p>
              Current: {currentCoin.nickname} {currentCoin.denomination}
            </p>
            <p>
              Index: {currentIndex + 1} of {mockCoins.length}
            </p>
          </div>
        </div>

        <CoinCardDetail
          isOpen={isOpen}
          onClose={handleClose}
          imageSrc={currentCoin.image_link_o}
          reverseImageSrc={currentCoin.image_link_r}
          title={`${currentCoin.nickname} ${currentCoin.denomination}`}
          description={`${currentCoin.civ} coin, ${currentCoin.mint_year_earliest}–${currentCoin.mint_year_latest} CE. ${currentCoin.desc_o}`}
          civ={currentCoin.civ}
          denomination={currentCoin.denomination}
          mint={currentCoin.mint}
          mint_year_earliest={currentCoin.mint_year_earliest}
          mint_year_latest={currentCoin.mint_year_latest}
          diameter={currentCoin.diameter}
          mass={currentCoin.mass}
          die_axis={currentCoin.die_axis}
          legend_o={currentCoin.legend_o}
          desc_o={currentCoin.desc_o}
          legend_r={currentCoin.legend_r}
          desc_r={currentCoin.desc_r}
          reference={currentCoin.reference}
          provenance={currentCoin.provenance || undefined}
          flavour_text={currentCoin.flavour_text || undefined}
          onPrevious={handlePrevious}
          onNext={handleNext}
          currentIndex={currentIndex}
          focusTarget={focusTarget}
          onFocusTargetHandled={handleFocusTargetHandled}
        />
      </div>
    );
  },
};

// Single coin view (no navigation)
export const SingleCoin: Story = {
  args: {
    isOpen: true,
    imageSrc: mockCoins[0]!.image_link_o,
    reverseImageSrc: mockCoins[0]!.image_link_r,
    title: `${mockCoins[0]!.nickname} ${mockCoins[0]!.denomination}`,
    description: `${mockCoins[0]!.civ} coin, ${mockCoins[0]!.mint_year_earliest}–${mockCoins[0]!.mint_year_latest} CE. ${mockCoins[0]!.desc_o}`,
    civ: mockCoins[0]!.civ,
    denomination: mockCoins[0]!.denomination,
    mint: mockCoins[0]!.mint,
    mint_year_earliest: mockCoins[0]!.mint_year_earliest,
    mint_year_latest: mockCoins[0]!.mint_year_latest,
    diameter: mockCoins[0]!.diameter,
    mass: mockCoins[0]!.mass,
    die_axis: mockCoins[0]!.die_axis,
    legend_o: mockCoins[0]!.legend_o,
    desc_o: mockCoins[0]!.desc_o,
    legend_r: mockCoins[0]!.legend_r,
    desc_r: mockCoins[0]!.desc_r,
    reference: mockCoins[0]!.reference,
    provenance: mockCoins[0]!.provenance || undefined,
    flavour_text: mockCoins[0]!.flavour_text || undefined,
    currentIndex: 0,
    onClose: () => console.log("Close clicked"),
  },
};

// Closed state
export const Closed: Story = {
  args: {
    isOpen: false,
    imageSrc: mockCoins[1]!.image_link_o,
    reverseImageSrc: mockCoins[1]!.image_link_r,
    title: `${mockCoins[1]!.nickname} ${mockCoins[1]!.denomination}`,
    description: `${mockCoins[1]!.civ} coin, ${mockCoins[1]!.mint_year_earliest}–${mockCoins[1]!.mint_year_latest} CE.`,
    civ: mockCoins[1]!.civ,
    denomination: mockCoins[1]!.denomination,
    mint: mockCoins[1]!.mint,
    mint_year_earliest: mockCoins[1]!.mint_year_earliest,
    mint_year_latest: mockCoins[1]!.mint_year_latest,
    diameter: mockCoins[1]!.diameter,
    mass: mockCoins[1]!.mass,
    die_axis: mockCoins[1]!.die_axis,
    legend_o: mockCoins[1]!.legend_o,
    desc_o: mockCoins[1]!.desc_o,
    legend_r: mockCoins[1]!.legend_r,
    desc_r: mockCoins[1]!.desc_r,
    reference: mockCoins[1]!.reference,
    provenance: mockCoins[1]!.provenance || undefined,
    flavour_text: mockCoins[1]!.flavour_text || undefined,
    onClose: () => console.log("Close clicked"),
  },
  render: (args) => (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="text-center text-slate-400">
        <p>
          Modal is closed. In a real app, this would show the underlying page
          content.
        </p>
        <p className="mt-2 text-sm">Set isOpen to true to see the modal.</p>
      </div>
      <CoinCardDetail {...args} />
    </div>
  ),
};

// With navigation controls
export const WithNavigation: Story = {
  args: {
    isOpen: true,
    imageSrc: mockCoins[2]!.image_link_o,
    reverseImageSrc: mockCoins[2]!.image_link_r,
    title: `${mockCoins[2]!.nickname} ${mockCoins[2]!.denomination}`,
    description: `${mockCoins[2]!.civ} coin, ${mockCoins[2]!.mint_year_earliest}–${mockCoins[2]!.mint_year_latest} CE. ${mockCoins[2]!.desc_o}`,
    civ: mockCoins[2]!.civ,
    denomination: mockCoins[2]!.denomination,
    mint: mockCoins[2]!.mint,
    mint_year_earliest: mockCoins[2]!.mint_year_earliest,
    mint_year_latest: mockCoins[2]!.mint_year_latest,
    diameter: mockCoins[2]!.diameter,
    mass: mockCoins[2]!.mass,
    die_axis: mockCoins[2]!.die_axis,
    legend_o: mockCoins[2]!.legend_o,
    desc_o: mockCoins[2]!.desc_o,
    legend_r: mockCoins[2]!.legend_r,
    desc_r: mockCoins[2]!.desc_r,
    reference: mockCoins[2]!.reference,
    provenance: mockCoins[2]!.provenance || undefined,
    flavour_text: mockCoins[2]!.flavour_text || undefined,
    currentIndex: 2,
    onPrevious: () => console.log("Previous clicked"),
    onNext: () => console.log("Next clicked"),
    onClose: () => console.log("Close clicked"),
  },
};
