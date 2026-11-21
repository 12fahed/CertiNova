export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          at: string
          data: NonNullable<Json>
          entity: string
          entity_id: string | null
          id: number
          org_id: string | null
        }
        ComputedFields: never
        Insert: {
          action: string
          actor_id?: string | null
          at?: string
          data?: NonNullable<Json>
          entity: string
          entity_id?: string | null
          id?: never
          org_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          at?: string
          data?: NonNullable<Json>
          entity?: string
          entity_id?: string | null
          id?: never
          org_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'audit_log_actor_id_fkey'
            columns: ['actor_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'audit_log_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'org_stats'
            referencedColumns: ['org_id']
          },
          {
            foreignKeyName: 'audit_log_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      batches: {
        Row: {
          created_at: string
          created_by: string | null
          event_id: string
          has_rank: boolean
          id: string
          org_id: string
          recipient_count: number
          status: Database['public']['Enums']['batch_status']
          template_id: string
          template_snapshot: Json | null
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          created_by?: string | null
          event_id: string
          has_rank?: boolean
          id?: string
          org_id: string
          recipient_count?: number
          status?: Database['public']['Enums']['batch_status']
          template_id: string
          template_snapshot?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          event_id?: string
          has_rank?: boolean
          id?: string
          org_id?: string
          recipient_count?: number
          status?: Database['public']['Enums']['batch_status']
          template_id?: string
          template_snapshot?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'batches_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'batches_event_id_org_id_fkey'
            columns: ['event_id', 'org_id']
            isOneToOne: false
            referencedRelation: 'events'
            referencedColumns: ['id', 'org_id']
          },
          {
            foreignKeyName: 'batches_template_id_event_id_fkey'
            columns: ['template_id', 'event_id']
            isOneToOne: false
            referencedRelation: 'templates'
            referencedColumns: ['id', 'event_id']
          },
        ]
      }
      certificates: {
        Row: {
          batch_id: string
          created_at: string
          file_path: string | null
          id: string
          org_id: string
          rank: string | null
          recipient_email: string | null
          recipient_name: string | null
          render_status: Database['public']['Enums']['render_status']
          revoked_at: string | null
          revoked_reason: string | null
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          batch_id: string
          created_at?: string
          file_path?: string | null
          id?: string
          org_id: string
          rank?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          render_status?: Database['public']['Enums']['render_status']
          revoked_at?: string | null
          revoked_reason?: string | null
          updated_at?: string
        }
        Update: {
          batch_id?: string
          created_at?: string
          file_path?: string | null
          id?: string
          org_id?: string
          rank?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          render_status?: Database['public']['Enums']['render_status']
          revoked_at?: string | null
          revoked_reason?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'certificates_batch_id_org_id_fkey'
            columns: ['batch_id', 'org_id']
            isOneToOne: false
            referencedRelation: 'batches'
            referencedColumns: ['id', 'org_id']
          },
        ]
      }
      email_deliveries: {
        Row: {
          attempts: number
          certificate_id: string
          created_at: string
          email: string
          error: string | null
          id: string
          org_id: string
          sent_at: string | null
          status: Database['public']['Enums']['delivery_status']
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          attempts?: number
          certificate_id: string
          created_at?: string
          email: string
          error?: string | null
          id?: string
          org_id: string
          sent_at?: string | null
          status?: Database['public']['Enums']['delivery_status']
          updated_at?: string
        }
        Update: {
          attempts?: number
          certificate_id?: string
          created_at?: string
          email?: string
          error?: string | null
          id?: string
          org_id?: string
          sent_at?: string | null
          status?: Database['public']['Enums']['delivery_status']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'email_deliveries_certificate_id_org_id_fkey'
            columns: ['certificate_id', 'org_id']
            isOneToOne: false
            referencedRelation: 'certificates'
            referencedColumns: ['id', 'org_id']
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          event_date: string
          id: string
          issuer_name: string
          name: string
          org_id: string
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          event_date?: string
          id?: string
          issuer_name: string
          name: string
          org_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          event_date?: string
          id?: string
          issuer_name?: string
          name?: string
          org_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'events_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'events_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'org_stats'
            referencedColumns: ['org_id']
          },
          {
            foreignKeyName: 'events_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      feature_flags: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          key: string
          org_id: string | null
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          key: string
          org_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          key?: string
          org_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'feature_flags_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'org_stats'
            referencedColumns: ['org_id']
          },
          {
            foreignKeyName: 'feature_flags_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      fonts: {
        Row: {
          category: string
          family: string
          is_system: boolean
          render_family: string
        }
        ComputedFields: never
        Insert: {
          category: string
          family: string
          is_system?: boolean
          render_family: string
        }
        Update: {
          category?: string
          family?: string
          is_system?: boolean
          render_family?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          created_at: string
          created_by: string | null
          error: string | null
          finished_at: string | null
          id: string
          kind: Database['public']['Enums']['job_kind']
          org_id: string
          progress: number
          ref_id: string | null
          result: Json | null
          started_at: string | null
          status: Database['public']['Enums']['job_status']
          total: number
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          created_by?: string | null
          error?: string | null
          finished_at?: string | null
          id?: string
          kind: Database['public']['Enums']['job_kind']
          org_id: string
          progress?: number
          ref_id?: string | null
          result?: Json | null
          started_at?: string | null
          status?: Database['public']['Enums']['job_status']
          total?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          error?: string | null
          finished_at?: string | null
          id?: string
          kind?: Database['public']['Enums']['job_kind']
          org_id?: string
          progress?: number
          ref_id?: string | null
          result?: Json | null
          started_at?: string | null
          status?: Database['public']['Enums']['job_status']
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'jobs_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'jobs_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'org_stats'
            referencedColumns: ['org_id']
          },
          {
            foreignKeyName: 'jobs_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      organization_invites: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          org_id: string
          role: Database['public']['Enums']['org_role']
          token_hash: string
        }
        ComputedFields: never
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          org_id: string
          role?: Database['public']['Enums']['org_role']
          token_hash: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          org_id?: string
          role?: Database['public']['Enums']['org_role']
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: 'organization_invites_invited_by_fkey'
            columns: ['invited_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'organization_invites_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'org_stats'
            referencedColumns: ['org_id']
          },
          {
            foreignKeyName: 'organization_invites_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          org_id: string
          role: Database['public']['Enums']['org_role']
          user_id: string
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          org_id: string
          role?: Database['public']['Enums']['org_role']
          user_id: string
        }
        Update: {
          created_at?: string
          org_id?: string
          role?: Database['public']['Enums']['org_role']
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'organization_members_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'org_stats'
            referencedColumns: ['org_id']
          },
          {
            foreignKeyName: 'organization_members_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'organization_members_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          show_name_on_verify: boolean
          slug: string
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          id?: string
          name: string
          show_name_on_verify?: boolean
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          show_name_on_verify?: boolean
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      template_fields: {
        Row: {
          color: string
          field_key: Database['public']['Enums']['field_key']
          font_family: string
          font_style: Database['public']['Enums']['font_style']
          font_weight: Database['public']['Enums']['font_weight']
          height: number
          template_id: string
          text_decoration: Database['public']['Enums']['text_decoration']
          width: number
          x: number
          y: number
        }
        ComputedFields: never
        Insert: {
          color?: string
          field_key: Database['public']['Enums']['field_key']
          font_family?: string
          font_style?: Database['public']['Enums']['font_style']
          font_weight?: Database['public']['Enums']['font_weight']
          height: number
          template_id: string
          text_decoration?: Database['public']['Enums']['text_decoration']
          width: number
          x: number
          y: number
        }
        Update: {
          color?: string
          field_key?: Database['public']['Enums']['field_key']
          font_family?: string
          font_style?: Database['public']['Enums']['font_style']
          font_weight?: Database['public']['Enums']['font_weight']
          height?: number
          template_id?: string
          text_decoration?: Database['public']['Enums']['text_decoration']
          width?: number
          x?: number
          y?: number
        }
        Relationships: [
          {
            foreignKeyName: 'template_fields_font_family_fkey'
            columns: ['font_family']
            isOneToOne: false
            referencedRelation: 'fonts'
            referencedColumns: ['family']
          },
          {
            foreignKeyName: 'template_fields_template_id_fkey'
            columns: ['template_id']
            isOneToOne: false
            referencedRelation: 'templates'
            referencedColumns: ['id']
          },
        ]
      }
      templates: {
        Row: {
          created_at: string
          created_by: string | null
          event_id: string
          id: string
          image_height: number
          image_path: string
          image_width: number
          org_id: string
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          created_by?: string | null
          event_id: string
          id?: string
          image_height: number
          image_path: string
          image_width: number
          org_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          event_id?: string
          id?: string
          image_height?: number
          image_path?: string
          image_width?: number
          org_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'templates_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'templates_event_id_org_id_fkey'
            columns: ['event_id', 'org_id']
            isOneToOne: false
            referencedRelation: 'events'
            referencedColumns: ['id', 'org_id']
          },
        ]
      }
    }
    Views: {
      org_stats: {
        Row: {
          batches_count: number | null
          certificates_count: number | null
          events_count: number | null
          last_batch_at: string | null
          org_id: string
        }
        ComputedFields: never
        Insert: {
          batches_count?: never
          certificates_count?: never
          events_count?: never
          last_batch_at?: never
          org_id?: string | null
        }
        Update: {
          batches_count?: never
          certificates_count?: never
          events_count?: never
          last_batch_at?: never
          org_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      feature_enabled: { Args: { p_key: string; p_org_id?: string }; Returns: boolean }
      search_certificates: {
        Args: { p_org_id: string; p_query: string }
        Returns: {
          batch_id: string
          created_at: string
          file_path: string | null
          id: string
          org_id: string
          rank: string | null
          recipient_email: string | null
          recipient_name: string | null
          render_status: Database['public']['Enums']['render_status']
          revoked_at: string | null
          revoked_reason: string | null
          updated_at: string
        }[]
        SetofOptions: {
          from: '*'
          to: 'certificates'
          isOneToOne: false
          isSetofReturn: true
        }
      }
      verify_certificate: {
        Args: { p_certificate_id: string }
        Returns: {
          certificate_id: string
          event_date: string
          event_name: string
          is_revoked: boolean
          issued_at: string
          issuer_name: string
          organisation_name: string
          rank: string
          recipient_name: string
        }[]
      }
    }
    Enums: {
      batch_status: 'draft' | 'queued' | 'rendering' | 'ready' | 'failed'
      delivery_status: 'queued' | 'sent' | 'failed'
      field_key:
        'recipient_name' | 'organisation_name' | 'rank' | 'certificate_link' | 'certificate_qr'
      font_style: 'normal' | 'italic'
      font_weight: 'normal' | 'bold'
      job_kind: 'render' | 'export' | 'email' | 'legacy_unlock'
      job_status: 'queued' | 'running' | 'done' | 'failed'
      org_role: 'owner' | 'admin' | 'member'
      render_status: 'pending' | 'done' | 'failed'
      text_decoration: 'none' | 'underline'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      batch_status: ['draft', 'queued', 'rendering', 'ready', 'failed'],
      delivery_status: ['queued', 'sent', 'failed'],
      field_key: [
        'recipient_name',
        'organisation_name',
        'rank',
        'certificate_link',
        'certificate_qr',
      ],
      font_style: ['normal', 'italic'],
      font_weight: ['normal', 'bold'],
      job_kind: ['render', 'export', 'email', 'legacy_unlock'],
      job_status: ['queued', 'running', 'done', 'failed'],
      org_role: ['owner', 'admin', 'member'],
      render_status: ['pending', 'done', 'failed'],
      text_decoration: ['none', 'underline'],
    },
  },
} as const
