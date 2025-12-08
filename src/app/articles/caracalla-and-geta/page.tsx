import { Aside } from "../../../components/Aside"
import { BPImage } from "../../../components/ui/BPImage"
import { BPBreak } from "../../../components/blog/BPBreak"
import { H2, H3, P, Lead, FeaturedCoinsWithData } from "../components"

// Article metadata
export const metadata = {
  title: "Caracalla and Geta",
  subtitle: "Brothers in Power, Rivals in Death",
  description: "Exploring the tumultuous relationship between the Roman co-emperors Caracalla and Geta, whose rivalry ultimately led to fratricide and changed the course of Roman history.",
  date: "2024-12-21",
  author: "Coin Cabinet",
  slug: "caracalla-and-geta",
  image: "https://res.cloudinary.com/coin-cabinet/image/upload/v1640995200/blog/caracalla-geta-coins-header.jpg",
  imageAlt: "Ancient Roman coins featuring portraits of emperors Caracalla and Geta from the Severan dynasty",
  keywords: [
    "Caracalla",
    "Geta",
    "Roman Empire",
    "Severan Dynasty",
    "Ancient Coins",
    "Numismatics",
    "Fratricide",
    "Damnatio Memoriae",
    "211 CE",
    "Joint Rule",
  ],
}

export default function CaracallaAndGetaArticle() {
  return (
    <article className="prose prose-lg prose-slate prose-invert max-w-none">
      <BPImage
        src="z_pompeii_bikinis"
        alt="Ancient Roman fresco from Pompeii showing women in bikini-like garments"
        caption="a fresco recovered from Pompeii showing some summer Roman fashion"
        layout="right"
      />

      <Lead>
        The story of Caracalla and Geta represents one of the most dramatic episodes in Roman imperial history. Born to Emperor Septimius Severus and Julia Domna, these two brothers were destined for greatness but ultimately became bitter rivals whose conflict would tear apart the Severan dynasty.
      </Lead>

      <H2>Early Lives and Rise to Power</H2>

      <P>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </P>

      <P>
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </P>

      <H2>The Joint Rule</H2>

      <P>
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
      </P>

      <FeaturedCoinsWithData />

      <p>
        Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.
      </p>

      <H2>The Bitter Rivalry</H2>

      <BPImage
        src="z_pompeii_bikinis"
        alt="Ancient Roman fresco from Pompeii showing women in bikini-like garments"
        caption="a fresco recovered from Pompeii showing some summer Roman fashion"
        layout="left"
      />

      <p>
        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
      </p>

      <p>
        Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
      </p>

      <BPBreak border={false} />

      <H3>Political Maneuvering</H3>

      <p>
        Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
      </p>

      <Aside
        title="Historical Context"
        body="The political maneuvering between Caracalla and Geta reflected broader tensions within the Roman imperial system. Their rivalry demonstrated how the lack of clear succession rules could lead to instability, even when the emperor attempted to establish joint rule between his heirs."
      />

      <H2>The Tragic End</H2>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </p>

      <BPImage
        src="z_Julia_Domna_marble_bust_Yale_1920x1080"
        alt="Marble bust of Julia Domna"
        caption="A marble bust of Julia Domna, wife of Septimius Severus and mother of Caracalla and Geta."
        layout="center"
      />

      <p>
        The assassination of Geta by his brother Caracalla in 211 CE marked a turning point in Roman history. This fratricide not only ended the joint rule but also initiated a period of increasingly autocratic imperial governance that would characterize the later Roman Empire.
      </p>

      <H3>Legacy and Numismatic Evidence</H3>

      <p>
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. The coins minted during their joint rule and the subsequent damnatio memoriae of Geta provide fascinating insights into the political propaganda of the time.
      </p>

      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
      </p>

      <H3>Some Additional things</H3>

      <BPImage
        src="z_Julia_Domna_marble_bust_Yale_1920x1080"
        alt="Marble bust of Julia Domna"
        caption="A marble bust of Julia Domna, wife of Septimius Severus and mother of Caracalla and Geta."
        layout="left"
        maxHeight={800}
      />

      <p>
        lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit
        amet, consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur
        adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem
        ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet,
        consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing
        elit. lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor
        sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur
        adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem
        ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet,
        consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing
        elit. lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor
        sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur
        adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>

      <Aside
        title="Historical Context"
        body="The political maneuvering between Caracalla and Geta reflected broader tensions within the Roman imperial system. Their rivalry demonstrated how the lack of clear succession rules could lead to instability, even when the emperor attempted to establish joint rule between their heirs."
        icon="/assets/icon-gladius.png"
      />
    </article>
  )
}