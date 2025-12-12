// Define all available feature flags in one central location
export const FEATURE_FLAGS = {
  dev: {
    name: "dev",
    displayName: "Development Features",
    description:
      "Enables development-only features like the Caracalla and Geta blog post",
  },
  "map-feature": {
    name: "map-feature",
    displayName: "Map Features",
    description: "Enables experimental map-related features and functionality",
  },
  "show-hidden-coins": {
    name: "show-hidden-coins",
    displayName: "Show Hidden Coins",
    description: "When enabled, coins marked as 'isHidden' will be visible in the collection.",
  },
} as const

// Extract the available feature flag names as a union type
export type FeatureFlagName = keyof typeof FEATURE_FLAGS

// Get array of all available feature flags for iteration
export const AVAILABLE_FEATURE_FLAGS = Object.values(FEATURE_FLAGS)

// Type for feature flag configuration
export type FeatureFlagConfig = {
  name: string
  displayName: string
  description: string
}
