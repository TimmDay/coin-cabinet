import type { Meta, StoryObj } from "@storybook/nextjs"
import { TableOfContents } from "~/components/blog/TableOfContents"
import { FeaturedCoins } from "../components/ui/FeaturedCoins"

// Demo component that replicates the blog post layout
function BlogPostDemo() {
  return (
    <div className="min-h-screen bg-[hsl(218,23%,11%)]">
      <main className="min-h-screen p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-slate-200">Articles</h1>
            <p className="text-lg text-slate-400">
              Historical insights and numismatic research
            </p>
          </div>

          <div className="flex gap-8">
            {/* Main content */}
            <article className="prose prose-slate prose-invert max-w-none flex-1">
              <h1 className="text-foreground mb-6 text-3xl font-bold">
                Caracalla and Geta: Brothers in Power, Rivals in Death
              </h1>

              <p className="mb-4 leading-relaxed text-slate-300">
                The story of Caracalla and Geta represents one of the most
                dramatic episodes in Roman imperial history. Born to Emperor
                Septimius Severus and Julia Domna, these two brothers were
                destined for greatness but ultimately became bitter rivals whose
                conflict would tear apart the Severan dynasty.
              </p>

              <h2 className="text-foreground mb-4 text-2xl font-semibold">
                Early Lives and Rise to Power
              </h2>

              <p className="mb-4 leading-relaxed text-slate-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>

              <p className="mb-4 leading-relaxed text-slate-300">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum. Sed ut
                perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo.
              </p>

              <h2 className="text-foreground mb-4 text-2xl font-semibold">
                The Joint Rule
              </h2>

              <p className="mb-4 leading-relaxed text-slate-300">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                aut fugit, sed quia consequuntur magni dolores eos qui ratione
                voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
                ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia
                non numquam eius modi tempora incidunt ut labore et dolore
                magnam aliquam quaerat voluptatem.
              </p>

              <div className="my-8">
                <FeaturedCoins />
              </div>

              <p className="mb-4 leading-relaxed text-slate-300">
                Ut enim ad minima veniam, quis nostrum exercitationem ullam
                corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
                consequatur. Quis autem vel eum iure reprehenderit qui in ea
                voluptate velit esse quam nihil molestiae consequatur, vel illum
                qui dolorem eum fugiat quo voluptas nulla pariatur.
              </p>

              <h2 className="text-foreground mb-4 text-2xl font-semibold">
                The Bitter Rivalry
              </h2>

              <p className="mb-4 leading-relaxed text-slate-300">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum deleniti atque corrupti quos
                dolores et quas molestias excepturi sint occaecati cupiditate
                non provident, similique sunt in culpa qui officia deserunt
                mollitia animi, id est laborum et dolorum fuga.
              </p>

              <p className="mb-4 leading-relaxed text-slate-300">
                Et harum quidem rerum facilis est et expedita distinctio. Nam
                libero tempore, cum soluta nobis est eligendi optio cumque nihil
                impedit quo minus id quod maxime placeat facere possimus, omnis
                voluptas assumenda est, omnis dolor repellendus.
              </p>

              <h3 className="text-foreground mb-3 text-xl font-medium">
                Political Maneuvering
              </h3>

              <p className="mb-4 leading-relaxed text-slate-300">
                Temporibus autem quibusdam et aut officiis debitis aut rerum
                necessitatibus saepe eveniet ut et voluptates repudiandae sint
                et molestiae non recusandae. Itaque earum rerum hic tenetur a
                sapiente delectus, ut aut reiciendis voluptatibus maiores alias
                consequatur aut perferendis doloribus asperiores repellat.
              </p>

              <h2 className="text-foreground mb-4 text-2xl font-semibold">
                The Tragic End
              </h2>

              <p className="mb-4 leading-relaxed text-slate-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>

              <p className="mb-4 leading-relaxed text-slate-300">
                The assassination of Geta by his brother Caracalla in 211 CE
                marked a turning point in Roman history. This fratricide not
                only ended the joint rule but also initiated a period of
                increasingly autocratic imperial governance that would
                characterize the later Roman Empire.
              </p>

              <h3 className="text-foreground mb-3 text-xl font-medium">
                Legacy and Numismatic Evidence
              </h3>

              <p className="mb-4 leading-relaxed text-slate-300">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum. The coins
                minted during their joint rule and the subsequent damnatio
                memoriae of Geta provide fascinating insights into the political
                propaganda of the time.
              </p>

              <p className="mb-4 leading-relaxed text-slate-300">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                voluptas sit aspernatur aut odit aut fugit.
              </p>
            </article>

            {/* Table of Contents sidebar */}
            <aside className="hidden w-80 flex-shrink-0 lg:block">
              <TableOfContents />
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}

const meta = {
  title: "Blog/Caracalla and Geta Article",
  component: BlogPostDemo,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A complete blog post layout showcasing the Caracalla and Geta article with Table of Contents and embedded components.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BlogPostDemo>

export default meta
type Story = StoryObj<typeof meta>

// Main story
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "The complete Caracalla and Geta blog post layout with Table of Contents, embedded FeaturedCoins component (using mock data), and full article content.",
      },
    },
  },
}

// Story showcasing just the content without TOC (for mobile view testing)
export const MobileLayout: Story = {
  args: {},
  render: () => (
    <div className="min-h-screen bg-[hsl(218,23%,11%)]">
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-slate-200">Articles</h1>
            <p className="text-lg text-slate-400">
              Historical insights and numismatic research
            </p>
          </div>

          <article className="prose prose-slate prose-invert max-w-none">
            <h1 className="text-foreground mb-6 text-3xl font-bold">
              Caracalla and Geta: Brothers in Power, Rivals in Death
            </h1>

            <p className="mb-4 leading-relaxed text-slate-300">
              The story of Caracalla and Geta represents one of the most
              dramatic episodes in Roman imperial history. Born to Emperor
              Septimius Severus and Julia Domna, these two brothers were
              destined for greatness but ultimately became bitter rivals whose
              conflict would tear apart the Severan dynasty.
            </p>

            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              Early Lives and Rise to Power
            </h2>

            <p className="mb-4 leading-relaxed text-slate-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>

            <div className="my-8">
              <FeaturedCoins />
            </div>

            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              The Tragic End
            </h2>

            <p className="mb-4 leading-relaxed text-slate-300">
              The assassination of Geta by his brother Caracalla in 211 CE
              marked a turning point in Roman history. This fratricide not only
              ended the joint rule but also initiated a period of increasingly
              autocratic imperial governance that would characterize the later
              Roman Empire.
            </p>
          </article>
        </div>
      </main>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Mobile-optimized layout without the Table of Contents sidebar, showing how the blog post appears on smaller screens.",
      },
    },
  },
}

// Story focusing just on the Table of Contents component
export const TableOfContentsOnly: Story = {
  render: () => (
    <div className="min-h-screen bg-[hsl(218,23%,11%)] p-8">
      {/* Mock content to generate headings for TOC */}
      <div className="prose prose-slate prose-invert mx-auto max-w-4xl">
        <h1 id="caracalla-and-geta-brothers-in-power-rivals-in-death">
          Caracalla and Geta: Brothers in Power, Rivals in Death
        </h1>
        <h2 id="early-lives-and-rise-to-power">
          Early Lives and Rise to Power
        </h2>
        <h2 id="the-joint-rule">The Joint Rule</h2>
        <h2 id="the-bitter-rivalry">The Bitter Rivalry</h2>
        <h3 id="political-maneuvering">Political Maneuvering</h3>
        <h2 id="the-tragic-end">The Tragic End</h2>
        <h3 id="legacy-and-numismatic-evidence">
          Legacy and Numismatic Evidence
        </h3>
      </div>

      <div className="fixed top-8 right-8 w-80">
        <TableOfContents />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Isolated Table of Contents component showing the navigation structure and highlighting functionality.",
      },
    },
  },
}
