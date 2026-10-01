export function Footer() {
  return (
    // Fades in from the page colour into night, so the edge is soft like the
    // header's.
    <footer className="to-night bg-linear-to-b from-transparent to-45%">
      <div className="container mx-auto px-6 py-12">
        <p className="text-moonlight text-center text-base">
          © 2025 Somnus Collection. All rights reserved
        </p>
      </div>
    </footer>
  )
}
