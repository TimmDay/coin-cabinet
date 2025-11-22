import type { Meta, StoryObj } from "@storybook/nextjs"
import { ScrollToTop } from "../components/ui/ScrollToTop"

const meta = {
  title: "Components/ScrollToTop",
  component: ScrollToTop,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A scroll-to-top button that appears when the user has scrolled down more than 300px. Only visible on mobile viewports (hidden on sm and above). Features smooth scrolling animation and hover effects.",
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
          minHeight: "200vh", // Make content tall enough to scroll
          padding: "2rem",
          fontFamily: "var(--font-sans, ui-sans-serif, system-ui, sans-serif)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ marginBottom: "2rem" }}>Scroll Down to Test</h1>
          <p style={{ marginBottom: "1rem" }}>
            This story demonstrates the ScrollToTop component. Scroll down on
            this page to see the button appear in the bottom right corner (only
            visible on mobile viewports).
          </p>
          <div style={{ height: "100vh" }}>
            <p>Keep scrolling...</p>
          </div>
          <div style={{ height: "100vh" }}>
            <p>The button should appear now (on mobile viewports only)</p>
          </div>
          <div style={{ height: "100vh" }}>
            <p>Click the button to scroll back to top smoothly</p>
          </div>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof ScrollToTop>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The default ScrollToTop component. Appears when scrolled down more than 300px and only shows on mobile viewports. Features a circular muted button with backdrop blur and an upward chevron icon, matching the ViewModeControls color scheme.",
      },
    },
  },
}

export const AlwaysVisible: Story = {
  render: () => (
    <button
      className="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-700/40 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-slate-600/40 focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:outline-none"
      aria-label="Scroll to top"
    >
      <svg
        className="h-6 w-6 text-slate-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Shows the button in its visible state for design reference. This version is always visible (ignoring the sm:hidden class) to demonstrate the muted color scheme, backdrop blur effect, and hover interactions.",
      },
    },
  },
}
