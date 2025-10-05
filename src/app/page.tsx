import { PageTitle } from "~/components/ui/PageTitle"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <PageTitle>Welcome</PageTitle>

        <div className="text-center">
          <p className="coin-description text-xl">
            Home page content coming soon...
          </p>
        </div>
      </div>
    </main>
  )
}
