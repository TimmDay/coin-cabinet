type TimelineEvent = {
  kind: string
  name: string
  year: number
  yearEnd?: number
  description?: string
  place?: string
  lat?: number
  lng?: number
}

export type MarkerProps = {
  year: number
  event: TimelineEvent
  onEventInteraction: (
    event: TimelineEvent,
    clientX: number,
    clientY: number,
  ) => void
  onEventLeave: () => void
}

export type SideLineMarkerProps = {
  event: TimelineEvent
  onEventInteraction: (
    event: TimelineEvent,
    clientX: number,
    clientY: number,
  ) => void
  onEventLeave: () => void
}

export type StackedMarkersProps = {
  year: number
  events: TimelineEvent[]
  onEventInteraction: (
    event: TimelineEvent,
    clientX: number,
    clientY: number,
  ) => void
  onEventLeave: () => void
}

export type InvertedStackedMarkersProps = StackedMarkersProps

// Helper function to process text for smart word wrapping
// Replaces spaces with non-breaking spaces between words where one word is 3 characters or less
function processTextForSmartWrapping(text: string): string {
  const words = text.split(" ")
  const processedWords: string[] = []

  for (let i = 0; i < words.length; i++) {
    const currentWord = words[i]!
    const nextWord = words[i + 1]

    if (nextWord && (currentWord.length <= 3 || nextWord.length <= 3)) {
      // Use non-breaking space (\u00A0) to prevent wrapping between short words
      processedWords.push(currentWord + "\u00A0" + nextWord)
      i++ // Skip the next word since we've processed it
    } else {
      processedWords.push(currentWord)
    }
  }

  return processedWords.join(" ")
}

// Helper function to detect if text will likely wrap
// Checks if there are multiple words that can wrap (not connected by non-breaking spaces)
function willTextWrap(text: string): boolean {
  const processedText = processTextForSmartWrapping(text)
  // Count spaces (not non-breaking spaces) - if there are normal spaces, text can wrap
  return processedText.includes(" ") && processedText.split(" ").length > 1
}

export function NormalMarker({
  year,
  event,
  onEventInteraction,
  onEventLeave,
}: MarkerProps) {
  const hasWrapping = willTextWrap(event.name)

  return (
    <div key={`${year}-0`}>
      {/* Year and event name labels - horizontal */}
      <div
        className={`absolute left-1/2 hidden -translate-x-1/2 transform md:block ${hasWrapping ? "-top-14" : "-top-12"}`}
      >
        <div className="space-y-1 text-center">
          <div className="text-xs font-medium text-slate-400">
            {processTextForSmartWrapping(event.name)}
          </div>
          <div className="font-mono text-xs whitespace-nowrap text-slate-400">
            {year}
          </div>
        </div>
      </div>

      {/* Mobile-only year label - positioned directly above circle */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 transform md:hidden">
        <div className="text-center font-mono text-xs whitespace-nowrap text-slate-400">
          {year}
        </div>
      </div>

      {/* Event marker */}
      <div
        className="relative transform cursor-pointer transition-all duration-200 hover:scale-110"
        onMouseEnter={(e) => onEventInteraction(event, e.clientX, e.clientY)}
        onMouseLeave={onEventLeave}
        onClick={(e) => onEventInteraction(event, e.clientX, e.clientY)}
      >
        {/* Circle marker */}
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full border bg-transparent shadow-lg ${
            event.kind === "coin-minted"
              ? "border-amber-500"
              : "border-gray-500"
          }`}
        ></div>

        {/* Normal teardrop tail - pointing down */}
        <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-8 border-r-4 border-l-4 border-t-gray-500 border-r-transparent border-l-transparent"></div>
      </div>
    </div>
  )
}

export function InvertedMarker({
  year,
  event,
  onEventInteraction,
  onEventLeave,
}: MarkerProps) {
  return (
    <div key={`${year}-0`}>
      {/* Event marker - below timeline */}
      <div
        className="relative transform cursor-pointer transition-all duration-200 hover:scale-110"
        onMouseEnter={(e) => onEventInteraction(event, e.clientX, e.clientY)}
        onMouseLeave={onEventLeave}
        onClick={(e) => onEventInteraction(event, e.clientX, e.clientY)}
      >
        {/* Circle marker */}
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full border bg-transparent shadow-lg ${
            event.kind === "coin-minted"
              ? "border-amber-500"
              : "border-gray-500"
          }`}
        ></div>

        {/* Inverted teardrop tail - pointing up */}
        <div className="absolute bottom-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-r-4 border-b-8 border-l-4 border-r-transparent border-b-gray-500 border-l-transparent"></div>
      </div>

      {/* Year and event name labels - horizontal */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 transform">
        <div className="space-y-1 text-center">
          <div className="font-mono text-xs whitespace-nowrap text-slate-400">
            {year}
          </div>
          <div className="hidden text-xs font-medium text-slate-400 md:block">
            {processTextForSmartWrapping(event.name)}
          </div>
        </div>
      </div>
    </div>
  )
}

export function StackedMarkers({
  year,
  events,
  onEventInteraction,
  onEventLeave,
}: StackedMarkersProps) {
  return (
    <>
      {/* Year label - at the top of the stack */}
      <div
        className="absolute left-1/2 -translate-x-1/2 transform whitespace-nowrap"
        style={{ top: `-${24 + (events.length - 1) * 32}px` }} // Dynamic top position
      >
        <div className="text-center font-mono text-xs text-slate-400">
          {year}
        </div>
      </div>

      {/* Stacked markers */}
      {events.map((event, eventIndex) => (
        <div key={`${year}-${eventIndex}`}>
          {/* Event marker */}
          <div
            className="absolute -translate-x-1/2 transform cursor-pointer transition-all duration-200 hover:scale-110"
            style={{ top: `${eventIndex * -32}px`, left: "50%" }} // Stack vertically, no overlap
            onMouseEnter={(e) =>
              onEventInteraction(event, e.clientX, e.clientY)
            }
            onMouseLeave={onEventLeave}
            onClick={(e) => onEventInteraction(event, e.clientX, e.clientY)}
          >
            {/* Circle marker */}
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border bg-transparent shadow-lg ${
                event.kind === "coin-minted"
                  ? "border-amber-500"
                  : "border-gray-500"
              }`}
            ></div>

            {/* Teardrop tail - only for bottom marker */}
            {eventIndex === 0 && (
              <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-8 border-r-4 border-l-4 border-t-gray-500 border-r-transparent border-l-transparent"></div>
            )}
          </div>

          {/* Event name label - to the right of each circle */}
          <div
            className="absolute hidden transform md:block"
            style={{
              top: `${eventIndex * -32 + (willTextWrap(event.name) ? 2 : 8)}px`,
              left: "24px",
            }} // Center with each circle, move up when wrapped
          >
            <div className="text-left">
              <div className="text-xs font-medium text-slate-400">
                {processTextForSmartWrapping(event.name)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export function InvertedStackedMarkers({
  year,
  events,
  onEventInteraction,
  onEventLeave,
}: InvertedStackedMarkersProps) {
  return (
    <>
      {/* Year label - at the bottom of the stack */}
      <div
        className="absolute left-1/2 -translate-x-1/2 transform whitespace-nowrap"
        style={{ top: `${8 + (events.length - 1) * 32 + 26}px` }} // Dynamic bottom position
      >
        <div className="text-center font-mono text-xs text-slate-400">
          {year}
        </div>
      </div>

      {/* Stacked markers - below timeline */}
      {events.map((event, eventIndex) => (
        <div key={`${year}-${eventIndex}`}>
          {/* Event marker */}
          <div
            className="absolute -translate-x-1/2 transform cursor-pointer transition-all duration-200 hover:scale-110"
            style={{ top: `${eventIndex * 32}px`, left: "50%" }} // Stack vertically downward
            onMouseEnter={(e) =>
              onEventInteraction(event, e.clientX, e.clientY)
            }
            onMouseLeave={onEventLeave}
            onClick={(e) => onEventInteraction(event, e.clientX, e.clientY)}
          >
            {/* Circle marker */}
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border bg-transparent shadow-lg ${
                event.kind === "coin-minted"
                  ? "border-amber-500"
                  : "border-gray-500"
              }`}
            ></div>

            {/* Inverted teardrop tail - only for top marker, pointing up */}
            {eventIndex === 0 && (
              <div className="absolute bottom-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-r-4 border-b-8 border-l-4 border-r-transparent border-b-gray-500 border-l-transparent"></div>
            )}
          </div>

          {/* Event name label - to the right of each circle */}
          <div
            className="absolute hidden transform md:block"
            style={{
              top: `${eventIndex * 32 + (willTextWrap(event.name) ? 2 : 8)}px`,
              left: "24px",
            }} // Center with each circle, move up when wrapped
          >
            <div className="text-left">
              <div className="text-xs font-medium text-slate-400">
                {processTextForSmartWrapping(event.name)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export function SideLineMarker({
  event,
  onEventInteraction,
  onEventLeave,
}: SideLineMarkerProps) {
  return (
    <div>
      {/* Year and event name labels - horizontal */}
      <div className="absolute -top-12 left-1/2 hidden -translate-x-1/2 transform md:block">
        <div className="space-y-1 text-center">
          <div className="text-xs font-medium text-slate-400">
            {processTextForSmartWrapping(event.name)}
          </div>
          <div className="font-mono text-xs whitespace-nowrap text-slate-400">
            {event.year}
          </div>
        </div>
      </div>

      {/* Mobile-only year label - positioned directly above circle */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 transform md:hidden">
        <div className="text-center font-mono text-xs whitespace-nowrap text-slate-400">
          {event.year}
        </div>
      </div>

      {/* Event marker - gray colored */}
      <div
        className="relative transform cursor-pointer transition-all duration-200 hover:scale-110"
        onMouseEnter={(e) => onEventInteraction(event, e.clientX, e.clientY)}
        onMouseLeave={onEventLeave}
        onClick={(e) => onEventInteraction(event, e.clientX, e.clientY)}
      >
        {/* Circle marker - gray theme */}
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full border bg-transparent shadow-lg ${
            event.kind === "coin-minted"
              ? "border-amber-500"
              : "border-gray-500"
          }`}
        ></div>

        {/* Gray teardrop tail - pointing right toward timeline */}
        <div className="absolute top-1/2 left-full h-0 w-0 -translate-y-1/2 transform border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-gray-500"></div>
      </div>
    </div>
  )
}
