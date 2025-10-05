import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { CoinCardDetail } from "~/components/ui/CoinCardDetail"
import { mockCoins } from "./mockCoins"

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
    imageSrc: {
      control: "text",
      description: "Cloudinary image identifier for the coin image",
    },
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>;

// Interactive story with carousel functionality
export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [focusTarget, setFocusTarget] = useState<"previous" | "next" | null>(
      null,
    )

    const currentCoin = mockCoins[currentIndex] ?? mockCoins[0]!
    const nextIndex =
      currentIndex === mockCoins.length - 1 ? 0 : currentIndex + 1
    const previousIndex =
      currentIndex === 0 ? mockCoins.length - 1 : currentIndex - 1
    const nextCoin = mockCoins[nextIndex]!
    const previousCoin = mockCoins[previousIndex]!

    const handlePrevious = () => {
      setCurrentIndex((prev) => (prev === 0 ? mockCoins.length - 1 : prev - 1))
      setFocusTarget("previous")
    }

    const handleNext = () => {
      setCurrentIndex((prev) => (prev === mockCoins.length - 1 ? 0 : prev + 1))
      setFocusTarget("next")
    }

    const handleClose = () => {
      setIsOpen(false)
      // Reopen after a short delay for demo purposes
      setTimeout(() => setIsOpen(true), 1000)
    }

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
          nextImageSrc={nextCoin.image_link_o}
          nextReverseImageSrc={nextCoin.image_link_r}
          previousImageSrc={previousCoin.image_link_o}
          previousReverseImageSrc={previousCoin.image_link_r}
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
          focusTarget={focusTarget}
        />
      </div>
    )
  },
}

// Single coin view (no navigation)
export const SingleCoin: Story = {
  args: {
    isOpen: true,
    imageSrc: mockCoins[0]!.image_link_o,
    reverseImageSrc: mockCoins[0]!.image_link_r,
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
    onClose: () => console.log("Close clicked"),
  },
}
