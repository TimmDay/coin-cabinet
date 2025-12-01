import type { Metadata } from "next"
import { EditHistoricalFiguresView } from "./EditHistoricalFiguresView"

export const metadata: Metadata = {
  title: "Edit Historical Figures - Coin Cabinet",
  description: "Edit and manage historical figures in the database",
}

export default function EditHistoricalFiguresPage() {
  return <EditHistoricalFiguresView />
}
