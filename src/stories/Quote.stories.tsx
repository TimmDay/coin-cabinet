import type { Meta, StoryObj } from "@storybook/nextjs"
import { Quote } from "~/components/ui/Quote"

const meta: Meta<typeof Quote> = {
  title: "UI/Quote",
  component: Quote,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A reusable quote component with optional attribution and external link. Perfect for displaying historical quotes with proper citations.",
      },
    },
  },
  argTypes: {
    quote: {
      control: "text",
      description: "The main quote text to display",
    },
    attribution: {
      control: "text",
      description: "The attribution or source of the quote",
    },
    link: {
      control: "text",
      description:
        "Optional external link to the quote source (opens in new tab)",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story using the Severan Dynasty quote
export const Default: Story = {
  args: {
    quote:
      "Be harmonious with each other, enrich the soldiers, and scorn all other men.",
    attribution: "Cassius Dio, Roman History Book 77, Part 15",
    link: "https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Cassius_Dio/77*.html#15",
  },
}

// Quote without link
export const WithoutLink: Story = {
  args: {
    quote: "The die is cast.",
    attribution: "Julius Caesar",
  },
}

// Longer quote example
export const LongQuote: Story = {
  args: {
    quote:
      "I found Rome a city of bricks and left it a city of marble. I restored eighty-two temples in the city, omitting none that needed restoration at the time.",
    attribution: "Augustus, Res Gestae Divi Augusti",
    link: "https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Augustus/Res_Gestae/home.html",
  },
}

// Short quote example
export const ShortQuote: Story = {
  args: {
    quote: "Veni, vidi, vici.",
    attribution: "Julius Caesar",
  },
}
