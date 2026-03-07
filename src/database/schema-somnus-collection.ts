// ============================================================================
// SOMNUS COLLECTION - Your coin collection (CURRENT schema - not yet normalized)
// ============================================================================
export type NotableFeature = {
  name: string
  subtitle?: string
  description?: string
}

export type SomnusCollection = {
  // Primary key and metadata
  id: number
  created_at: string
  user_id: string

  // Basic coin information
  nickname: string
  authority: string
  denomination: string
  civ: string
  civ_specific?: string | null

  // Physical measurements
  diameter?: number | null
  mass?: number | null
  die_axis?: string | null
  metal: string
  silver_content?: string | null

  // Minting information
  mint_id?: number | null
  mint_year_earliest?: number | null
  mint_year_latest?: number | null

  // Obverse details
  legend_o?: string | null
  legend_o_expanded?: string | null
  legend_o_translation?: string | null
  desc_o?: string | null

  // Reverse details
  legend_r?: string | null
  legend_r_expanded?: string | null
  legend_r_translation?: string | null
  desc_r?: string | null

  // Reference
  reference?: string | null
  reference_link?: string | null

  // Purchase information
  purchase_type: string | null
  purchase_date: string | null
  price_aud: number | null
  price_shipping_aud: number | null
  purchase_vendor: string | null
  purchase_link: string | null
  vendor_grading_notes: string | null
  auction_name?: string | null
  auction_lot?: number | null

  // Image links
  image_link_o: string | null
  image_link_r: string | null
  image_link_altlight_o: string | null
  image_link_altlight_r: string | null
  image_link_sketch_o: string | null
  image_link_sketch_r: string | null
  image_link_zoom_o: string | null
  image_link_zoom_r: string | null
  image_rotation: string[] | null

  // Additional information
  flavour_text?: string | null
  flavour_desc?: string | null
  flavour_img?: string[] | null
  bpRoute?: string[] | null
  antiquities_register?: string | null
  provenance?: string | null
  notes?: string | null
  notes_history?: string | null

  // Set classifications
  sets?: string[] | null
  notable_features?: NotableFeature[] | null

  // Collection status
  ex_collection?: boolean | null
  is_hidden?: boolean | null

  // joins
  deity_id?: string[] | null
  historical_figures_id?: string[] | null
  timelines_id?: number[] | null
}

export const SOMNUS_COLLECTION_SELECT_FIELDS = [
  "id",
  "created_at",
  "user_id",
  "nickname",
  "authority",
  "denomination",
  "civ",
  "civ_specific",
  "diameter",
  "mass",
  "die_axis",
  "metal",
  "silver_content",
  "mint_id",
  "mint_year_earliest",
  "mint_year_latest",
  "legend_o",
  "legend_o_expanded",
  "legend_o_translation",
  "desc_o",
  "legend_r",
  "legend_r_expanded",
  "legend_r_translation",
  "desc_r",
  "reference",
  "reference_link",
  "purchase_type",
  "purchase_date",
  "price_aud",
  "price_shipping_aud",
  "purchase_vendor",
  "purchase_link",
  "vendor_grading_notes",
  "auction_name",
  "auction_lot",
  "image_link_o",
  "image_link_r",
  "image_link_altlight_o",
  "image_link_altlight_r",
  "image_link_sketch_o",
  "image_link_sketch_r",
  "image_link_zoom_o",
  "image_link_zoom_r",
  "image_rotation",
  "flavour_text",
  "flavour_desc",
  "flavour_img",
  "bpRoute",
  "antiquities_register",
  "provenance",
  "notes",
  "notes_history",
  "sets",
  "notable_features",
  "ex_collection",
  "is_hidden",
  "deity_id",
  "historical_figures_id",
  "timelines_id",
] as const

export const SOMNUS_COLLECTION_SELECT =
  SOMNUS_COLLECTION_SELECT_FIELDS.join(", ")
