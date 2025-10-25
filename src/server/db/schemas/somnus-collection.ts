import { sql } from "drizzle-orm"
import { index, pgTable } from "drizzle-orm/pg-core"

// Somnus collection table
export const somnus_collection = pgTable(
  "somnus_collection",
  (d) => ({
    // Primary key and metadata
    id: d.bigint({ mode: "number" }).primaryKey().notNull(),
    created_at: d
      .timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    user_id: d.uuid("user_id").notNull(),

    // Basic coin information
    nickname: d.text().notNull(),
    authority: d.text().notNull(),
    denomination: d.text().notNull(),
    civ: d.text().notNull(),
    civ_specific: d.text("civ_specific"),
    reign_start: d.integer("reign_start"),
    reign_end: d.integer("reign_end"),

    // Physical measurements
    diameter: d.real(),
    mass: d.doublePrecision(),
    die_axis: d.text("die_axis"),
    metal: d.text().notNull(),
    silver_content: d.text("silver_content"), // Changed to text to support ranges like "45.0-55.0"

    // Minting information
    mint: d.text(),
    mint_year_earliest: d.integer("mint_year_earliest"),
    mint_year_latest: d.integer("mint_year_latest"),

    // Obverse details
    legend_o: d.text("legend_o"),
    legend_o_expanded: d.text("legend_o_expanded"),
    legend_o_translation: d.text("legend_o_translation"),
    desc_o: d.text("desc_o"),

    // Reverse details
    legend_r: d.text("legend_r"),
    legend_r_expanded: d.text("legend_r_expanded"),
    legend_r_translation: d.text("legend_r_translation"),
    desc_r: d.text("desc_r"),

    // Reference
    reference: d.text(),
    reference_link: d.text("reference_link"),

    // Purchase information
    purchase_type: d.text("purchase_type"),
    purchase_date: d.date("purchase_date"),
    price_aud: d.doublePrecision("price_aud"),
    price_shipping_aud: d.doublePrecision("price_shipping_aud"),
    purchase_vendor: d.text("purchase_vendor"),
    purchase_link: d.text("purchase_link"),
    vendor_grading_notes: d.text("vendor_grading_notes"),

    // Auction details
    auction_name: d.text("auction_name"),
    auction_lot: d.integer("auction_lot"),

    // Image links
    image_link_o: d.text("image_link_o"),
    image_link_r: d.text("image_link_r"),
    image_link_sketch_o: d.text("image_link_sketch_o"),
    image_link_sketch_r: d.text("image_link_sketch_r"),
    image_link_zoom_o: d.text("image_link_zoom_o"),
    image_link_zoom_r: d.text("image_link_zoom_r"),
    image_rotation: d.text("image_rotation").array(),

    // Additional information
    flavour_text: d.text("flavour_text"),
    godName: d.text("godName"),
    bpRoute: d.text("bpRoute").array(),
    antiquities_register: d.text("antiquities_register"),
    provenance: d.text(),
    notes: d.text(),
    notes_history: d.text("notes_history"),

    // Set classifications
    sets: d.text().array(), // Array of set names this coin belongs to

    // Collection status
    ex_collection: d.boolean("ex_collection").default(false), // Whether the coin is no longer in collection
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
export type SomnusCollection = typeof somnus_collection.$inferSelect
export type NewSomnusCollection = typeof somnus_collection.$inferInsert
