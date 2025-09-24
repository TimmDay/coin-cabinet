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

    // Reign period
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
    denomination: z
      .string()
      .min(1, "Denomination is required")
      .max(50, "Denomination is too long"),
    civ: z
      .string()
      .min(1, "Civilization is required")
      .max(50, "Civilization is too long"),
    metal: z.string().min(1, "Metal is required").max(30, "Metal is too long"),

    // Obverse details
    legend_o: optionalString(),
    desc_o: optionalString(),
    name_o: optionalString(),

    // Reverse details
    legend_r: optionalString(),
    desc_r: optionalString(),
    name_r: optionalString(),

    // Minting information
    mint: optionalString(),
    mint_year_acbc: optionalString(),
    mint_year: optionalNumber(
      z
        .number()
        .int()
        .min(-1000, "Invalid mint year")
        .max(2100, "Invalid mint year"),
    ),

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

    // Reference
    reference: optionalString(),

    // Purchase information
    purchase_type: z
      .enum(["auction", "dealer", "private", "gift", "inheritance", "other"])
      .optional(),
    price_aud: optionalNumber(z.number().min(0, "Price cannot be negative")),
    price_shipping_aud: optionalNumber(
      z.number().min(0, "Shipping cost cannot be negative"),
    ),
    purchase_date: optionalString(),
    purchase_vendor: optionalString(),

    // Auction details
    auction_name: optionalString(),
    auction_lot: optionalNumber(
      z.number().int().min(1, "Lot number must be positive"),
    ),
    purchase_link: optionalUrl(),

    // Additional information
    provenance: optionalString(),
    grading_vendor: optionalString(),
    notes: optionalString(),
    notes_history: optionalString(),
    reference_link: optionalUrl(),
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
  );

export type CoinFormData = z.infer<typeof coinFormSchema>;

// Explicit type for form data to ensure compatibility
export type CoinFormInputData = {
  name: string;
  authority: string;
  reign_start?: number;
  reign_end?: number;
  denomination: string;
  civ: string;
  metal: string;
  legend_o?: string;
  desc_o?: string;
  name_o?: string;
  legend_r?: string;
  desc_r?: string;
  name_r?: string;
  mint?: string;
  mint_year_acbc?: string;
  mint_year?: number;
  diameter?: number;
  mass?: number;
  die_axis?: string;
  reference?: string;
  purchase_type?:
    | "auction"
    | "dealer"
    | "private"
    | "gift"
    | "inheritance"
    | "other";
  price_aud?: number;
  price_shipping_aud?: number;
  purchase_date?: string;
  purchase_vendor?: string;
  auction_name?: string;
  auction_lot?: number;
  purchase_link?: string;
  provenance?: string;
  grading_vendor?: string;
  notes?: string;
  notes_history?: string;
  reference_link?: string;
};
