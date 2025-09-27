import { z } from "zod";

export const coinFormSchema = z
  .object({
    // Basic coin information
    nickname: z
      .string()
      .min(1, "Nickname is required")
      .max(100, "Nickname is too long"),
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
    reign_start: z
      .number()
      .int()
      .min(-1000, "Invalid start year")
      .max(2100, "Invalid start year")
      .optional(),
    reign_end: z
      .number()
      .int()
      .min(-1000, "Invalid end year")
      .max(2100, "Invalid end year")
      .optional(),

    // Physical measurements
    diameter: z
      .number()
      .min(0.1, "Diameter must be positive")
      .max(100, "Diameter too large")
      .optional(),
    mass: z
      .number()
      .min(0.01, "Mass must be positive")
      .max(1000, "Mass too large")
      .optional(),
    die_axis: z.string().optional(),
    metal: z.string().min(1, "Metal is required").max(30, "Metal is too long"),
    silver_content: z
      .number()
      .min(0, "Silver content cannot be negative")
      .max(100, "Invalid silver content")
      .optional(),

    // Minting information
    mint: z.string().optional(),
    mint_year_earliest: z
      .number()
      .int()
      .min(-800, "Invalid mint year")
      .max(2025, "Invalid mint year")
      .optional(),
    mint_year_latest: z
      .number()
      .int()
      .min(-1000, "Invalid mint year")
      .max(2100, "Invalid mint year")
      .optional(),

    // Obverse details
    legend_o: z.string().optional(),
    desc_o: z.string().optional(),

    // Reverse details
    legend_r: z.string().optional(),
    desc_r: z.string().optional(),

    // Reference
    reference: z.string().optional(),
    reference_link: z.string().url("Invalid URL").optional(),

    // Purchase information
    purchase_type: z
      .enum([
        "auction",
        "auction aftermarket",
        "retail",
        "private",
        "gift",
        "inheritance",
        "other",
      ])
      .optional(),
    purchase_date: z.string().optional(),
    price_aud: z.number().min(0, "Price cannot be negative").optional(),
    price_shipping_aud: z
      .number()
      .min(0, "Shipping cost cannot be negative")
      .optional(),
    purchase_vendor: z.string().optional(),
    purchase_link: z.string().url("Invalid URL").optional(),
    vendor_grading_notes: z.string().optional(),

    // Auction details
    auction_name: z.string().optional(),
    auction_lot: z
      .number()
      .int()
      .min(0, "Lot number cannot be negative")
      .optional(),

    // Image links
    image_link_o: z.string().url("Invalid URL").optional(),
    image_link_r: z.string().url("Invalid URL").optional(),
    image_link_zoom_o: z.string().url("Invalid URL").optional(),
    image_link_zoom_r: z.string().url("Invalid URL").optional(),

    // Additional information
    flavour_text: z.string().optional(),
    antiquities_register: z.string().optional(),
    provenance: z.string().optional(),
    notes: z.string().optional(),
    notes_history: z.string().optional(),
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
