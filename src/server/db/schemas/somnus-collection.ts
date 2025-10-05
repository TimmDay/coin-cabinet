import { sql } from "drizzle-orm"
import { index, pgTable } from "drizzle-orm/pg-core"

// Somnus collection table
export const somnus_collection = pgTable(
  "somnus_collection",
  (d) => ({
    // Primary key and metadata
    id: d
      .bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity(),
    created_at: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    user_id: d.uuid().notNull(),

    // Basic coin information (matching Zod schema order)
    nickname: d.text().notNull(),
    authority: d.text().notNull(),
    denomination: d.text().notNull(),
    civ: d.text().notNull(), // Civilization/Culture
    civ_specific: d.text(), // Specific civilization details
    reign_start: d.integer(),
    reign_end: d.integer(),

    // Physical measurements
    diameter: d.real(), // in mm
    mass: d.doublePrecision(), // in grams
    die_axis: d.text(), // die alignment
    metal: d.text().notNull(),
    silver_content: d.real(), // percentage

    // Minting information
    mint: d.text(),
    mint_year_earliest: d.integer(),
    mint_year_latest: d.integer(),

    // Obverse details
    legend_o: d.text(), // Obverse legend/inscription
    desc_o: d.text(), // Obverse description

    // Reverse details
    legend_r: d.text(), // Reverse legend/inscription
    desc_r: d.text(), // Reverse description

    // Reference
    reference: d.text(),
    reference_link: d.text(),

    // Purchase information
    purchase_type: d.text(), // 'auction', 'auction aftermarket', 'retail', 'private', 'gift', 'inheritance', 'other'
    purchase_date: d.date(),
    price_aud: d.doublePrecision(),
    price_shipping_aud: d.doublePrecision(),
    purchase_vendor: d.text(),
    purchase_link: d.text(),
    vendor_grading_notes: d.text(), // Vendor grading notes

    // Auction details
    auction_name: d.text(),
    auction_lot: d.integer(),

    // Image links
    image_link_o: d.text(), // Obverse image link
    image_link_r: d.text(), // Reverse image link
    image_link_sketch_o: d.text(), // Obverse sketch image link
    image_link_sketch_r: d.text(), // Reverse sketch image link
    image_link_zoom_o: d.text(), // Obverse zoom photography URL
    image_link_zoom_r: d.text(), // Reverse zoom photography URL
    image_rotation: d.text().array(), // Array of image links with rotation suffixes

    // Additional information
    flavour_text: d.text(), // Descriptive flavor text about the coin
    antiquities_register: d.text(), // Antiquities register information
    provenance: d.text(),
    notes: d.text(),
    notes_history: d.text(),
  }),
  (t) => [
    index("somnus_collection_user_id_idx").on(t.user_id),
    index("somnus_collection_nickname_idx").on(t.nickname),
    index("somnus_collection_denomination_idx").on(t.denomination),
    index("somnus_collection_civ_idx").on(t.civ),
    index("somnus_collection_mint_idx").on(t.mint),
    index("somnus_collection_mint_year_earliest_idx").on(t.mint_year_earliest),
    index("somnus_collection_purchase_date_idx").on(t.purchase_date),
    index("somnus_collection_created_at_idx").on(t.created_at),
  ],
)

// Type inference for TypeScript
export type SomnusCollection = typeof somnus_collection.$inferSelect;
export type NewSomnusCollection = typeof somnus_collection.$inferInsert;
