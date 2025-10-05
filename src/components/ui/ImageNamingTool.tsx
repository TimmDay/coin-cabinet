"use client";

import { Copy } from "lucide-react";
import { useState } from "react";
import { RoundButton } from "~/components/ui/RoundButton";
import {
  generateImageId,
  hasValidSource,
} from "~/lib/utils/image-id-generation";

type ImageNamingToolProps = {
  /** Watch function from react-hook-form to get current form values */
  watch: (fieldName: string) => string | undefined;
};

export function ImageNamingTool({ watch }: ImageNamingToolProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [timTookPhotos, setTimTookPhotos] = useState<boolean>(false);

  // Watch relevant form fields
  const nickname = watch("nickname") ?? "";
  const denomination = watch("denomination") ?? "";
  const purchaseDate = watch("purchase_date") ?? "";
  const vendor = watch("purchase_vendor") ?? "";

  // Check if source is valid (either checkbox checked OR vendor has content)
  const isValidSource = hasValidSource(vendor, timTookPhotos);

  // Define the seven views as per the schema
  const views = [
    { view: "o", label: "Obverse" },
    { view: "r", label: "Reverse" },
    { view: "zoom-o", label: "Zoom Obverse" },
    { view: "zoom-r", label: "Zoom Reverse" },
    { view: "sketch-o", label: "Sketch Obverse" },
    { view: "sketch-r", label: "Sketch Reverse" },
    { view: "rotation-45", label: "Rotation 45°" },
  ];

  // Generate filename for a specific view using utility function
  const generateViewFilename = (view: string): string => {
    return generateImageId(
      nickname,
      denomination,
      purchaseDate,
      vendor,
      view,
      timTookPhotos,
    );
  };

  // Copy to clipboard function
  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Always show the tool for better user feedback

  return (
    <div className="somnus-card p-6">
      <h3 className="text-auth-accent mb-4 text-xl font-semibold">
        Image Id Generator
      </h3>

      {/* Tim took photos checkbox */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={timTookPhotos}
            onChange={(e) => setTimTookPhotos(e.target.checked)}
            className="text-auth-accent focus:ring-auth-accent rounded border-slate-600 bg-slate-800/50 focus:ring-offset-slate-800"
          />
          Tim took these photos
        </label>
      </div>

      <p className="coin-description mb-6 text-sm">
        Check the source is honest for copyright
      </p>

      <div className="space-y-3">
        {views.map((item, index) => {
          const filename = generateViewFilename(item.view);

          return (
            <div key={item.view} className="space-y-1">
              <label className="block text-xs font-medium text-slate-400">
                {item.label}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={filename}
                  readOnly
                  className="flex-1 rounded border border-slate-600 bg-slate-800/30 px-3 py-2 text-sm text-slate-300 focus:outline-none"
                  placeholder={
                    filename ? "" : "Fill in form fields to generate image id"
                  }
                />
                <RoundButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => copyToClipboard(filename, index)}
                  disabled={!filename}
                  className="shrink-0"
                >
                  {copiedIndex === index ? (
                    <span className="text-xs">✓</span>
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </RoundButton>
              </div>
            </div>
          );
        })}
      </div>

      {!isValidSource && (
        <div className="mt-4 rounded border border-slate-600 bg-slate-800/50 p-3">
          <p className="text-sm text-slate-400">
            <strong>Missing data:</strong>
            {!purchaseDate && " Purchase Date"}
            {!purchaseDate && !nickname && !denomination && ","}
            {!nickname && !denomination && " Nickname/Denomination"}
            {(purchaseDate || nickname || denomination) &&
              !isValidSource &&
              ","}
            {!isValidSource &&
              " Source (either fill Vendor field or check 'Tim took these photos')"}
          </p>
        </div>
      )}
    </div>
  );
}
