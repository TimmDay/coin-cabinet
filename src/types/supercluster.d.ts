declare module "supercluster" {
  export type SuperclusterPointFeature<P> = {
    type: "Feature"
    properties: P
    geometry: {
      type: "Point"
      coordinates: [number, number]
    }
  }

  export default class Supercluster<P = Record<string, unknown>> {
    constructor(options?: {
      minZoom?: number
      maxZoom?: number
      minPoints?: number
      radius?: number
      extent?: number
      nodeSize?: number
    })

    load(points: Array<SuperclusterPointFeature<P>>): this

    getClusters(
      bbox: [number, number, number, number],
      zoom: number,
    ): Array<
      SuperclusterPointFeature<
        P & {
          cluster?: boolean
          cluster_id?: number
          point_count?: number
          point_count_abbreviated?: string | number
        }
      >
    >

    getClusterExpansionZoom(clusterId: number): number

    getLeaves(
      clusterId: number,
      limit: number,
      offset?: number,
    ): Array<SuperclusterPointFeature<P>>
  }
}
