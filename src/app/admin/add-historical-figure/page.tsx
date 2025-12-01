import { Metadata } from "next"
import { AddHistoricalFigureView } from "./AddHistoricalFigureView"

export const metadata: Metadata = {
  title: "Add Historical Figure - Coin Cabinet",
  description: "Add a new historical figure to the database",
}

export default function AddHistoricalFigurePage() {
  return <AddHistoricalFigureView />
}
