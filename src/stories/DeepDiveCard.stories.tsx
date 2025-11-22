import type { Meta, StoryObj } from "@storybook/nextjs"
import { DeepDiveCard } from "../components/ui/DeepDiveCard"

const meta = {
  title: "Components/DeepDiveCard",
  component: DeepDiveCard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A card component for displaying detailed information about gods, symbols, and other deep dive content. Features an accordion-style info section and is designed to be used in a flex layout underneath maps on deep dive pages.",
      },
    },
    backgrounds: {
      default: "app-background",
      values: [
        {
          name: "app-background",
          value: "hsl(218 23% 11%)", // --background CSS variable value
        },
        {
          name: "light",
          value: "#ffffff",
        },
      ],
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={{
          backgroundColor: "hsl(218 23% 11%)", // --background value
          color: "hsl(210 15% 96%)", // --foreground value
          minHeight: "100vh",
          padding: "2rem",
          fontFamily: "var(--font-sans, ui-sans-serif, system-ui, sans-serif)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Story />
        </div>
      </div>
    ),
  ],
  argTypes: {
    title: {
      description: "The main title of the card",
      control: { type: "text" },
    },
    subtitle: {
      description: "Subtitle for additional context",
      control: { type: "text" },
    },
    secondaryInfo: {
      description: "Secondary information content",
      control: { type: "text" },
    },
    primaryInfo: {
      description: "Primary information with historical context",
      control: { type: "text" },
    },
    footer: {
      description: "Footer text (usually styled greyish)",
      control: { type: "text" },
    },
    defaultOpen: {
      description: "Whether the accordion is open by default",
      control: { type: "boolean" },
    },
    className: {
      description: "Additional CSS classes",
      control: { type: "text" },
    },
  },
} satisfies Meta<typeof DeepDiveCard>

export default meta
type Story = StoryObj<typeof meta>

export const Concordia: Story = {
  args: {
    title: "Concordia",
    subtitle: "goddess of harmony and unity",
    primaryInfo:
      'Her name literally means "harmony" or "agreement" (from concordia, "with one heart"). She symbolized social order, political stability, and marital concord. She was the personified of an ideal, as opposed to a mythological figure.',
    secondaryInfo:
      "Often seen seated, wearing a long robe (stola). Holding a cornucopia (abundance) and a patera (libation dish), or sometimes two clasped hands or a caduceus (symbol of peace).",
    footer: "seated, stola, cornucopia, patera, caduceus",
    defaultOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Card showing information about Concordia with defaultOpen=true to override the default closed state. This demonstrates the full card with all content sections expanded.",
      },
    },
  },
}

export const ConcordiaCollapsed: Story = {
  args: {
    title: "Concordia",
    subtitle: "goddess of harmony and unity",
    primaryInfo:
      'Her name literally means "harmony" or "agreement" (from concordia, "with one heart"). She symbolized social order, political stability, and marital concord. She was the personified of an ideal, as opposed to a mythological figure.',
    secondaryInfo:
      "Often seen seated, wearing a long robe (stola). Holding a cornucopia (abundance) and a patera (libation dish), or sometimes two clasped hands or a caduceus (symbol of peace).",
    footer: "seated, stola, cornucopia, patera, caduceus",
    // defaultOpen: false is now the default, so we don't need to specify it
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same Concordia card using the new default closed state. Cards now start collapsed by default to show the compact state.",
      },
    },
  },
}

export const FlexLayout: Story = {
  args: {
    title: "Concordia",
    subtitle: "goddess of harmony and unity",
    defaultOpen: true,
  },
  render: () => (
    <div className="w-full space-y-4">
      {/* Simulate map area */}
      <div className="bg-muted/30 border-border text-foreground flex h-72 w-full items-center justify-center rounded-lg border text-lg">
        Map Area (100% width)
      </div>

      {/* Cards in separate columns - mobile stacks, desktop 2 independent columns */}
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
        {/* Left Column */}
        <div className="flex-1 space-y-2">
          <DeepDiveCard
            title="Concordia"
            subtitle="goddess of harmony and unity"
            primaryInfo='Her name literally means "harmony" or "agreement" (from concordia, "with one heart"). She symbolized social order, political stability, and marital concord. She was the personified of an ideal, as opposed to a mythological figure.'
            secondaryInfo="Often seen seated, wearing a long robe (stola). Holding a cornucopia (abundance) and a patera (libation dish), or sometimes two clasped hands or a caduceus (symbol of peace)."
            footer="seated, stola, cornucopia, patera, caduceus"
          />

          <DeepDiveCard
            title="Abundantia"
            subtitle="goddess of abundance and prosperity"
            secondaryInfo="Standing figure holding a cornucopia overflowing with fruits, grain, and coins. Sometimes shown scattering coins or grain from the cornucopia. Often depicted with wheat ears in her hair."
            primaryInfo="Abundantia represented the abundance and prosperity that came from successful governance and peaceful times. She was particularly prominent during periods of economic prosperity and good harvests."
            footer="cornucopia, fruits, grain, coins, wheat ears"
            defaultOpen={false}
          />
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-2">
          <DeepDiveCard
            title="Victoria"
            subtitle="goddess of victory"
            secondaryInfo="Standing or flying, wearing flowing robes. Often depicted with wings, holding a laurel wreath, palm branch, or trophy. Sometimes shown crowning a victor or inscribing victory on a shield."
            primaryInfo="Victoria was the personification of military success and triumph. She was closely associated with Jupiter and often appeared on coins celebrating military victories. Her Greek counterpart was Nike."
            footer="wings, laurel wreath, palm branch, trophy, shield"
          />

          <DeepDiveCard
            title="Libertas"
            subtitle="goddess of liberty and freedom"
            secondaryInfo="Standing female figure wearing a pileus (liberty cap) or with loose flowing hair. Often holds a rod or scepter, sometimes with a scepter, sometimes with a liberty cap on top. May hold a broken chain."
            primaryInfo="Libertas embodied the Roman concept of political freedom and was particularly significant during the Republic. She represented both personal liberty and the freedom of the Roman people from tyranny."
            footer="pileus, liberty cap, rod, scepter, broken chain"
            defaultOpen={false}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstration of multiple DeepDiveCards in separate column layout underneath a map. Cards stack vertically on mobile and form 2 independent columns on desktop. Each column can have different heights - when one card's accordion closes, only that card gets smaller while others maintain their size.",
      },
    },
  },
}

export const IndependentHeights: Story = {
  args: {
    title: "Mixed States",
    subtitle: "demonstrating independent card heights",
    defaultOpen: true,
  },
  render: () => (
    <div className="w-full space-y-4">
      {/* Cards with mixed accordion states to show independent heights */}
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
        {/* Left Column - one open, one closed */}
        <div className="flex-1 space-y-2">
          <DeepDiveCard
            title="Mars"
            subtitle="god of war (OPEN)"
            secondaryInfo="Standing in military dress, wearing armor and helmet. Often holds a spear and shield. Sometimes shown with wolf and woodpecker (his sacred animals)."
            primaryInfo="Mars was one of the most important Roman gods, second only to Jupiter. Unlike the Greek Ares, Mars was also a god of agriculture and fertility, representing the productive aspects of war and conquest."
            footer="armor, spear, shield, wolf, woodpecker"
            defaultOpen={true}
          />

          <DeepDiveCard
            title="Minerva"
            subtitle="goddess of wisdom (CLOSED)"
            footer="owl, olive branch, aegis, spear"
            defaultOpen={false}
          />
        </div>

        {/* Right Column - both open */}
        <div className="flex-1 space-y-2">
          <DeepDiveCard
            title="Jupiter"
            subtitle="king of gods (OPEN)"
            secondaryInfo="Seated on throne, bearded, holding thunderbolt and scepter. Often shown with eagle at his side. Portrayed as mature, dignified ruler."
            primaryInfo="Jupiter was the king of the Roman gods and god of sky and thunder. He was the patron deity of Rome and his temple on the Capitoline Hill was the most important in the city."
            footer="thunderbolt, scepter, eagle, throne"
            defaultOpen={true}
          />

          <DeepDiveCard
            title="Venus"
            subtitle="goddess of love (OPEN)"
            secondaryInfo="Beautiful woman, often partially draped. May hold apple of discord, mirror, or roses. Sometimes accompanied by Cupid or doves."
            primaryInfo="Venus was the goddess of love, beauty, and fertility. She was also the mother of Aeneas and thus the divine ancestor of the Roman people through the Julian line."
            footer="apple, mirror, roses, cupid, doves"
            defaultOpen={true}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates independent card heights - the left column has one open and one closed card, while the right column has both open. Notice how each card maintains its natural height without affecting others.",
      },
    },
  },
}

export const MinimalCard: Story = {
  args: {
    title: "Pax",
    subtitle: "goddess of peace",
    footer: "olive branch, caduceus, cornucopia",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A minimal card with just title, subtitle, and footer - no accordion content. Shows how the component handles optional props.",
      },
    },
  },
}
