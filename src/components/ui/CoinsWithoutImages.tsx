"use client";

import { useAllSomnusCoins } from "~/lib/api/somnus-collection";
import { generateImageId } from "~/lib/utils/image-id-generation";

const generateObverseImageId = (coin: any): string => {
  const generatedId = generateImageId(
    coin.nickname || "",
    coin.denomination || "",
    coin.purchase_date || "",
    coin.purchase_vendor || "",
    "o",
  );

  return generatedId || "Missing data for generation";
};

export function CoinsWithoutImages() {
  const { data: coins, isLoading, error } = useAllSomnusCoins();

  if (isLoading) {
    return (
      <div className="somnus-card p-6">
        <h3 className="text-auth-accent mb-4 text-xl font-semibold">
          Coins Without Images
        </h3>
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="somnus-card p-6">
        <h3 className="text-auth-accent mb-4 text-xl font-semibold">
          Coins Without Images
        </h3>
        <p className="text-sm text-red-400">Error loading coins</p>
      </div>
    );
  }

  // Filter coins that have DB entries but no images for both obverse and reverse
  const coinsWithoutImages =
    coins?.filter((coin) => {
      const missingObverse =
        !coin.image_link_o || coin.image_link_o.trim() === "";
      const missingReverse =
        !coin.image_link_r || coin.image_link_r.trim() === "";
      return missingObverse || missingReverse;
    }) ?? [];

  // Debug: log the filtering results
  console.log("All coins:", coins?.length);
  console.log("Coins without images:", coinsWithoutImages.length);
  console.log(
    "Coins missing images:",
    coinsWithoutImages.map((coin) => ({
      nickname: coin.nickname,
      obverse: coin.image_link_o,
      reverse: coin.image_link_r,
    })),
  );

  if (coinsWithoutImages.length === 0) {
    return (
      <div className="somnus-card p-6">
        <h3 className="text-auth-accent mb-4 text-xl font-semibold">
          Coins Without Images
        </h3>
        <p className="text-sm text-slate-400">All coins have images! 🎉</p>
      </div>
    );
  }

  return (
    <div className="somnus-card p-6">
      <h3 className="text-auth-accent mb-4 text-xl font-semibold">
        Coins Without Images
      </h3>
      <p className="coin-description mb-4 text-sm">
        These coins have database entries but are missing obverse or reverse
        images:
      </p>
      <div className="space-y-3">
        {coinsWithoutImages.map((coin) => (
          <div key={coin.id} className="space-y-1">
            <div className="text-sm text-slate-300">
              {coin.nickname} {coin.denomination} - {coin.purchase_date}
            </div>
            <div className="pl-2 font-mono text-xs text-slate-500">
              {generateObverseImageId(coin)}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-400">
        Total: {coinsWithoutImages.length} coin
        {coinsWithoutImages.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
