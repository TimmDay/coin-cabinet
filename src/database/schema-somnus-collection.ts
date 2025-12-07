// ============================================================================
// SOMNUS COLLECTION - Your coin collection (CURRENT schema - not yet normalized)
// ============================================================================
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
  reign_start?: number | null
  reign_end?: number | null

  // Physical measurements
  diameter?: number | null
  mass?: number | null
  die_axis?: string | null
  metal: string
  silver_content?: string | null

  // Minting information
  mint?: string | null
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
  isHidden?: boolean | null

  // joins
  deity_id?: string[] | null
  historical_figures_id?: string[] | null
}
