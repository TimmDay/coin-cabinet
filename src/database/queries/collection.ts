import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/database/database.types"
import type { QueryResult } from "~/database/queries/types"
import type {
  NotableFeature,
  SomnusCollection,
} from "~/database/schema-somnus-collection"
import type { CoinEnhanced } from "~/types/api"

type PublicItemRow = Database["public"]["Views"]["public_items"]["Row"]
type CoinRow = Database["public"]["Tables"]["coins"]["Row"]
type CoinImageRow = Database["public"]["Tables"]["coin_images"]["Row"]
type ItemSetRow = Database["public"]["Tables"]["item_sets"]["Row"]
type SetRow = Database["public"]["Tables"]["sets"]["Row"]
type ItemDeityRow = Database["public"]["Tables"]["item_deities"]["Row"]
type CatalogueReferenceRow =
  Database["public"]["Tables"]["coin_catalogue_references"]["Row"]
type NotableFeatureRow =
  Database["public"]["Tables"]["coin_notable_features"]["Row"]
type CoinDeviceRow = Database["public"]["Tables"]["coin_devices"]["Row"]
type ItemPersonRow = Database["public"]["Tables"]["item_persons"]["Row"]
type PersonRow = Database["public"]["Tables"]["persons"]["Row"]
type DeityRow = Database["public"]["Tables"]["deities"]["Row"]
type ItemTimelineRow = Database["public"]["Tables"]["item_timelines"]["Row"]
type SupportingImageRow =
  Database["public"]["Tables"]["supporting_images"]["Row"]
type ItemPresentationRow =
  Database["public"]["Tables"]["item_presentation"]["Row"]

/** Base fields shared by the list and detail endpoints. Caller sets `mint_id`
 * afterward (it comes from the `coins` table, not `public_items`). */
function toBaseCoin(
  item: PublicItemRow,
  images: CoinImageRow[],
  sets: string[],
  deityIds: number[],
): SomnusCollection {
  const standardObverse = images.find(
    (i) => i.side === "obverse" && i.variant === "standard",
  )
  const standardReverse = images.find(
    (i) => i.side === "reverse" && i.variant === "standard",
  )
  const altlightObverse = images.find(
    (i) => i.side === "obverse" && i.variant === "altlight",
  )
  const altlightReverse = images.find(
    (i) => i.side === "reverse" && i.variant === "altlight",
  )
  const sketchObverse = images.find(
    (i) => i.side === "obverse" && i.variant === "sketch",
  )
  const sketchReverse = images.find(
    (i) => i.side === "reverse" && i.variant === "sketch",
  )
  const zoomObverse = images.find(
    (i) => i.side === "obverse" && i.variant === "zoom",
  )
  const zoomReverse = images.find(
    (i) => i.side === "reverse" && i.variant === "zoom",
  )
  const rotationFrames = images
    .filter((i) => i.variant === "rotation_frame")
    .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
    .map((i) => i.url)

  return {
    id: item.id ?? 0,
    created_at: "",
    user_id: "",
    nickname: item.brief_description ?? "",
    authority: "",
    denomination: item.denomination ?? "",
    civ: item.culture_or_period ?? "",
    civ_specific: item.culture_or_period_specific,
    diameter: item.diameter,
    mass: item.mass,
    die_axis: item.rotation !== null ? `${item.rotation}h` : null,
    metal: "",
    silver_content: item.fineness,
    mint_id: null,
    mint_year_earliest: item.date_earliest,
    mint_year_latest: item.date_latest,
    legend_o: item.obverse_legend,
    legend_o_expanded: item.obverse_legend_expanded,
    legend_o_translation: item.obverse_legend_translation,
    desc_o: item.obverse_type_description,
    legend_r: item.reverse_legend,
    legend_r_expanded: item.reverse_legend_expanded,
    legend_r_translation: item.reverse_legend_translation,
    desc_r: item.reverse_type_description,
    reference: null,
    reference_link: null,
    purchase_type: null,
    purchase_date: null,
    price_aud: null,
    price_shipping_aud: null,
    purchase_vendor: null,
    purchase_link: null,
    vendor_grading_notes: null,
    image_link_o: standardObverse?.url ?? null,
    image_link_r: standardReverse?.url ?? null,
    image_link_altlight_o: altlightObverse?.url ?? null,
    image_link_altlight_r: altlightReverse?.url ?? null,
    image_link_sketch_o: sketchObverse?.url ?? null,
    image_link_sketch_r: sketchReverse?.url ?? null,
    image_link_zoom_o: zoomObverse?.url ?? null,
    image_link_zoom_r: zoomReverse?.url ?? null,
    image_rotation: rotationFrames.length ? rotationFrames : null,
    flavour_tag: item.flavour_general,
    flavour_obv: item.flavour_obv,
    flavour_rev: item.flavour_rev,
    flavour_body: item.flavour_body,
    flavour_img: [],
    bpRoute: item.page_route ? [item.page_route] : null,
    provenance: null,
    notes: null,
    notes_history: item.historical_note,
    sets,
    notable_features: [],
    ex_collection: null,
    is_hidden: false,
    deity_id: deityIds.map(String),
    historical_figures_id: [],
    timelines_id: [],
    obv_device_ids: [],
    rev_device_ids: [],
  }
}

/** List endpoint: backs `GET /api/somnus-collection`. */
export async function fetchCollectionList(
  supabase: SupabaseClient<Database>,
): Promise<QueryResult<SomnusCollection[]>> {
  const { data: items, error: itemsError } = await supabase
    .from("public_items")
    .select("*")
    .returns<PublicItemRow[]>()

  if (itemsError) return { data: null, error: itemsError }

  const itemIds = items.map((i) => i.id).filter((id): id is number => id !== null)

  const { data: coins, error: coinsError } = await supabase
    .from("coins")
    .select("id, item_id, mint_id")
    .in("item_id", itemIds)
    .returns<Pick<CoinRow, "id" | "item_id" | "mint_id">[]>()

  if (coinsError) return { data: null, error: coinsError }

  const coinIdByItemId = new Map(coins.map((c) => [c.item_id, c.id]))
  const coinIds = coins.map((c) => c.id)

  const { data: images, error: imagesError } =
    coinIds.length > 0
      ? await supabase
          .from("coin_images")
          .select("*")
          .in("coin_id", coinIds)
          .eq("variant", "standard")
          .returns<CoinImageRow[]>()
      : { data: [] as CoinImageRow[], error: null }

  if (imagesError) return { data: null, error: imagesError }

  const { data: catalogueRefs, error: catalogueRefsError } =
    coinIds.length > 0
      ? await supabase
          .from("coin_catalogue_references")
          .select("*")
          .in("coin_id", coinIds)
          .returns<CatalogueReferenceRow[]>()
      : { data: [] as CatalogueReferenceRow[], error: null }

  if (catalogueRefsError) return { data: null, error: catalogueRefsError }

  const { data: itemSets, error: itemSetsError } = await supabase
    .from("item_sets")
    .select("*")
    .in("item_id", itemIds)
    .returns<ItemSetRow[]>()

  if (itemSetsError) return { data: null, error: itemSetsError }

  const setIds = [...new Set(itemSets.map((s) => s.set_id))]
  const { data: sets, error: setsError } =
    setIds.length > 0
      ? await supabase
          .from("sets")
          .select("*")
          .in("id", setIds)
          .returns<SetRow[]>()
      : { data: [] as SetRow[], error: null }

  if (setsError) return { data: null, error: setsError }

  const { data: itemDeities, error: itemDeitiesError } = await supabase
    .from("item_deities")
    .select("*")
    .in("item_id", itemIds)
    .returns<ItemDeityRow[]>()

  if (itemDeitiesError) return { data: null, error: itemDeitiesError }

  const setNameById = new Map(sets.map((s) => [s.id, s.name]))
  const imagesByCoinId = new Map<number, CoinImageRow[]>()
  for (const image of images) {
    const list = imagesByCoinId.get(image.coin_id) ?? []
    list.push(image)
    imagesByCoinId.set(image.coin_id, list)
  }
  const setNamesByItemId = new Map<number, string[]>()
  for (const itemSet of itemSets) {
    const name = setNameById.get(itemSet.set_id)
    if (!name) continue
    const list = setNamesByItemId.get(itemSet.item_id) ?? []
    list.push(name)
    setNamesByItemId.set(itemSet.item_id, list)
  }
  const deityIdsByItemId = new Map<number, number[]>()
  for (const itemDeity of itemDeities) {
    const list = deityIdsByItemId.get(itemDeity.item_id) ?? []
    list.push(itemDeity.deity_id)
    deityIdsByItemId.set(itemDeity.item_id, list)
  }
  const mintIdByCoinId = new Map(coins.map((c) => [c.id, c.mint_id]))
  const catalogueRefsByCoinId = new Map<number, CatalogueReferenceRow[]>()
  for (const ref of catalogueRefs) {
    const list = catalogueRefsByCoinId.get(ref.coin_id) ?? []
    list.push(ref)
    catalogueRefsByCoinId.set(ref.coin_id, list)
  }

  const result = items
    .filter((item): item is PublicItemRow & { id: number } => item.id !== null)
    .map((item) => {
      const coinId = coinIdByItemId.get(item.id)
      const coin = toBaseCoin(
        item,
        coinId ? (imagesByCoinId.get(coinId) ?? []) : [],
        setNamesByItemId.get(item.id) ?? [],
        deityIdsByItemId.get(item.id) ?? [],
      )
      coin.mint_id = coinId ? (mintIdByCoinId.get(coinId) ?? null) : null
      const refs = coinId ? (catalogueRefsByCoinId.get(coinId) ?? []) : []
      const primaryRef = refs.find((r) => r.is_primary) ?? refs[0]
      if (primaryRef) {
        coin.reference = `${primaryRef.system} ${primaryRef.reference_code}`
        coin.reference_link = primaryRef.external_uri
      }
      return coin
    })
    // Matches the old route's "obverse image required" filter for the
    // public list — a coin not yet photographed isn't ready for the grid.
    .filter((coin) => !!coin.image_link_o)
    .sort((a, b) => (a.mint_year_earliest ?? 0) - (b.mint_year_earliest ?? 0))

  return { data: result, error: null }
}

/** Detail endpoint: backs `GET /api/somnus-collection/[id]`. */
export async function fetchCollectionDetail(
  supabase: SupabaseClient<Database>,
  itemId: number,
): Promise<QueryResult<CoinEnhanced | null>> {
  const { data: item, error: itemError } = await supabase
    .from("public_items")
    .select("*")
    .eq("id", itemId)
    .maybeSingle()
    .overrideTypes<PublicItemRow, { merge: false }>()

  if (itemError) return { data: null, error: itemError }
  if (!item?.id) return { data: null, error: null }

  const { data: coin, error: coinError } = await supabase
    .from("coins")
    .select("id, mint_id")
    .eq("item_id", item.id)
    .maybeSingle()
    .overrideTypes<Pick<CoinRow, "id" | "mint_id">, { merge: false }>()

  if (coinError) return { data: null, error: coinError }

  const coinId = coin?.id

  const [
    imagesResult,
    catalogueRefsResult,
    notableFeaturesResult,
    coinDevicesResult,
    itemSetsResult,
    itemDeitiesResult,
    itemPersonsResult,
    itemTimelinesResult,
    presentationResult,
  ] = await Promise.all([
    coinId
      ? supabase
          .from("coin_images")
          .select("*")
          .eq("coin_id", coinId)
          .returns<CoinImageRow[]>()
      : Promise.resolve({ data: [] as CoinImageRow[], error: null }),
    coinId
      ? supabase
          .from("coin_catalogue_references")
          .select("*")
          .eq("coin_id", coinId)
          .returns<CatalogueReferenceRow[]>()
      : Promise.resolve({ data: [] as CatalogueReferenceRow[], error: null }),
    coinId
      ? supabase
          .from("coin_notable_features")
          .select("*")
          .eq("coin_id", coinId)
          .returns<NotableFeatureRow[]>()
      : Promise.resolve({ data: [] as NotableFeatureRow[], error: null }),
    coinId
      ? supabase
          .from("coin_devices")
          .select("*")
          .eq("coin_id", coinId)
          .returns<CoinDeviceRow[]>()
      : Promise.resolve({ data: [] as CoinDeviceRow[], error: null }),
    supabase
      .from("item_sets")
      .select("*, sets(name)")
      .eq("item_id", item.id)
      .returns<(ItemSetRow & { sets: { name: string } | null })[]>(),
    supabase
      .from("item_deities")
      .select("*")
      .eq("item_id", item.id)
      .returns<ItemDeityRow[]>(),
    supabase
      .from("item_persons")
      .select("*")
      .eq("item_id", item.id)
      .returns<ItemPersonRow[]>(),
    supabase
      .from("item_timelines")
      .select("*")
      .eq("item_id", item.id)
      .returns<ItemTimelineRow[]>(),
    supabase
      .from("item_presentation")
      .select("id")
      .eq("item_id", item.id)
      .maybeSingle()
      .overrideTypes<Pick<ItemPresentationRow, "id">, { merge: false }>(),
  ])

  for (const { error } of [
    imagesResult,
    catalogueRefsResult,
    notableFeaturesResult,
    coinDevicesResult,
    itemSetsResult,
    itemDeitiesResult,
    itemPersonsResult,
    itemTimelinesResult,
    presentationResult,
  ]) {
    if (error) return { data: null, error }
  }

  const images = imagesResult.data ?? []
  const sets = (itemSetsResult.data ?? [])
    .map((s) => s.sets?.name)
    .filter((name): name is string => !!name)
  const itemDeityRows = itemDeitiesResult.data ?? []
  const itemPersonRows = itemPersonsResult.data ?? []
  const itemTimelineRows = itemTimelinesResult.data ?? []
  const presentationId = presentationResult.data?.id

  const [deviceIdsResult, deitiesResult, personsResult, supportingImagesResult] =
    await Promise.all([
      coinId
        ? Promise.resolve(coinDevicesResult)
        : Promise.resolve({ data: [] as CoinDeviceRow[], error: null }),
      itemDeityRows.length > 0
        ? supabase
            .from("deities")
            .select(
              "id, name, subtitle, flavour_text, secondary_info, place_ids:deity_places(place_id)",
            )
            .in(
              "id",
              itemDeityRows.map((d) => d.deity_id),
            )
            .returns<
              (Pick<
                DeityRow,
                "id" | "name" | "subtitle" | "flavour_text" | "secondary_info"
              > & { place_ids: { place_id: number }[] })[]
            >()
        : Promise.resolve({ data: [], error: null }),
      itemPersonRows.length > 0
        ? supabase
            .from("persons")
            .select("*")
            .in(
              "id",
              itemPersonRows.map((p) => p.person_id),
            )
            .returns<PersonRow[]>()
        : Promise.resolve({ data: [] as PersonRow[], error: null }),
      presentationId
        ? supabase
            .from("supporting_images")
            .select("*, artifacts(id)")
            .eq("presentation_id", presentationId)
            .order("sequence", { ascending: true })
            .returns<(SupportingImageRow & { artifacts: { id: number } | null })[]>()
        : Promise.resolve({
            data: [] as (SupportingImageRow & { artifacts: { id: number } | null })[],
            error: null,
          }),
    ])

  for (const { error } of [
    deviceIdsResult,
    deitiesResult,
    personsResult,
    supportingImagesResult,
  ]) {
    if (error) return { data: null, error }
  }

  const coinDevices = deviceIdsResult.data ?? []
  const obvDeviceIds = coinDevices
    .filter((d) => d.side === "obverse")
    .map((d) => String(d.device_id))
  const revDeviceIds = coinDevices
    .filter((d) => d.side === "reverse")
    .map((d) => String(d.device_id))

  const primaryRef =
    (catalogueRefsResult.data ?? []).find((r) => r.is_primary) ??
    (catalogueRefsResult.data ?? [])[0]

  const base = toBaseCoin(
    item,
    images,
    sets,
    itemDeityRows.map((d) => d.deity_id),
  )
  base.mint_id = coin?.mint_id ?? null
  base.reference = primaryRef
    ? `${primaryRef.system} ${primaryRef.reference_code}`
    : null
  base.reference_link = primaryRef?.external_uri ?? null
  base.notable_features = (notableFeaturesResult.data ?? []).map(
    (f): NotableFeature => ({
      name: f.name,
      subtitle: f.subtitle ?? undefined,
      description: f.description ?? undefined,
    }),
  )
  base.obv_device_ids = obvDeviceIds
  base.rev_device_ids = revDeviceIds
  base.historical_figures_id = itemPersonRows.map((p) => String(p.person_id))
  base.timelines_id = itemTimelineRows.map((t) => t.timeline_id)
  base.flavour_img = (supportingImagesResult.data ?? [])
    .map((s) => s.artifacts?.id)
    .filter((id): id is number => id !== undefined && id !== null)
    .map(String)

  const enhanced: CoinEnhanced = {
    ...base,
    deities: (deitiesResult.data ?? []).map((d) => ({
      id: d.id,
      name: d.name,
      subtitle: d.subtitle ?? undefined,
      flavour_text: d.flavour_text,
      artifact_ids: [],
      place_ids: d.place_ids.map((p) => p.place_id),
      features_coinage: [],
    })),
    historical_figures: (personsResult.data ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      full_name: p.full_name,
      authority: p.title,
      reign_start: p.reign_start,
      reign_end: p.reign_end,
      birth: p.birth_year,
      death: p.death_year,
      altNames: p.alt_names,
      flavour_text: p.flavour_text,
      artifact_ids: [],
    })),
  }

  return { data: enhanced, error: null }
}
