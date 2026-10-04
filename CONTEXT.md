# Coin Cabinet

A catalogue of an ancient coin collection. This glossary covers the vocabulary
the codebase should use for the historical world the coins come from, and for
how that world is shown on a map.

## Language

### Territory and administration

**Jurisdiction**:
A named territory under a single administration, bounded in time. The city of
Rome, the province of Syria, the diocese of Thracia and the theme of Anatolikon
are all Jurisdictions; they differ by Kind, not by type.
_Avoid_: Province (as the general term), region, territory, polity, state

**Kind**:
What sort of administration a Jurisdiction is, for example a city, a realm or a
province. Kind is a property of a Jurisdiction, never a separate concept.
_Avoid_: Type, category, class

**Tier**:
A level in the administrative hierarchy, such that Jurisdictions at the same
Tier are siblings rather than containers of one another. Which Tiers exist
varies by era.
_Avoid_: Level, layer, scale, granularity

**Succession**:
The relationship between a Jurisdiction that ends and the one or more
Jurisdictions that take over its territory. A Jurisdiction is never renamed: if
the name changes, the old Jurisdiction ends and a new one succeeds it.
_Avoid_: Rename, parent, replacement

### Time

**Span**:
The years during which a Jurisdiction existed. A Jurisdiction without a Span is
incomplete, not eternal.
_Avoid_: Extent (which already means a spatial outline in this codebase),
range, period, lifespan, validity

**Selected year**:
The single year the map is currently showing. Everything on the map is the
state as at that year.
_Avoid_: Date, time, position

**Change year**:
A year in which at least one Jurisdiction begins, ends or succeeds another.
Between Change years the map does not move.
_Avoid_: Event, transition, milestone

### Provenance

**Attested**:
Of a Span or a boundary: stated by a Source. The opposite of Inferred.
_Avoid_: Known, confirmed, verified, sourced

**Inferred**:
Of a Span or a boundary: supplied by the cataloguer because no Source covers
that year. An Inferred claim is still a claim and still carries reasoning; it
is not a gap.
_Avoid_: Guessed, estimated, assumed, approximate

**Coverage**:
The years a Source actually speaks to. A Source consulted for a year outside
its Coverage yields an Inferred claim, not an Attested one.
_Avoid_: Scope, applicability, validity

**Basis year**:
The year a piece of geometry depicts, which is often not the Selected year it
is being drawn for. Province outlines drawn from an AD 117 map have a Basis
year of 117 whatever year the slider shows.
_Avoid_: Source year, snapshot date, as-of
