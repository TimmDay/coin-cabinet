import { z } from "zod";

// Helper function to convert empty strings to undefined for optional numeric fields
const optionalNumber = (schema: z.ZodNumber) =>
  z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    schema.optional(),
  );

// Helper function to convert empty strings to undefined for optional URL fields
const optionalUrl = () =>
  z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url("Invalid URL").optional(),
  );

// Helper function to convert empty strings to undefined for optional string fields
const optionalString = () =>
  z.preprocess((val) => (val === "" ? undefined : val), z.string().optional());

export const coinFormSchema = z
  .object({
    // Basic coin information
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    authority: z
      .string()
      .min(1, "Authority is required")
      .max(100, "Authority is too long"),
    denomination: z
      .string()
      .min(1, "Denomination is required")
      .max(50, "Denomination is too long"),
    civ: z
      .string()
      .min(1, "Civilization is required")
      .max(50, "Civilization is too long"),
    reign_start: optionalNumber(
      z
        .number()
        .int()
        .min(-1000, "Invalid start year")
        .max(2100, "Invalid start year"),
    ),
    reign_end: optionalNumber(
      z
        .number()
        .int()
        .min(-1000, "Invalid end year")
        .max(2100, "Invalid end year"),
    ),

    // Physical characteristics

    // Physical measurements
    diameter: optionalNumber(
      z
        .number()
        .min(0.1, "Diameter must be positive")
        .max(100, "Diameter too large"),
    ),
    mass: optionalNumber(
      z.number().min(0.01, "Mass must be positive").max(1000, "Mass too large"),
    ),
    die_axis: optionalString(),
    metal: z.string().min(1, "Metal is required").max(30, "Metal is too long"),
    silver_content: optionalNumber(
      z
        .number()
        .min(0, "Silver content cannot be negative")
        .max(100, "Invalid silver content"),
    ),
    // Minting information
    mint: optionalString(),
    mint_year_earliest: optionalNumber(
      z
        .number()
        .int()
        .min(-800, "Invalid mint year")
        .max(2025, "Invalid mint year"),
    ),
    mint_year_latest: optionalNumber(
      z
        .number()
        .int()
        .min(-1000, "Invalid mint year")
        .max(2100, "Invalid mint year"),
    ),

    // Obverse details
    legend_o: optionalString(),
    desc_o: optionalString(),

    // Reverse details
    legend_r: optionalString(),
    desc_r: optionalString(),

    // Reference
    reference: optionalString(),
    reference_link: optionalUrl(),

    // Purchase information
    purchase_type: z
      .enum(["auction", "retail", "private", "gift", "inheritance", "other"])
      .optional(),
    purchase_date: optionalString(),
    price_aud: optionalNumber(z.number().min(0, "Price cannot be negative")),
    price_shipping_aud: optionalNumber(
      z.number().min(0, "Shipping cost cannot be negative"),
    ),
    purchase_vendor: optionalString(),
    purchase_link: optionalUrl(),

    // Auction details
    auction_name: optionalString(),
    auction_lot: optionalNumber(
      z.number().int().min(1, "Lot number must be positive"),
    ),

    // Additional information
    provenance: optionalString(),
    notes: optionalString(),
    notes_history: optionalString(),
  })
  .refine(
    (data) => {
      // Custom validation: reign_end should be >= reign_start if both are provided
      if (data.reign_start && data.reign_end) {
        return data.reign_end >= data.reign_start;
      }
      return true;
    },
    {
      message: "Reign end year must be after or equal to start year",
      path: ["reign_end"],
    },
  )
  .refine(
    (data) => {
      // Custom validation: mint_year_latest should be >= mint_year_earliest if both are provided
      if (data.mint_year_latest && data.mint_year_earliest) {
        return data.mint_year_latest >= data.mint_year_earliest;
      }
      return true;
    },
    {
      message: "Can't be before earliest mint year",
      path: ["mint_year_latest"],
    },
  )
  .refine(
    (data) => {
      // Custom validation: auction_lot is required if auction_name is provided
      if (data.auction_name && data.auction_name.trim() !== "") {
        return data.auction_lot !== undefined && data.auction_lot !== null;
      }
      return true;
    },
    {
      message: "Lot number is required when auction name is provided",
      path: ["auction_lot"],
    },
  );

export type CoinFormData = z.infer<typeof coinFormSchema>;
