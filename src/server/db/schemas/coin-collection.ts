import { sql } from "drizzle-orm";
import { index, pgTable } from "drizzle-orm/pg-core";

// TODO: set up this table as a dev env only table.
// Use pgTable directly for existing Supabase table (no prefix)
export const coin_collection = pgTable(
  "coin_collection",
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

    // Basic coin information (matching Zod schema order)
    name: d.text().notNull(),
    authority: d.text().notNull(),
    denomination: d.text().notNull(),
    civ: d.text().notNull(), // Civilization/Culture
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
    purchase_type: d.text(), // 'auction', 'retail', 'private', 'gift', 'inheritance', 'other'
    purchase_date: d.date(),
    price_aud: d.doublePrecision(),
    price_shipping_aud: d.doublePrecision(),
    purchase_vendor: d.text(),
    purchase_link: d.text(),

    // Auction details
    auction_name: d.text(),
    auction_lot: d.integer(),

    // Additional information
    provenance: d.text(),
    notes: d.text(),
    notes_history: d.text(),
  }),
  (t) => [
    index("coin_collection_name_idx").on(t.name),
    index("coin_collection_authority_idx").on(t.authority),
    index("coin_collection_denomination_idx").on(t.denomination),
    index("coin_collection_civ_idx").on(t.civ),
    index("coin_collection_metal_idx").on(t.metal),
    index("coin_collection_mint_idx").on(t.mint),
    index("coin_collection_purchase_date_idx").on(t.purchase_date),
    index("coin_collection_created_at_idx").on(t.created_at),
  ],
);

// Type inference for TypeScript
export type CoinCollection = typeof coin_collection.$inferSelect;
export type NewCoinCollection = typeof coin_collection.$inferInsert;
