export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      artifacts: {
        Row: {
          artist_designer: string | null
          created_at: string
          flavour_text: string | null
          historical_notes: string | null
          historical_sources: string[] | null
          id: number
          image_alt_text: string | null
          image_url: string | null
          location_note: string | null
          medium: string | null
          name: string
          place_id: number | null
          updated_at: string
          year_of_creation_estimate: number | null
        }
        Insert: {
          artist_designer?: string | null
          created_at?: string
          flavour_text?: string | null
          historical_notes?: string | null
          historical_sources?: string[] | null
          id?: never
          image_alt_text?: string | null
          image_url?: string | null
          location_note?: string | null
          medium?: string | null
          name: string
          place_id?: number | null
          updated_at?: string
          year_of_creation_estimate?: number | null
        }
        Update: {
          artist_designer?: string | null
          created_at?: string
          flavour_text?: string | null
          historical_notes?: string | null
          historical_sources?: string[] | null
          id?: never
          image_alt_text?: string | null
          image_url?: string | null
          location_note?: string | null
          medium?: string | null
          name?: string
          place_id?: number | null
          updated_at?: string
          year_of_creation_estimate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "artifacts_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_catalogue_references: {
        Row: {
          coin_id: number
          created_at: string
          external_uri: string | null
          id: number
          is_primary: boolean
          notes: string | null
          reference_code: string
          system: string
        }
        Insert: {
          coin_id: number
          created_at?: string
          external_uri?: string | null
          id?: never
          is_primary?: boolean
          notes?: string | null
          reference_code: string
          system: string
        }
        Update: {
          coin_id?: number
          created_at?: string
          external_uri?: string | null
          id?: never
          is_primary?: boolean
          notes?: string | null
          reference_code?: string
          system?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_catalogue_references_coin_id_fkey"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_devices: {
        Row: {
          coin_id: number
          device_id: number
          side: string
        }
        Insert: {
          coin_id: number
          device_id: number
          side: string
        }
        Update: {
          coin_id?: number
          device_id?: number
          side?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_devices_coin_id_fkey"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coin_devices_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_images: {
        Row: {
          coin_id: number
          created_at: string
          id: number
          sequence: number | null
          side: string | null
          taken_date: string | null
          url: string
          variant: string
        }
        Insert: {
          coin_id: number
          created_at?: string
          id?: never
          sequence?: number | null
          side?: string | null
          taken_date?: string | null
          url: string
          variant?: string
        }
        Update: {
          coin_id?: number
          created_at?: string
          id?: never
          sequence?: number | null
          side?: string | null
          taken_date?: string | null
          url?: string
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_images_coin_id_fkey"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_notable_features: {
        Row: {
          coin_id: number
          description: string | null
          id: number
          name: string
          subtitle: string | null
        }
        Insert: {
          coin_id: number
          description?: string | null
          id?: never
          name: string
          subtitle?: string | null
        }
        Update: {
          coin_id?: number
          description?: string | null
          id?: never
          name?: string
          subtitle?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coin_notable_features_coin_id_fkey"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
        ]
      }
      coins: {
        Row: {
          created_at: string
          denomination: string | null
          diameter: number | null
          fineness: string | null
          id: number
          item_id: number
          mass: number | null
          mint_id: number | null
          mint_mark: string | null
          obverse_legend: string | null
          obverse_legend_expanded: string | null
          obverse_legend_translation: string | null
          obverse_type_description: string | null
          officina: string | null
          reverse_legend: string | null
          reverse_legend_expanded: string | null
          reverse_legend_translation: string | null
          reverse_type_description: string | null
          rotation: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          denomination?: string | null
          diameter?: number | null
          fineness?: string | null
          id?: never
          item_id: number
          mass?: number | null
          mint_id?: number | null
          mint_mark?: string | null
          obverse_legend?: string | null
          obverse_legend_expanded?: string | null
          obverse_legend_translation?: string | null
          obverse_type_description?: string | null
          officina?: string | null
          reverse_legend?: string | null
          reverse_legend_expanded?: string | null
          reverse_legend_translation?: string | null
          reverse_type_description?: string | null
          rotation?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          denomination?: string | null
          diameter?: number | null
          fineness?: string | null
          id?: never
          item_id?: number
          mass?: number | null
          mint_id?: number | null
          mint_mark?: string | null
          obverse_legend?: string | null
          obverse_legend_expanded?: string | null
          obverse_legend_translation?: string | null
          obverse_type_description?: string | null
          officina?: string | null
          reverse_legend?: string | null
          reverse_legend_expanded?: string | null
          reverse_legend_translation?: string | null
          reverse_type_description?: string | null
          rotation?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coins_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: true
            referencedRelation: "collection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coins_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: true
            referencedRelation: "public_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coins_mint_id_fkey"
            columns: ["mint_id"]
            isOneToOne: false
            referencedRelation: "mints"
            referencedColumns: ["id"]
          },
        ]
      }
      collection: {
        Row: {
          accession_number: string
          attribution_status: string
          bibliography: string | null
          brief_description: string
          condition_summary: string | null
          created_at: string
          culture_or_period: string | null
          culture_or_period_specific: string | null
          current_location: string | null
          date_earliest: number | null
          date_latest: number | null
          date_uncertainty_notes: string | null
          dimensions_summary: string | null
          findspot_place_id: number | null
          id: number
          inscription: string | null
          insurance_currency: string | null
          insurance_value: number | null
          materials: string
          notes: string | null
          object_type: string
          owner_user_id: string
          ownership_status: string | null
          production_place_id: number | null
          technique: string | null
          updated_at: string
        }
        Insert: {
          accession_number: string
          attribution_status?: string
          bibliography?: string | null
          brief_description: string
          condition_summary?: string | null
          created_at?: string
          culture_or_period?: string | null
          culture_or_period_specific?: string | null
          current_location?: string | null
          date_earliest?: number | null
          date_latest?: number | null
          date_uncertainty_notes?: string | null
          dimensions_summary?: string | null
          findspot_place_id?: number | null
          id?: never
          inscription?: string | null
          insurance_currency?: string | null
          insurance_value?: number | null
          materials: string
          notes?: string | null
          object_type: string
          owner_user_id: string
          ownership_status?: string | null
          production_place_id?: number | null
          technique?: string | null
          updated_at?: string
        }
        Update: {
          accession_number?: string
          attribution_status?: string
          bibliography?: string | null
          brief_description?: string
          condition_summary?: string | null
          created_at?: string
          culture_or_period?: string | null
          culture_or_period_specific?: string | null
          current_location?: string | null
          date_earliest?: number | null
          date_latest?: number | null
          date_uncertainty_notes?: string | null
          dimensions_summary?: string | null
          findspot_place_id?: number | null
          id?: never
          inscription?: string | null
          insurance_currency?: string | null
          insurance_value?: number | null
          materials?: string
          notes?: string | null
          object_type?: string
          owner_user_id?: string
          ownership_status?: string | null
          production_place_id?: number | null
          technique?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_findspot_place_id_fkey"
            columns: ["findspot_place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_production_place_id_fkey"
            columns: ["production_place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      deities: {
        Row: {
          alt_names: string[] | null
          civilisation: string | null
          created_at: string
          festivals: string[] | null
          flavour_text: string | null
          god_of: string[] | null
          historical_sources: string[] | null
          id: number
          image_links: string[] | null
          legends_coinage: string[] | null
          name: string
          secondary_info: string | null
          similar_gods: string[] | null
          subtitle: string | null
          updated_at: string
        }
        Insert: {
          alt_names?: string[] | null
          civilisation?: string | null
          created_at?: string
          festivals?: string[] | null
          flavour_text?: string | null
          god_of?: string[] | null
          historical_sources?: string[] | null
          id?: never
          image_links?: string[] | null
          legends_coinage?: string[] | null
          name: string
          secondary_info?: string | null
          similar_gods?: string[] | null
          subtitle?: string | null
          updated_at?: string
        }
        Update: {
          alt_names?: string[] | null
          civilisation?: string | null
          created_at?: string
          festivals?: string[] | null
          flavour_text?: string | null
          god_of?: string[] | null
          historical_sources?: string[] | null
          id?: never
          image_links?: string[] | null
          legends_coinage?: string[] | null
          name?: string
          secondary_info?: string | null
          similar_gods?: string[] | null
          subtitle?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      deity_places: {
        Row: {
          deity_id: number
          place_id: number
          role: string | null
        }
        Insert: {
          deity_id: number
          place_id: number
          role?: string | null
        }
        Update: {
          deity_id?: number
          place_id?: number
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deity_places_deity_id_fkey"
            columns: ["deity_id"]
            isOneToOne: false
            referencedRelation: "deities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deity_places_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      device_deities: {
        Row: {
          association_note: string | null
          deity_id: number
          device_id: number
        }
        Insert: {
          association_note?: string | null
          deity_id: number
          device_id: number
        }
        Update: {
          association_note?: string | null
          deity_id?: number
          device_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "device_deities_deity_id_fkey"
            columns: ["deity_id"]
            isOneToOne: false
            referencedRelation: "deities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "device_deities_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          category: string | null
          created_at: string
          description: string
          historical_sources: string[] | null
          id: number
          image_url: string | null
          name: string
          translation: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          historical_sources?: string[] | null
          id?: never
          image_url?: string | null
          name: string
          translation?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          historical_sources?: string[] | null
          id?: never
          image_url?: string | null
          name?: string
          translation?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      entity_sources: {
        Row: {
          applies_to: string | null
          artifact_id: number | null
          created_at: string
          deity_id: number | null
          device_id: number | null
          id: number
          mint_id: number | null
          person_id: number | null
          place_id: number | null
          source_id: number
          timeline_event_id: number | null
          timeline_id: number | null
        }
        Insert: {
          applies_to?: string | null
          artifact_id?: number | null
          created_at?: string
          deity_id?: number | null
          device_id?: number | null
          id?: never
          mint_id?: number | null
          person_id?: number | null
          place_id?: number | null
          source_id: number
          timeline_event_id?: number | null
          timeline_id?: number | null
        }
        Update: {
          applies_to?: string | null
          artifact_id?: number | null
          created_at?: string
          deity_id?: number | null
          device_id?: number | null
          id?: never
          mint_id?: number | null
          person_id?: number | null
          place_id?: number | null
          source_id?: number
          timeline_event_id?: number | null
          timeline_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_sources_artifact_id_fkey"
            columns: ["artifact_id"]
            isOneToOne: false
            referencedRelation: "artifacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_sources_deity_id_fkey"
            columns: ["deity_id"]
            isOneToOne: false
            referencedRelation: "deities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_sources_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_sources_mint_id_fkey"
            columns: ["mint_id"]
            isOneToOne: false
            referencedRelation: "mints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_sources_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_sources_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_sources_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_sources_timeline_event_id_fkey"
            columns: ["timeline_event_id"]
            isOneToOne: false
            referencedRelation: "timeline_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_sources_timeline_id_fkey"
            columns: ["timeline_id"]
            isOneToOne: false
            referencedRelation: "timelines"
            referencedColumns: ["id"]
          },
        ]
      }
      item_artifacts: {
        Row: {
          artifact_id: number
          id: number
          item_id: number
          role: string | null
        }
        Insert: {
          artifact_id: number
          id?: never
          item_id: number
          role?: string | null
        }
        Update: {
          artifact_id?: number
          id?: never
          item_id?: number
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_artifacts_artifact_id_fkey"
            columns: ["artifact_id"]
            isOneToOne: false
            referencedRelation: "artifacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_artifacts_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "collection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_artifacts_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "public_items"
            referencedColumns: ["id"]
          },
        ]
      }
      item_deities: {
        Row: {
          deity_id: number
          id: number
          item_id: number
          role: string | null
        }
        Insert: {
          deity_id: number
          id?: never
          item_id: number
          role?: string | null
        }
        Update: {
          deity_id?: number
          id?: never
          item_id?: number
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_deities_deity_id_fkey"
            columns: ["deity_id"]
            isOneToOne: false
            referencedRelation: "deities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_deities_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "collection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_deities_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "public_items"
            referencedColumns: ["id"]
          },
        ]
      }
      item_persons: {
        Row: {
          id: number
          item_id: number
          person_id: number
          role: string | null
        }
        Insert: {
          id?: never
          item_id: number
          person_id: number
          role?: string | null
        }
        Update: {
          id?: never
          item_id?: number
          person_id?: number
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_persons_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "collection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_persons_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "public_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_persons_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
        ]
      }
      item_places: {
        Row: {
          id: number
          item_id: number
          place_id: number
          role: string | null
        }
        Insert: {
          id?: never
          item_id: number
          place_id: number
          role?: string | null
        }
        Update: {
          id?: never
          item_id?: number
          place_id?: number
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_places_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "collection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_places_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "public_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_places_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      item_presentation: {
        Row: {
          created_at: string
          flavour_body: string | null
          flavour_general: string | null
          flavour_obv: string | null
          flavour_rev: string | null
          historical_note: string | null
          id: number
          is_hidden: boolean
          item_id: number
          page_route: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          flavour_body?: string | null
          flavour_general?: string | null
          flavour_obv?: string | null
          flavour_rev?: string | null
          historical_note?: string | null
          id?: never
          is_hidden?: boolean
          item_id: number
          page_route?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          flavour_body?: string | null
          flavour_general?: string | null
          flavour_obv?: string | null
          flavour_rev?: string | null
          historical_note?: string | null
          id?: never
          is_hidden?: boolean
          item_id?: number
          page_route?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_presentation_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: true
            referencedRelation: "collection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_presentation_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: true
            referencedRelation: "public_items"
            referencedColumns: ["id"]
          },
        ]
      }
      item_sets: {
        Row: {
          item_id: number
          sequence: number | null
          set_id: number
        }
        Insert: {
          item_id: number
          sequence?: number | null
          set_id: number
        }
        Update: {
          item_id?: number
          sequence?: number | null
          set_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "item_sets_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "collection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_sets_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "public_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_sets_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "sets"
            referencedColumns: ["id"]
          },
        ]
      }
      item_timelines: {
        Row: {
          item_id: number
          role: string | null
          timeline_id: number
        }
        Insert: {
          item_id: number
          role?: string | null
          timeline_id: number
        }
        Update: {
          item_id?: number
          role?: string | null
          timeline_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "item_timelines_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "collection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_timelines_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "public_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_timelines_timeline_id_fkey"
            columns: ["timeline_id"]
            isOneToOne: false
            referencedRelation: "timelines"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          caption: string | null
          created_at: string
          id: number
          item_id: number
          taken_date: string | null
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: never
          item_id: number
          taken_date?: string | null
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: never
          item_id?: number
          taken_date?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "collection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "public_items"
            referencedColumns: ["id"]
          },
        ]
      }
      mint_operation_periods: {
        Row: {
          authority_label: string | null
          id: number
          mint_id: number
          period_end: number | null
          period_start: number | null
        }
        Insert: {
          authority_label?: string | null
          id?: never
          mint_id: number
          period_end?: number | null
          period_start?: number | null
        }
        Update: {
          authority_label?: string | null
          id?: never
          mint_id?: number
          period_end?: number | null
          period_start?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mint_operation_periods_mint_id_fkey"
            columns: ["mint_id"]
            isOneToOne: false
            referencedRelation: "mints"
            referencedColumns: ["id"]
          },
        ]
      }
      mints: {
        Row: {
          coinage_materials: string[] | null
          created_at: string
          flavour_text: string | null
          historical_sources: string[] | null
          id: number
          mint_marks: string[] | null
          officina_marks: string[] | null
          opened_by: string | null
          place_id: number
          updated_at: string
        }
        Insert: {
          coinage_materials?: string[] | null
          created_at?: string
          flavour_text?: string | null
          historical_sources?: string[] | null
          id?: never
          mint_marks?: string[] | null
          officina_marks?: string[] | null
          opened_by?: string | null
          place_id: number
          updated_at?: string
        }
        Update: {
          coinage_materials?: string[] | null
          created_at?: string
          flavour_text?: string | null
          historical_sources?: string[] | null
          id?: never
          mint_marks?: string[] | null
          officina_marks?: string[] | null
          opened_by?: string | null
          place_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mints_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      person_places: {
        Row: {
          person_id: number
          place_id: number
          role: string | null
        }
        Insert: {
          person_id: number
          place_id: number
          role?: string | null
        }
        Update: {
          person_id?: number
          place_id?: number
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "person_places_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "person_places_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      persons: {
        Row: {
          alt_names: string[] | null
          birth_year: number | null
          created_at: string
          death_year: number | null
          flavour_text: string | null
          full_name: string | null
          historical_sources: string[] | null
          id: number
          name: string
          reign_end: number | null
          reign_note: string | null
          reign_start: number | null
          title: string | null
          updated_at: string
        }
        Insert: {
          alt_names?: string[] | null
          birth_year?: number | null
          created_at?: string
          death_year?: number | null
          flavour_text?: string | null
          full_name?: string | null
          historical_sources?: string[] | null
          id?: never
          name: string
          reign_end?: number | null
          reign_note?: string | null
          reign_start?: number | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          alt_names?: string[] | null
          birth_year?: number | null
          created_at?: string
          death_year?: number | null
          flavour_text?: string | null
          full_name?: string | null
          historical_sources?: string[] | null
          id?: never
          name?: string
          reign_end?: number | null
          reign_note?: string | null
          reign_start?: number | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      places: {
        Row: {
          alt_names: string[] | null
          created_at: string
          established_year: number | null
          flavour_text: string | null
          historical_sources: string[] | null
          id: number
          lat: number | null
          lng: number | null
          location_description: string | null
          name: string
          place_type: string
          updated_at: string
        }
        Insert: {
          alt_names?: string[] | null
          created_at?: string
          established_year?: number | null
          flavour_text?: string | null
          historical_sources?: string[] | null
          id?: never
          lat?: number | null
          lng?: number | null
          location_description?: string | null
          name: string
          place_type: string
          updated_at?: string
        }
        Update: {
          alt_names?: string[] | null
          created_at?: string
          established_year?: number | null
          flavour_text?: string | null
          historical_sources?: string[] | null
          id?: never
          lat?: number | null
          lng?: number | null
          location_description?: string | null
          name?: string
          place_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      provenance_events: {
        Row: {
          acquisition_channel: string | null
          auction_lot: string | null
          auction_name: string | null
          buyers_premium_pct: number | null
          citation: string | null
          created_at: string
          event_date: string | null
          event_type: string
          find_lat: number | null
          find_lng: number | null
          id: number
          item_id: number
          notes: string | null
          price: number | null
          price_aud_conversion_rate: number | null
          price_currency: string | null
          shipping_cost: number | null
          source: string | null
          source_condition_notes: string | null
          source_url: string | null
        }
        Insert: {
          acquisition_channel?: string | null
          auction_lot?: string | null
          auction_name?: string | null
          buyers_premium_pct?: number | null
          citation?: string | null
          created_at?: string
          event_date?: string | null
          event_type: string
          find_lat?: number | null
          find_lng?: number | null
          id?: never
          item_id: number
          notes?: string | null
          price?: number | null
          price_aud_conversion_rate?: number | null
          price_currency?: string | null
          shipping_cost?: number | null
          source?: string | null
          source_condition_notes?: string | null
          source_url?: string | null
        }
        Update: {
          acquisition_channel?: string | null
          auction_lot?: string | null
          auction_name?: string | null
          buyers_premium_pct?: number | null
          citation?: string | null
          created_at?: string
          event_date?: string | null
          event_type?: string
          find_lat?: number | null
          find_lng?: number | null
          id?: never
          item_id?: number
          notes?: string | null
          price?: number | null
          price_aud_conversion_rate?: number | null
          price_currency?: string | null
          shipping_cost?: number | null
          source?: string | null
          source_condition_notes?: string | null
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provenance_events_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "collection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provenance_events_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "public_items"
            referencedColumns: ["id"]
          },
        ]
      }
      sets: {
        Row: {
          candidate_notes: string[] | null
          created_at: string
          description: string | null
          id: number
          is_hidden: boolean
          name: string
          owner_user_id: string
          page_route: string | null
          updated_at: string
        }
        Insert: {
          candidate_notes?: string[] | null
          created_at?: string
          description?: string | null
          id?: never
          is_hidden?: boolean
          name: string
          owner_user_id: string
          page_route?: string | null
          updated_at?: string
        }
        Update: {
          candidate_notes?: string[] | null
          created_at?: string
          description?: string | null
          id?: never
          is_hidden?: boolean
          name?: string
          owner_user_id?: string
          page_route?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sources: {
        Row: {
          author: string | null
          citation: string
          created_at: string
          id: number
          note: string | null
          source_type: string | null
          updated_at: string
          url: string | null
          work_title: string | null
        }
        Insert: {
          author?: string | null
          citation: string
          created_at?: string
          id?: never
          note?: string | null
          source_type?: string | null
          updated_at?: string
          url?: string | null
          work_title?: string | null
        }
        Update: {
          author?: string | null
          citation?: string
          created_at?: string
          id?: never
          note?: string | null
          source_type?: string | null
          updated_at?: string
          url?: string | null
          work_title?: string | null
        }
        Relationships: []
      }
      supporting_images: {
        Row: {
          artifact_id: number
          presentation_id: number
          sequence: number
        }
        Insert: {
          artifact_id: number
          presentation_id: number
          sequence: number
        }
        Update: {
          artifact_id?: number
          presentation_id?: number
          sequence?: number
        }
        Relationships: [
          {
            foreignKeyName: "supporting_images_artifact_id_fkey"
            columns: ["artifact_id"]
            isOneToOne: false
            referencedRelation: "artifacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supporting_images_presentation_id_fkey"
            columns: ["presentation_id"]
            isOneToOne: false
            referencedRelation: "item_presentation"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          created_at: string
          event_type: string | null
          event_year: number | null
          flavour_text: string | null
          historical_sources: string[] | null
          id: number
          lat: number | null
          lng: number | null
          location_note: string | null
          name: string
          place_id: number | null
          sequence: number
          timeline_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_type?: string | null
          event_year?: number | null
          flavour_text?: string | null
          historical_sources?: string[] | null
          id?: never
          lat?: number | null
          lng?: number | null
          location_note?: string | null
          name: string
          place_id?: number | null
          sequence: number
          timeline_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_type?: string | null
          event_year?: number | null
          flavour_text?: string | null
          historical_sources?: string[] | null
          id?: never
          lat?: number | null
          lng?: number | null
          location_note?: string | null
          name?: string
          place_id?: number | null
          sequence?: number
          timeline_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_events_timeline_id_fkey"
            columns: ["timeline_id"]
            isOneToOne: false
            referencedRelation: "timelines"
            referencedColumns: ["id"]
          },
        ]
      }
      timelines: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_hidden: boolean
          name: string
          page_route: string | null
          person_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: never
          is_hidden?: boolean
          name: string
          page_route?: string | null
          person_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: never
          is_hidden?: boolean
          name?: string
          page_route?: string | null
          person_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "timelines_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_items: {
        Row: {
          accession_number: string | null
          bibliography: string | null
          brief_description: string | null
          condition_summary: string | null
          culture_or_period: string | null
          culture_or_period_specific: string | null
          date_earliest: number | null
          date_latest: number | null
          date_uncertainty_notes: string | null
          denomination: string | null
          diameter: number | null
          dimensions_summary: string | null
          fineness: string | null
          flavour_body: string | null
          flavour_general: string | null
          flavour_obv: string | null
          flavour_rev: string | null
          historical_note: string | null
          id: number | null
          inscription: string | null
          mass: number | null
          materials: string | null
          mint_mark: string | null
          object_type: string | null
          obverse_legend: string | null
          obverse_legend_expanded: string | null
          obverse_legend_translation: string | null
          obverse_type_description: string | null
          officina: string | null
          ownership_status: string | null
          page_route: string | null
          production_place_id: number | null
          production_place_lat: number | null
          production_place_lng: number | null
          production_place_name: string | null
          reverse_legend: string | null
          reverse_legend_expanded: string | null
          reverse_legend_translation: string | null
          reverse_type_description: string | null
          rotation: number | null
          technique: string | null
        }
        Relationships: []
      }
      public_find_events: {
        Row: {
          event_date: string | null
          find_lat: number | null
          find_lng: number | null
          item_id: number | null
          notes: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      coin_is_public: { Args: { p_coin_id: number }; Returns: boolean }
      item_is_public: { Args: { p_item_id: number }; Returns: boolean }
      owns_coin: { Args: { p_coin_id: number }; Returns: boolean }
      owns_item: { Args: { p_item_id: number }; Returns: boolean }
      owns_presentation: {
        Args: { p_presentation_id: number }
        Returns: boolean
      }
      owns_set: { Args: { p_set_id: number }; Returns: boolean }
      presentation_is_public: {
        Args: { p_presentation_id: number }
        Returns: boolean
      }
      set_is_public: { Args: { p_set_id: number }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
