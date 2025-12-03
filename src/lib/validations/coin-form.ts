import { z } from "zod"

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
    civ_specific: z.string().optional(),
    reign_start: z
      .number()
      .or(z.nan())
      .optional()
      .transform((val) => (Number.isNaN(val) ? undefined : val))
      .pipe(
        z
          .number()
          .int()
          .min(-1000, "Invalid start year")
          .max(2100, "Invalid start year")
          .optional(),
      ),
    reign_end: z
      .number()
      .or(z.nan())
      .optional()
      .transform((val) => (Number.isNaN(val) ? undefined : val))
      .pipe(
        z
          .number()
          .int()
          .min(-1000, "Invalid end year")
          .max(2100, "Invalid end year")
          .optional(),
      ),

    // Physical measurements
    diameter: z
      .number()
      .or(z.nan())
      .optional()
      .transform((val) => (Number.isNaN(val) ? undefined : val))
      .pipe(
        z
          .number()
          .min(0.1, "Diameter must be positive")
          .max(100, "Diameter too large")
          .optional(),
      ),
    mass: z
      .number()
      .or(z.nan())
      .optional()
      .transform((val) => (Number.isNaN(val) ? undefined : val))
      .pipe(
        z
          .number()
          .min(0.01, "Mass must be positive")
          .max(1000, "Mass too large")
          .optional(),
      ),
    die_axis: z.string().optional(),
    metal: z.string().min(1, "Metal is required").max(30, "Metal is too long"),
    silver_content: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val))
      .pipe(
        z
          .string()
          .refine(
            (val) => {
              if (!val) return true

              // Check if it's a range (contains a dash)
              if (val.includes("-")) {
                const parts = val.split("-")
                if (parts.length !== 2) return false

                const min = parts[0]?.trim()
                const max = parts[1]?.trim()
                if (!min || !max) return false

                const minNum = parseFloat(min)
                const maxNum = parseFloat(max)

                // Validate both numbers
                if (isNaN(minNum) || isNaN(maxNum)) return false
                if (minNum < 0 || maxNum < 0) return false
                if (minNum > 100 || maxNum > 100) return false
                if (minNum > maxNum) return false

                // Check decimal places (max 1)
                const minDecimals = (min.split(".")[1] ?? "").length
                const maxDecimals = (max.split(".")[1] ?? "").length
                if (minDecimals > 1 || maxDecimals > 1) return false

                return true
              } else {
                // Single number validation
                const num = parseFloat(val)
                if (isNaN(num)) return false
                if (num < 0 || num > 100) return false

                // Check decimal places (max 1)
                const decimals = (val.split(".")[1] ?? "").length
                if (decimals > 1) return false

                return true
              }
            },
            {
              message:
                "Silver content must be a number (0-100) or range (e.g., '45.0-55.0') with at most 1 decimal place",
            },
          )
          .optional(),
      ),

    // Minting information
    mint: z.string().optional(),
    mint_year_earliest: z
      .number()
      .or(z.nan())
      .optional()
      .transform((val) => (Number.isNaN(val) ? undefined : val))
      .pipe(
        z
          .number()
          .int()
          .min(-800, "Invalid mint year")
          .max(2025, "Invalid mint year")
          .optional(),
      ),
    mint_year_latest: z
      .number()
      .or(z.nan())
      .optional()
      .transform((val) => (Number.isNaN(val) ? undefined : val))
      .pipe(
        z
          .number()
          .int()
          .min(-1000, "Invalid mint year")
          .max(2100, "Invalid mint year")
          .optional(),
      ),

    // Obverse details
    legend_o: z.string().optional(),
    legend_o_expanded: z.string().optional(),
    legend_o_translation: z.string().optional(),
    desc_o: z.string().optional(),

    // Reverse details
    legend_r: z.string().optional(),
    legend_r_expanded: z.string().optional(),
    legend_r_translation: z.string().optional(),
    desc_r: z.string().optional(),

    // Reference
    reference: z.string().optional(),
    reference_link: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val))
      .pipe(z.string().url("Invalid URL").optional()),

    // Purchase information
    purchase_type: z.enum(
      [
        "auction",
        "auction aftermarket",
        "retail",
        "private",
        "gift",
        "inheritance",
        "other",
      ],
      {
        required_error: "Purchase type is required",
        invalid_type_error: "Please select a valid purchase type",
      },
    ),
    purchase_date: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val))
      .pipe(
        z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
          .optional(),
      ),
    price_aud: z
      .number()
      .or(z.nan())
      .optional()
      .transform((val) => (Number.isNaN(val) ? undefined : val))
      .pipe(z.number().min(0, "Price cannot be negative").optional()),
    price_shipping_aud: z
      .number()
      .or(z.nan())
      .optional()
      .transform((val) => (Number.isNaN(val) ? undefined : val))
      .pipe(z.number().min(0, "Shipping cost cannot be negative").optional()),
    purchase_vendor: z.string().optional(),
    purchase_link: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val))
      .pipe(z.string().url("Invalid URL").optional()),
    vendor_grading_notes: z.string().optional(),

    // Auction details
    auction_name: z.string().optional(),
    auction_lot: z
      .number()
      .or(z.nan())
      .optional()
      .transform((val) => (Number.isNaN(val) ? undefined : val))
      .pipe(
        z.number().int().min(0, "Lot number cannot be negative").optional(),
      ),

    // Image slugs
    image_link_o: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val))
      .pipe(z.string().optional()),
    image_link_r: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val))
      .pipe(z.string().optional()),
    image_link_sketch_o: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val))
      .pipe(z.string().optional()),
    image_link_sketch_r: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val))
      .pipe(z.string().optional()),
    image_link_altlight_o: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val))
      .pipe(z.string().optional()),
    image_link_altlight_r: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val))
      .pipe(z.string().optional()),
    image_link_zoom_o: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val))
      .pipe(z.string().optional()),
    image_link_zoom_r: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val))
      .pipe(z.string().optional()),

    // Additional information
    flavour_text: z.string().optional(),
    secondary_info: z.string().optional(),
    notable_features: z
      .array(
        z.object({
          name: z.string().min(1, "Feature name is required"),
          subtitle: z.string().optional(),
          description: z.string().optional(),
        }),
      )
      .optional(),
    deity_id: z.array(z.string()).optional(),
    historical_figures_id: z.array(z.string()).optional(),
    bpRoute: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((val) => {
        if (!val || val === "") return undefined
        // Split by comma and clean up whitespace
        return val
          .split(",")
          .map((route) => route.trim())
          .filter(Boolean)
      })
      .pipe(z.array(z.string()).optional()),
    sets: z.array(z.string()).optional(),
    antiquities_register: z.string().optional(),
    provenance: z.string().optional(),
    notes: z.string().optional(),
    notes_history: z.string().optional(),
    ex_collection: z.boolean().optional(),
  })
  .transform((data) => {
    // Auto-populate end years with start years if not provided
    const transformed = { ...data }

    // If reign_start is provided but reign_end is not, use reign_start as reign_end
    if (data.reign_start && !data.reign_end) {
      transformed.reign_end = data.reign_start
    }

    // If mint_year_earliest is provided but mint_year_latest is not, use earliest as latest
    if (data.mint_year_earliest && !data.mint_year_latest) {
      transformed.mint_year_latest = data.mint_year_earliest
    }

    return transformed
  })
  .refine(
    (data) => {
      // Custom validation: reign_end should be >= reign_start if both are provided
      if (data.reign_start && data.reign_end) {
        return data.reign_end >= data.reign_start
      }
      return true
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
        return data.mint_year_latest >= data.mint_year_earliest
      }
      return true
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
        return data.auction_lot !== undefined && data.auction_lot !== null
      }
      return true
    },
    {
      message: "Lot number is required when auction name is provided",
      path: ["auction_lot"],
    },
  )

export type CoinFormData = z.infer<typeof coinFormSchema>
