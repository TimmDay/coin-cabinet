import { PageTitle } from "~/components/ui/PageTitle";

export default function RepublicPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <PageTitle className="mb-8">Roman Republic</PageTitle>
          <div className="artemis-card p-8">
            <h2 className="coin-title mb-4 text-2xl">Under Construction</h2>
            <p className="coin-description text-lg leading-relaxed">
              This page will showcase coins from the Roman Republic period
              (509-27 BC). Coming soon with detailed information and
              high-quality images of Republican denarii, aurei, and bronze
              coinage.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
