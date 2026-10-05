# Jurisdictions are keyed by local slug, not by Pleiades ID

The historical map layer was specified as "correct as to Pleiades", but
Pleiades cannot serve as the identity spine for territories. Jurisdictions are
therefore keyed by a local stable slug, with `pleiades_id` and `wikidata_qid`
carried as optional attributes where they happen to exist.

## Considered Options

**Pleiades ID as the spine.** Rejected. Pleiades is a gazetteer of places, not
a territorial atlas. Its province geometry is Barrington-derived and coarse:
the province of Syria (place 981550) is a plain 5x5 degree rectangle at
precision "rough", with null `start` and `end`. Its time vocabulary is roughly
200 overlapping named buckets of uneven grain, not a year-indexed series, so a
selected year does not resolve to one of them. Critically, the spine has to
reach the Realm tier, and no realm-level entity carries a Pleiades ID at all:
Q175881 (Roman Republic), Q42834 (Western Roman Empire) and Q12544 all lack
P1584.

**Wikidata QID as the spine.** Rejected. Our realm source (Cliopatria) keys on
QIDs but gets them wrong in places: it maps "Roman Empire" to Q12544, which is
*Byzantine Empire*, and "Byzantine Empire" to Q112039853, which is *Foreign
relations of the Byzantine Empire*. A spine we have to hand-correct is not a
spine.

**Local slug.** Chosen. It is the only identifier that works at all three
tiers, and it leaves both external vocabularies usable as attributes.

## Consequences

No schema change is required: `places` is untouched and no migration is needed.
External IDs can be backfilled later without reshaping anything, because they
were never load-bearing.

User-facing copy must not claim the layer is Pleiades-derived. Geometry comes
from Cliopatria (CC BY 4.0), the Pazout correction of AWMC (CC BY-SA 4.0) and
OpenHistoricalMap (CC0).
