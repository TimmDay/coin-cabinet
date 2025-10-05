/**
 * Utility functions for generating consistent image IDs
 */

/**
 * Format coin ID date from purchase date (YYYYMMDD
 */
function formatCoinIdDate(date: string): string {
  if (!date) return "";
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * Generate root slug from nickname and denomination in kebab-case
 */
export function generateRootSlug(nick: string, denom: string): string {
  if (!nick && !denom) return "";

  // Combine nickname and denomination, convert to kebab-case
  const combined = `${nick} ${denom}`.trim();
  return combined
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9\-]/g, "") // Remove special characters except hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Generate source slug from vendor name with 'src-' prefix
 */
export function generateSourceSlug(vendorName: string): string {
  if (!vendorName) return "src";

  // Convert vendor name to kebab-case and prefix with 'src-'
  const kebabVendor = vendorName
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9\-]/g, "") // Remove special characters except hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

  return `src-${kebabVendor}`;
}

/**
 * Generate complete image ID for a specific view with validation
 */
export function generateImageId(
  nickname: string,
  denomination: string,
  purchaseDate: string,
  vendor: string,
  view: string,
  timTookPhotos = false,
): string {
  const coinId = formatCoinIdDate(purchaseDate);
  const rootSlug = generateRootSlug(nickname, denomination);
  const sourceSlug = timTookPhotos ? "src-timmday" : generateSourceSlug(vendor);
  const isValidSource =
    timTookPhotos || Boolean(vendor && vendor.trim().length > 0);

  if (!coinId || !rootSlug || !isValidSource) return "";

  return `${coinId}__${rootSlug}__${view}__${sourceSlug}`;
}

/**
 * Check if source is valid for image ID generation
 */
export function hasValidSource(vendor: string, timTookPhotos = false): boolean {
  return timTookPhotos || Boolean(vendor && vendor.trim().length > 0);
}
