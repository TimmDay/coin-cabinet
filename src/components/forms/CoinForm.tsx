// TODO: look into these later
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImageNamingTool } from "~/components/ui/ImageNamingTool";
import { RoundButton } from "~/components/ui/RoundButton";
import { Select } from "~/components/ui/Select";
import { coinFormSchema, type CoinFormData } from "~/lib/validations/coin-form";
import {
  authorityOptions,
  civilizationOptions,
  denominationOptions,
  dieAxisOptions,
} from "./constants";

type CoinFormProps = {
  onSubmit: (data: CoinFormData) => Promise<void>;
  isLoading: boolean;
};

export function CoinForm({ onSubmit, isLoading }: CoinFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CoinFormData>({
    resolver: zodResolver(coinFormSchema) as any,
    defaultValues: {
      purchase_type: "auction",
      purchase_date: new Date().toISOString().split("T")[0],
    },
  });

  const handleFormSubmit = async (data: CoinFormData) => {
    try {
      await onSubmit(data);

      // Don't clear form on success for now to allow multiple similar entries.
      // Clear form button is at base.
      reset(); // Clear form on success
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded border border-slate-600 bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-colors";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1";
  const errorClass = "text-red-400 text-sm mt-1";

  return (
    <div className="relative">
      {/* Main centered form */}
      <div className="artemis-card mx-auto w-full max-w-4xl p-8">
        <h2 className="mb-6 text-3xl font-bold">
          <span className="text-auth-accent">Add New Coin</span>
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-auth-accent mb-4 text-xl font-semibold">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="nickname">
                  Nickname*
                </label>
                <input
                  {...register("nickname")}
                  id="nickname"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., Marcus Aurelius Denarius"
                />
                {errors.nickname && (
                  <p className={errorClass}>{errors.nickname.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="authority">
                  Authority*
                </label>
                <Select
                  {...register("authority")}
                  id="authority"
                  options={authorityOptions}
                  placeholder={"Select authority"}
                  error={errors.authority?.message}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="denomination">
                  Denomination*
                </label>
                <Select
                  {...register("denomination")}
                  id="denomination"
                  options={denominationOptions}
                  placeholder="Select denomination"
                  error={errors.denomination?.message}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="civ">
                  Civilization*
                </label>
                <Select
                  {...register("civ")}
                  id="civ"
                  options={civilizationOptions}
                  placeholder="Select Civilization"
                  error={errors.civ?.message}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="reign_start">
                  Reign Start Year
                </label>
                <input
                  {...register("reign_start", { valueAsNumber: true })}
                  id="reign_start"
                  type="number"
                  className={inputClass}
                  placeholder="e.g., 161"
                />
                {errors.reign_start && (
                  <p className={errorClass}>{errors.reign_start.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="reign_end">
                  Reign End Year
                </label>
                <input
                  {...register("reign_end", { valueAsNumber: true })}
                  id="reign_end"
                  type="number"
                  className={inputClass}
                  placeholder="e.g., 180"
                />
                {errors.reign_end && (
                  <p className={errorClass}>{errors.reign_end.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2"></div>
          </div>

          {/* Coin Details Section */}
          <div className="space-y-4">
            <h3 className="text-auth-accent mb-4 text-lg font-semibold">
              Coin Details
            </h3>

            {/* Physical Properties */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor="diameter">
                  Diameter (mm)
                </label>
                <input
                  {...register("diameter", { valueAsNumber: true })}
                  id="diameter"
                  type="number"
                  step="0.1"
                  className={inputClass}
                  placeholder="e.g., 19.2"
                  onFocus={(e) => {
                    if (!e.target.value) {
                      e.target.value = "18";
                    }
                  }}
                />
                {errors.diameter && (
                  <p className={errorClass}>{errors.diameter.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="mass">
                  Weight (grams)
                </label>
                <input
                  {...register("mass", { valueAsNumber: true })}
                  id="mass"
                  type="number"
                  step="0.01"
                  className={inputClass}
                  placeholder="e.g., 3.45"
                  onFocus={(e) => {
                    if (!e.target.value) {
                      e.target.value = "3";
                    }
                  }}
                />
                {errors.mass && (
                  <p className={errorClass}>{errors.mass.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="die_axis">
                  Die Axis
                </label>
                <Select
                  {...register("die_axis")}
                  id="die_axis"
                  options={dieAxisOptions}
                  placeholder="Select axis"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="metal">
                  Metal*
                </label>
                <Select
                  {...register("metal")}
                  id="metal"
                  options={[
                    { value: "Silver", label: "Silver" },
                    { value: "Bronze", label: "Bronze" },
                    { value: "Billon", label: "Billon" },
                    { value: "Gold", label: "Gold" },
                    { value: "Copper", label: "Copper" },
                    { value: "Electrum", label: "Electrum" },
                  ]}
                  placeholder="Select metal"
                  error={errors.metal?.message}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="silver_content">
                  Approx Silver Content
                </label>
                <input
                  {...register("silver_content", { valueAsNumber: true })}
                  id="silver_content"
                  type="number"
                  className={inputClass}
                  placeholder="e.g., 45"
                />
                {errors.silver_content && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.silver_content.message}
                  </p>
                )}
              </div>
            </div>

            {/* Mint Information */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor="mint">
                  Mint
                </label>
                <input
                  {...register("mint")}
                  id="mint"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., Rome"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="mint_year_earliest">
                  Mint Year Earliest
                </label>
                <input
                  {...register("mint_year_earliest", { valueAsNumber: true })}
                  id="mint_year_earliest"
                  type="number"
                  className={inputClass}
                  placeholder="e.g., 170"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="mint_year_latest">
                  Mint Year Latest
                </label>
                <input
                  {...register("mint_year_latest", { valueAsNumber: true })}
                  id="mint_year_latest"
                  type="number"
                  className={inputClass}
                  placeholder="e.g., 172"
                />
              </div>
            </div>

            {/* Reference */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="reference">
                  Reference
                </label>
                <input
                  {...register("reference")}
                  id="reference"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., RIC IV 245"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="reference_link">
                  Reference Link
                </label>
                <input
                  {...register("reference_link")}
                  id="reference_link"
                  type="url"
                  className={inputClass}
                  placeholder="e.g., https://reference.com"
                />
              </div>
            </div>
          </div>

          {/* Obverse and Reverse Details */}
          <div className="space-y-4">
            <h3 className="text-auth-accent mb-4 text-lg font-semibold">
              Obverse and Reverse Details
            </h3>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Obverse Column */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-purple-200">
                  Obverse Details
                </h4>

                <div>
                  <label className={labelClass} htmlFor="legend_o">
                    Obverse Legend
                  </label>
                  <input
                    {...register("legend_o")}
                    id="legend_o"
                    type="text"
                    className={inputClass}
                    placeholder="e.g., M ANTONINVS AVG GERM SARM"
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="desc_o">
                    Obverse Description
                  </label>
                  <textarea
                    {...register("desc_o")}
                    id="desc_o"
                    rows={4}
                    className={inputClass}
                    placeholder="e.g., Laureate head of Marcus Aurelius right"
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="image_link_o">
                    Obverse Image Link
                  </label>
                  <input
                    {...register("image_link_o")}
                    id="image_link_o"
                    type="url"
                    className={inputClass}
                    placeholder="e.g., https://example.com/obverse.jpg"
                  />
                  {errors.image_link_o && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.image_link_o.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="image_link_zoom_o">
                    Obverse Zoom Image Link
                  </label>
                  <input
                    {...register("image_link_zoom_o")}
                    id="image_link_zoom_o"
                    type="url"
                    className={inputClass}
                    placeholder="e.g., https://example.com/obverse-zoom.jpg"
                  />
                  {errors.image_link_zoom_o && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.image_link_zoom_o.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Reverse Column */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-purple-200">
                  Reverse Details
                </h4>

                <div>
                  <label className={labelClass} htmlFor="legend_r">
                    Reverse Legend
                  </label>
                  <input
                    {...register("legend_r")}
                    id="legend_r"
                    type="text"
                    className={inputClass}
                    placeholder="e.g., TR P XXX IMP VIII COS III PP"
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="desc_r">
                    Reverse Description
                  </label>
                  <textarea
                    {...register("desc_r")}
                    id="desc_r"
                    rows={4}
                    className={inputClass}
                    placeholder="e.g., Salus standing left, feeding serpent"
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="image_link_r">
                    Reverse Image Link
                  </label>
                  <input
                    {...register("image_link_r")}
                    id="image_link_r"
                    type="url"
                    className={inputClass}
                    placeholder="e.g., https://example.com/reverse.jpg"
                  />
                  {errors.image_link_r && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.image_link_r.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="image_link_zoom_r">
                    Reverse Zoom Image Link
                  </label>
                  <input
                    {...register("image_link_zoom_r")}
                    id="image_link_zoom_r"
                    type="url"
                    className={inputClass}
                    placeholder="e.g., https://example.com/reverse-zoom.jpg"
                  />
                  {errors.image_link_zoom_r && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.image_link_zoom_r.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Flavor Text */}
            <div>
              <label className={labelClass} htmlFor="flavour_text">
                Flavor Text
              </label>
              <textarea
                {...register("flavour_text")}
                id="flavour_text"
                rows={3}
                className={inputClass}
                placeholder="Descriptive text about the coin's historical significance or unique characteristics..."
              />
            </div>
          </div>

          {/* Purchase Information Section */}
          <div className="space-y-4">
            <h3 className="text-auth-accent mb-4 text-lg font-semibold">
              Purchase Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="purchase_date">
                  Purchase Date
                </label>
                <input
                  {...register("purchase_date")}
                  id="purchase_date"
                  type="date"
                  className={inputClass}
                  max={new Date().toISOString().split("T")[0]}
                />
                {errors.purchase_date && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.purchase_date.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="purchase_type">
                  Purchase Type
                </label>
                <Select
                  {...register("purchase_type")}
                  id="purchase_type"
                  options={[
                    { value: "auction", label: "Auction" },
                    { value: "retail", label: "Retail" },
                    { value: "private", label: "Private Sale" },
                    { value: "gift", label: "Gift" },
                    { value: "inheritance", label: "Inheritance" },
                    { value: "other", label: "Other" },
                  ]}
                  placeholder="Select type"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="price_aud">
                  Price (AUD)
                </label>
                <input
                  {...register("price_aud", { valueAsNumber: true })}
                  id="price_aud"
                  type="number"
                  step="0.01"
                  className={inputClass}
                  placeholder="e.g., 150.00"
                />
                {errors.price_aud && (
                  <p className={errorClass}>{errors.price_aud.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="price_shipping_aud">
                  Shipping Cost (AUD)
                </label>
                <input
                  {...register("price_shipping_aud", { valueAsNumber: true })}
                  id="price_shipping_aud"
                  type="number"
                  step="0.01"
                  className={inputClass}
                  placeholder="e.g., 25.00"
                />
                {errors.price_shipping_aud && (
                  <p className={errorClass}>
                    {errors.price_shipping_aud.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="purchase_vendor">
                  Vendor
                </label>
                <input
                  {...register("purchase_vendor")}
                  id="purchase_vendor"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., CNG Auctions"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="vendor_grading_notes">
                  Vendor Grading Notes
                </label>
                <input
                  {...register("vendor_grading_notes")}
                  id="vendor_grading_notes"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., VF, light scratches"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="auction_name">
                  Auction Name
                </label>
                <input
                  {...register("auction_name")}
                  id="auction_name"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., January Ancient Coins Sale"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="auction_lot">
                  Lot Number (required with auction name)
                </label>
                <input
                  {...register("auction_lot", { valueAsNumber: true })}
                  id="auction_lot"
                  type="number"
                  className={inputClass}
                  placeholder="e.g., 156"
                />
                {errors.auction_lot && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.auction_lot.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="purchase_link">
                  Purchase Link
                </label>
                <input
                  {...register("purchase_link")}
                  id="purchase_link"
                  type="url"
                  className={inputClass}
                  placeholder="e.g., https://example.com/auction"
                />
                {errors.purchase_link && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.purchase_link.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="antiquities_register">
                  Antiquities Registry Number
                </label>
                <input
                  {...register("antiquities_register")}
                  id="antiquities_register"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., Registration number or antiquities tracking information"
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="provenance">
                Provenance
              </label>
              <textarea
                {...register("provenance")}
                id="provenance"
                rows={2}
                className={inputClass}
                placeholder="e.g., Ex. John Smith collection"
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="notes">
                General Notes
              </label>
              <textarea
                {...register("notes")}
                id="notes"
                rows={4}
                className={inputClass}
                placeholder="Any additional notes about this coin..."
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="notes_history">
                Historical Notes
              </label>
              <textarea
                {...register("notes_history")}
                id="notes_history"
                rows={3}
                className={inputClass}
                placeholder="Historical context, significance, etc."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <RoundButton
              type="submit"
              disabled={isLoading}
              variant="auth"
              size="lg"
              className="min-w-[200px]"
            >
              {isLoading ? "Adding Coin..." : "Add Coin"}
            </RoundButton>
          </div>
        </form>
      </div>

      {/* Image Naming Tool - Positioned to the right on wide screens */}
      <div className="absolute top-0 left-full ml-8 hidden w-80 xl:block">
        <ImageNamingTool watch={watch} />
      </div>

      {/* Image Naming Tool - Below form on smaller screens */}
      <div className="mt-8 xl:hidden">
        <ImageNamingTool watch={watch} />
      </div>
    </div>
  );
}
