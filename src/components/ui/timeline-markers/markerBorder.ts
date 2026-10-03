/** Ring colour for a timeline marker: the selected one, a minting, or any other event. */
export function markerBorder(
  event: { kind?: string },
  isSelected: boolean,
): string {
  if (isSelected) return "border-2 border-bronze-light"
  if (event.kind === "coin-minted") return "border-bronze"
  return "border-moonlight/50"
}
