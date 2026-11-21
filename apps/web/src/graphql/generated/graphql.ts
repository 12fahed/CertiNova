/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never
}
export type Incremental<T> =
  T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  batch_status: {
    input: import('../../types/database').Database['public']['Enums']['batch_status']
    output: import('../../types/database').Database['public']['Enums']['batch_status']
  }
  bigint: { input: number; output: number }
  citext: { input: string; output: string }
  date: { input: string; output: string }
  delivery_status: {
    input: import('../../types/database').Database['public']['Enums']['delivery_status']
    output: import('../../types/database').Database['public']['Enums']['delivery_status']
  }
  field_key: {
    input: import('../../types/database').Database['public']['Enums']['field_key']
    output: import('../../types/database').Database['public']['Enums']['field_key']
  }
  font_style: {
    input: import('../../types/database').Database['public']['Enums']['font_style']
    output: import('../../types/database').Database['public']['Enums']['font_style']
  }
  font_weight: {
    input: import('../../types/database').Database['public']['Enums']['font_weight']
    output: import('../../types/database').Database['public']['Enums']['font_weight']
  }
  job_kind: {
    input: import('../../types/database').Database['public']['Enums']['job_kind']
    output: import('../../types/database').Database['public']['Enums']['job_kind']
  }
  job_status: {
    input: import('../../types/database').Database['public']['Enums']['job_status']
    output: import('../../types/database').Database['public']['Enums']['job_status']
  }
  jsonb: { input: Record<string, unknown>; output: Record<string, unknown> }
  numeric: { input: number; output: number }
  org_role: {
    input: import('../../types/database').Database['public']['Enums']['org_role']
    output: import('../../types/database').Database['public']['Enums']['org_role']
  }
  render_status: {
    input: import('../../types/database').Database['public']['Enums']['render_status']
    output: import('../../types/database').Database['public']['Enums']['render_status']
  }
  text_decoration: {
    input: import('../../types/database').Database['public']['Enums']['text_decoration']
    output: import('../../types/database').Database['public']['Enums']['text_decoration']
  }
  timestamptz: { input: string; output: string }
  uuid: { input: string; output: string }
}

export type AcceptInviteOutput = {
  org_id: Scalars['uuid']['output']
  organization?: Maybe<Organizations>
}

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>
  _gt?: InputMaybe<Scalars['Boolean']['input']>
  _gte?: InputMaybe<Scalars['Boolean']['input']>
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['Boolean']['input']>
  _lte?: InputMaybe<Scalars['Boolean']['input']>
  _neq?: InputMaybe<Scalars['Boolean']['input']>
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>
}

export type BootstrapOrgOutput = {
  org_id: Scalars['uuid']['output']
  organization?: Maybe<Organizations>
}

export type ExportFormat = 'combined_pdf' | 'images_zip' | 'individual_pdfs'

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>
  _gt?: InputMaybe<Scalars['Int']['input']>
  _gte?: InputMaybe<Scalars['Int']['input']>
  _in?: InputMaybe<Array<Scalars['Int']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['Int']['input']>
  _lte?: InputMaybe<Scalars['Int']['input']>
  _neq?: InputMaybe<Scalars['Int']['input']>
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>
}

export type InviteMemberOutput = {
  invite_id: Scalars['uuid']['output']
}

export type JobOutput = {
  job?: Maybe<Jobs>
  job_id: Scalars['uuid']['output']
}

export type SignedUrlOutput = {
  expires_at: Scalars['timestamptz']['output']
  url: Scalars['String']['output']
}

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>
  _gt?: InputMaybe<Scalars['String']['input']>
  _gte?: InputMaybe<Scalars['String']['input']>
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>
  _in?: InputMaybe<Array<Scalars['String']['input']>>
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>
  _lt?: InputMaybe<Scalars['String']['input']>
  _lte?: InputMaybe<Scalars['String']['input']>
  _neq?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>
  _nin?: InputMaybe<Array<Scalars['String']['input']>>
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>
}

export type UnlockLegacyDataOutput = {
  unlocked_batches: Scalars['Int']['output']
  unlocked_certificates: Scalars['Int']['output']
}

/** columns and relationships of "audit_log" */
export type Audit_Log = {
  action: Scalars['String']['output']
  /** An object relationship */
  actor?: Maybe<Profiles>
  actor_id?: Maybe<Scalars['uuid']['output']>
  at: Scalars['timestamptz']['output']
  data: Scalars['jsonb']['output']
  entity: Scalars['String']['output']
  entity_id?: Maybe<Scalars['uuid']['output']>
  id: Scalars['bigint']['output']
  org_id?: Maybe<Scalars['uuid']['output']>
  /** An object relationship */
  organization?: Maybe<Organizations>
}

/** columns and relationships of "audit_log" */
export type Audit_LogDataArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** Boolean expression to filter rows from the table "audit_log". All fields are combined with a logical 'AND'. */
export type Audit_Log_Bool_Exp = {
  _and?: InputMaybe<Array<Audit_Log_Bool_Exp>>
  _not?: InputMaybe<Audit_Log_Bool_Exp>
  _or?: InputMaybe<Array<Audit_Log_Bool_Exp>>
  action?: InputMaybe<String_Comparison_Exp>
  actor?: InputMaybe<Profiles_Bool_Exp>
  actor_id?: InputMaybe<Uuid_Comparison_Exp>
  at?: InputMaybe<Timestamptz_Comparison_Exp>
  data?: InputMaybe<Jsonb_Comparison_Exp>
  entity?: InputMaybe<String_Comparison_Exp>
  entity_id?: InputMaybe<Uuid_Comparison_Exp>
  id?: InputMaybe<Bigint_Comparison_Exp>
  org_id?: InputMaybe<Uuid_Comparison_Exp>
  organization?: InputMaybe<Organizations_Bool_Exp>
}

/** Ordering options when selecting data from "audit_log". */
export type Audit_Log_Order_By = {
  action?: InputMaybe<Order_By>
  actor?: InputMaybe<Profiles_Order_By>
  actor_id?: InputMaybe<Order_By>
  at?: InputMaybe<Order_By>
  data?: InputMaybe<Order_By>
  entity?: InputMaybe<Order_By>
  entity_id?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  organization?: InputMaybe<Organizations_Order_By>
}

/** select columns of table "audit_log" */
export type Audit_Log_Select_Column =
  /** column name */
  | 'action'
  /** column name */
  | 'actor_id'
  /** column name */
  | 'at'
  /** column name */
  | 'data'
  /** column name */
  | 'entity'
  /** column name */
  | 'entity_id'
  /** column name */
  | 'id'
  /** column name */
  | 'org_id'

/** Streaming cursor of the table "audit_log" */
export type Audit_Log_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Audit_Log_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Audit_Log_Stream_Cursor_Value_Input = {
  action?: InputMaybe<Scalars['String']['input']>
  actor_id?: InputMaybe<Scalars['uuid']['input']>
  at?: InputMaybe<Scalars['timestamptz']['input']>
  data?: InputMaybe<Scalars['jsonb']['input']>
  entity?: InputMaybe<Scalars['String']['input']>
  entity_id?: InputMaybe<Scalars['uuid']['input']>
  id?: InputMaybe<Scalars['bigint']['input']>
  org_id?: InputMaybe<Scalars['uuid']['input']>
}

/** Boolean expression to compare columns of type "batch_status". All fields are combined with logical 'AND'. */
export type Batch_Status_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['batch_status']['input']>
  _gt?: InputMaybe<Scalars['batch_status']['input']>
  _gte?: InputMaybe<Scalars['batch_status']['input']>
  _in?: InputMaybe<Array<Scalars['batch_status']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['batch_status']['input']>
  _lte?: InputMaybe<Scalars['batch_status']['input']>
  _neq?: InputMaybe<Scalars['batch_status']['input']>
  _nin?: InputMaybe<Array<Scalars['batch_status']['input']>>
}

/** columns and relationships of "batches" */
export type Batches = {
  /** An array relationship */
  certificates: Array<Certificates>
  /** An aggregate relationship */
  certificates_aggregate: Certificates_Aggregate
  created_at: Scalars['timestamptz']['output']
  created_by?: Maybe<Scalars['uuid']['output']>
  /** An object relationship */
  creator?: Maybe<Profiles>
  /** An object relationship */
  event?: Maybe<Events>
  event_id: Scalars['uuid']['output']
  has_rank: Scalars['Boolean']['output']
  id: Scalars['uuid']['output']
  org_id: Scalars['uuid']['output']
  /** An object relationship */
  organization?: Maybe<Organizations>
  recipient_count: Scalars['Int']['output']
  status: Scalars['batch_status']['output']
  /** An object relationship */
  template?: Maybe<Templates>
  template_id: Scalars['uuid']['output']
  template_snapshot?: Maybe<Scalars['jsonb']['output']>
  updated_at: Scalars['timestamptz']['output']
}

/** columns and relationships of "batches" */
export type BatchesCertificatesArgs = {
  distinct_on?: InputMaybe<Array<Certificates_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Certificates_Order_By>>
  where?: InputMaybe<Certificates_Bool_Exp>
}

/** columns and relationships of "batches" */
export type BatchesCertificates_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Certificates_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Certificates_Order_By>>
  where?: InputMaybe<Certificates_Bool_Exp>
}

/** columns and relationships of "batches" */
export type BatchesTemplate_SnapshotArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** aggregated selection of "batches" */
export type Batches_Aggregate = {
  aggregate?: Maybe<Batches_Aggregate_Fields>
  nodes: Array<Batches>
}

export type Batches_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Batches_Aggregate_Bool_Exp_Bool_And>
  bool_or?: InputMaybe<Batches_Aggregate_Bool_Exp_Bool_Or>
  count?: InputMaybe<Batches_Aggregate_Bool_Exp_Count>
}

export type Batches_Aggregate_Bool_Exp_Bool_And = {
  arguments: Batches_Select_Column_Batches_Aggregate_Bool_Exp_Bool_And_Arguments_Columns
  distinct?: InputMaybe<Scalars['Boolean']['input']>
  filter?: InputMaybe<Batches_Bool_Exp>
  predicate: Boolean_Comparison_Exp
}

export type Batches_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Batches_Select_Column_Batches_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns
  distinct?: InputMaybe<Scalars['Boolean']['input']>
  filter?: InputMaybe<Batches_Bool_Exp>
  predicate: Boolean_Comparison_Exp
}

export type Batches_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Batches_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
  filter?: InputMaybe<Batches_Bool_Exp>
  predicate: Int_Comparison_Exp
}

/** aggregate fields of "batches" */
export type Batches_Aggregate_Fields = {
  avg?: Maybe<Batches_Avg_Fields>
  count: Scalars['Int']['output']
  max?: Maybe<Batches_Max_Fields>
  min?: Maybe<Batches_Min_Fields>
  stddev?: Maybe<Batches_Stddev_Fields>
  stddev_pop?: Maybe<Batches_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Batches_Stddev_Samp_Fields>
  sum?: Maybe<Batches_Sum_Fields>
  var_pop?: Maybe<Batches_Var_Pop_Fields>
  var_samp?: Maybe<Batches_Var_Samp_Fields>
  variance?: Maybe<Batches_Variance_Fields>
}

/** aggregate fields of "batches" */
export type Batches_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Batches_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** order by aggregate values of table "batches" */
export type Batches_Aggregate_Order_By = {
  avg?: InputMaybe<Batches_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Batches_Max_Order_By>
  min?: InputMaybe<Batches_Min_Order_By>
  stddev?: InputMaybe<Batches_Stddev_Order_By>
  stddev_pop?: InputMaybe<Batches_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Batches_Stddev_Samp_Order_By>
  sum?: InputMaybe<Batches_Sum_Order_By>
  var_pop?: InputMaybe<Batches_Var_Pop_Order_By>
  var_samp?: InputMaybe<Batches_Var_Samp_Order_By>
  variance?: InputMaybe<Batches_Variance_Order_By>
}

/** input type for inserting array relation for remote table "batches" */
export type Batches_Arr_Rel_Insert_Input = {
  data: Array<Batches_Insert_Input>
  /** upsert condition */
  on_conflict?: InputMaybe<Batches_On_Conflict>
}

/** aggregate avg on columns */
export type Batches_Avg_Fields = {
  recipient_count?: Maybe<Scalars['Float']['output']>
}

/** order by avg() on columns of table "batches" */
export type Batches_Avg_Order_By = {
  recipient_count?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "batches". All fields are combined with a logical 'AND'. */
export type Batches_Bool_Exp = {
  _and?: InputMaybe<Array<Batches_Bool_Exp>>
  _not?: InputMaybe<Batches_Bool_Exp>
  _or?: InputMaybe<Array<Batches_Bool_Exp>>
  certificates?: InputMaybe<Certificates_Bool_Exp>
  certificates_aggregate?: InputMaybe<Certificates_Aggregate_Bool_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  created_by?: InputMaybe<Uuid_Comparison_Exp>
  creator?: InputMaybe<Profiles_Bool_Exp>
  event?: InputMaybe<Events_Bool_Exp>
  event_id?: InputMaybe<Uuid_Comparison_Exp>
  has_rank?: InputMaybe<Boolean_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  org_id?: InputMaybe<Uuid_Comparison_Exp>
  organization?: InputMaybe<Organizations_Bool_Exp>
  recipient_count?: InputMaybe<Int_Comparison_Exp>
  status?: InputMaybe<Batch_Status_Comparison_Exp>
  template?: InputMaybe<Templates_Bool_Exp>
  template_id?: InputMaybe<Uuid_Comparison_Exp>
  template_snapshot?: InputMaybe<Jsonb_Comparison_Exp>
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** unique or primary key constraints on table "batches" */
export type Batches_Constraint =
  /** unique or primary key constraint on columns "id", "org_id" */
  | 'batches_id_org_id_key'
  /** unique or primary key constraint on columns "id" */
  | 'batches_pkey'

/** input type for inserting data into table "batches" */
export type Batches_Insert_Input = {
  certificates?: InputMaybe<Certificates_Arr_Rel_Insert_Input>
  event?: InputMaybe<Events_Obj_Rel_Insert_Input>
  event_id?: InputMaybe<Scalars['uuid']['input']>
  has_rank?: InputMaybe<Scalars['Boolean']['input']>
  org_id?: InputMaybe<Scalars['uuid']['input']>
  recipient_count?: InputMaybe<Scalars['Int']['input']>
  template?: InputMaybe<Templates_Obj_Rel_Insert_Input>
  template_id?: InputMaybe<Scalars['uuid']['input']>
}

/** aggregate max on columns */
export type Batches_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>
  created_by?: Maybe<Scalars['uuid']['output']>
  event_id?: Maybe<Scalars['uuid']['output']>
  id?: Maybe<Scalars['uuid']['output']>
  org_id?: Maybe<Scalars['uuid']['output']>
  recipient_count?: Maybe<Scalars['Int']['output']>
  status?: Maybe<Scalars['batch_status']['output']>
  template_id?: Maybe<Scalars['uuid']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
}

/** order by max() on columns of table "batches" */
export type Batches_Max_Order_By = {
  created_at?: InputMaybe<Order_By>
  created_by?: InputMaybe<Order_By>
  event_id?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  recipient_count?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  template_id?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Batches_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>
  created_by?: Maybe<Scalars['uuid']['output']>
  event_id?: Maybe<Scalars['uuid']['output']>
  id?: Maybe<Scalars['uuid']['output']>
  org_id?: Maybe<Scalars['uuid']['output']>
  recipient_count?: Maybe<Scalars['Int']['output']>
  status?: Maybe<Scalars['batch_status']['output']>
  template_id?: Maybe<Scalars['uuid']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
}

/** order by min() on columns of table "batches" */
export type Batches_Min_Order_By = {
  created_at?: InputMaybe<Order_By>
  created_by?: InputMaybe<Order_By>
  event_id?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  recipient_count?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  template_id?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** response of any mutation on the table "batches" */
export type Batches_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output']
  /** data from the rows affected by the mutation */
  returning: Array<Batches>
}

/** input type for inserting object relation for remote table "batches" */
export type Batches_Obj_Rel_Insert_Input = {
  data: Batches_Insert_Input
  /** upsert condition */
  on_conflict?: InputMaybe<Batches_On_Conflict>
}

/** on_conflict condition type for table "batches" */
export type Batches_On_Conflict = {
  constraint: Batches_Constraint
  update_columns?: Array<Batches_Update_Column>
  where?: InputMaybe<Batches_Bool_Exp>
}

/** Ordering options when selecting data from "batches". */
export type Batches_Order_By = {
  certificates_aggregate?: InputMaybe<Certificates_Aggregate_Order_By>
  created_at?: InputMaybe<Order_By>
  created_by?: InputMaybe<Order_By>
  creator?: InputMaybe<Profiles_Order_By>
  event?: InputMaybe<Events_Order_By>
  event_id?: InputMaybe<Order_By>
  has_rank?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  organization?: InputMaybe<Organizations_Order_By>
  recipient_count?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  template?: InputMaybe<Templates_Order_By>
  template_id?: InputMaybe<Order_By>
  template_snapshot?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** select columns of table "batches" */
export type Batches_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'event_id'
  /** column name */
  | 'has_rank'
  /** column name */
  | 'id'
  /** column name */
  | 'org_id'
  /** column name */
  | 'recipient_count'
  /** column name */
  | 'status'
  /** column name */
  | 'template_id'
  /** column name */
  | 'template_snapshot'
  /** column name */
  | 'updated_at'

/** select "batches_aggregate_bool_exp_bool_and_arguments_columns" columns of table "batches" */
export type Batches_Select_Column_Batches_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  'has_rank'

/** select "batches_aggregate_bool_exp_bool_or_arguments_columns" columns of table "batches" */
export type Batches_Select_Column_Batches_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  'has_rank'

/** aggregate stddev on columns */
export type Batches_Stddev_Fields = {
  recipient_count?: Maybe<Scalars['Float']['output']>
}

/** order by stddev() on columns of table "batches" */
export type Batches_Stddev_Order_By = {
  recipient_count?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Batches_Stddev_Pop_Fields = {
  recipient_count?: Maybe<Scalars['Float']['output']>
}

/** order by stddev_pop() on columns of table "batches" */
export type Batches_Stddev_Pop_Order_By = {
  recipient_count?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Batches_Stddev_Samp_Fields = {
  recipient_count?: Maybe<Scalars['Float']['output']>
}

/** order by stddev_samp() on columns of table "batches" */
export type Batches_Stddev_Samp_Order_By = {
  recipient_count?: InputMaybe<Order_By>
}

/** Streaming cursor of the table "batches" */
export type Batches_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Batches_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Batches_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>
  created_by?: InputMaybe<Scalars['uuid']['input']>
  event_id?: InputMaybe<Scalars['uuid']['input']>
  has_rank?: InputMaybe<Scalars['Boolean']['input']>
  id?: InputMaybe<Scalars['uuid']['input']>
  org_id?: InputMaybe<Scalars['uuid']['input']>
  recipient_count?: InputMaybe<Scalars['Int']['input']>
  status?: InputMaybe<Scalars['batch_status']['input']>
  template_id?: InputMaybe<Scalars['uuid']['input']>
  template_snapshot?: InputMaybe<Scalars['jsonb']['input']>
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>
}

/** aggregate sum on columns */
export type Batches_Sum_Fields = {
  recipient_count?: Maybe<Scalars['Int']['output']>
}

/** order by sum() on columns of table "batches" */
export type Batches_Sum_Order_By = {
  recipient_count?: InputMaybe<Order_By>
}

/** placeholder for update columns of table "batches" (current role has no relevant permissions) */
export type Batches_Update_Column =
  /** placeholder (do not use) */
  '_PLACEHOLDER'

/** aggregate var_pop on columns */
export type Batches_Var_Pop_Fields = {
  recipient_count?: Maybe<Scalars['Float']['output']>
}

/** order by var_pop() on columns of table "batches" */
export type Batches_Var_Pop_Order_By = {
  recipient_count?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Batches_Var_Samp_Fields = {
  recipient_count?: Maybe<Scalars['Float']['output']>
}

/** order by var_samp() on columns of table "batches" */
export type Batches_Var_Samp_Order_By = {
  recipient_count?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Batches_Variance_Fields = {
  recipient_count?: Maybe<Scalars['Float']['output']>
}

/** order by variance() on columns of table "batches" */
export type Batches_Variance_Order_By = {
  recipient_count?: InputMaybe<Order_By>
}

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']['input']>
  _gt?: InputMaybe<Scalars['bigint']['input']>
  _gte?: InputMaybe<Scalars['bigint']['input']>
  _in?: InputMaybe<Array<Scalars['bigint']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['bigint']['input']>
  _lte?: InputMaybe<Scalars['bigint']['input']>
  _neq?: InputMaybe<Scalars['bigint']['input']>
  _nin?: InputMaybe<Array<Scalars['bigint']['input']>>
}

export type Certificate_Verification = {
  certificate_id: Scalars['uuid']['output']
  event_date: Scalars['date']['output']
  event_name: Scalars['String']['output']
  is_revoked: Scalars['Boolean']['output']
  issued_at: Scalars['timestamptz']['output']
  issuer_name: Scalars['String']['output']
  organisation_name: Scalars['String']['output']
  rank?: Maybe<Scalars['String']['output']>
  recipient_name?: Maybe<Scalars['String']['output']>
}

/** Boolean expression to filter rows from the logical model for "certificate_verification". All fields are combined with a logical 'AND'. */
export type Certificate_Verification_Bool_Exp_Bool_Exp = {
  _and?: InputMaybe<Array<Certificate_Verification_Bool_Exp_Bool_Exp>>
  _not?: InputMaybe<Certificate_Verification_Bool_Exp_Bool_Exp>
  _or?: InputMaybe<Array<Certificate_Verification_Bool_Exp_Bool_Exp>>
  certificate_id?: InputMaybe<Uuid_Comparison_Exp>
  event_date?: InputMaybe<Date_Comparison_Exp>
  event_name?: InputMaybe<String_Comparison_Exp>
  is_revoked?: InputMaybe<Boolean_Comparison_Exp>
  issued_at?: InputMaybe<Timestamptz_Comparison_Exp>
  issuer_name?: InputMaybe<String_Comparison_Exp>
  organisation_name?: InputMaybe<String_Comparison_Exp>
  rank?: InputMaybe<String_Comparison_Exp>
  recipient_name?: InputMaybe<String_Comparison_Exp>
}

export type Certificate_Verification_Enum_Name =
  /** column name */
  | 'certificate_id'
  /** column name */
  | 'event_date'
  /** column name */
  | 'event_name'
  /** column name */
  | 'is_revoked'
  /** column name */
  | 'issued_at'
  /** column name */
  | 'issuer_name'
  /** column name */
  | 'organisation_name'
  /** column name */
  | 'rank'
  /** column name */
  | 'recipient_name'

/** Ordering options when selecting data from "certificate_verification". */
export type Certificate_Verification_Order_By = {
  certificate_id?: InputMaybe<Order_By>
  event_date?: InputMaybe<Order_By>
  event_name?: InputMaybe<Order_By>
  is_revoked?: InputMaybe<Order_By>
  issued_at?: InputMaybe<Order_By>
  issuer_name?: InputMaybe<Order_By>
  organisation_name?: InputMaybe<Order_By>
  rank?: InputMaybe<Order_By>
  recipient_name?: InputMaybe<Order_By>
}

/** columns and relationships of "certificates" */
export type Certificates = {
  /** An object relationship */
  batch?: Maybe<Batches>
  batch_id: Scalars['uuid']['output']
  created_at: Scalars['timestamptz']['output']
  /** An array relationship */
  email_deliveries: Array<Email_Deliveries>
  /** An aggregate relationship */
  email_deliveries_aggregate: Email_Deliveries_Aggregate
  file_path?: Maybe<Scalars['String']['output']>
  id: Scalars['uuid']['output']
  org_id: Scalars['uuid']['output']
  /** An object relationship */
  organization?: Maybe<Organizations>
  rank?: Maybe<Scalars['String']['output']>
  recipient_email?: Maybe<Scalars['citext']['output']>
  recipient_name?: Maybe<Scalars['String']['output']>
  render_status: Scalars['render_status']['output']
  revoked_at?: Maybe<Scalars['timestamptz']['output']>
  revoked_reason?: Maybe<Scalars['String']['output']>
  updated_at: Scalars['timestamptz']['output']
}

/** columns and relationships of "certificates" */
export type CertificatesEmail_DeliveriesArgs = {
  distinct_on?: InputMaybe<Array<Email_Deliveries_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Email_Deliveries_Order_By>>
  where?: InputMaybe<Email_Deliveries_Bool_Exp>
}

/** columns and relationships of "certificates" */
export type CertificatesEmail_Deliveries_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Email_Deliveries_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Email_Deliveries_Order_By>>
  where?: InputMaybe<Email_Deliveries_Bool_Exp>
}

/** aggregated selection of "certificates" */
export type Certificates_Aggregate = {
  aggregate?: Maybe<Certificates_Aggregate_Fields>
  nodes: Array<Certificates>
}

export type Certificates_Aggregate_Bool_Exp = {
  count?: InputMaybe<Certificates_Aggregate_Bool_Exp_Count>
}

export type Certificates_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Certificates_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
  filter?: InputMaybe<Certificates_Bool_Exp>
  predicate: Int_Comparison_Exp
}

/** aggregate fields of "certificates" */
export type Certificates_Aggregate_Fields = {
  count: Scalars['Int']['output']
  max?: Maybe<Certificates_Max_Fields>
  min?: Maybe<Certificates_Min_Fields>
}

/** aggregate fields of "certificates" */
export type Certificates_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Certificates_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** order by aggregate values of table "certificates" */
export type Certificates_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Certificates_Max_Order_By>
  min?: InputMaybe<Certificates_Min_Order_By>
}

/** input type for inserting array relation for remote table "certificates" */
export type Certificates_Arr_Rel_Insert_Input = {
  data: Array<Certificates_Insert_Input>
  /** upsert condition */
  on_conflict?: InputMaybe<Certificates_On_Conflict>
}

/** Boolean expression to filter rows from the table "certificates". All fields are combined with a logical 'AND'. */
export type Certificates_Bool_Exp = {
  _and?: InputMaybe<Array<Certificates_Bool_Exp>>
  _not?: InputMaybe<Certificates_Bool_Exp>
  _or?: InputMaybe<Array<Certificates_Bool_Exp>>
  batch?: InputMaybe<Batches_Bool_Exp>
  batch_id?: InputMaybe<Uuid_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  email_deliveries?: InputMaybe<Email_Deliveries_Bool_Exp>
  email_deliveries_aggregate?: InputMaybe<Email_Deliveries_Aggregate_Bool_Exp>
  file_path?: InputMaybe<String_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  org_id?: InputMaybe<Uuid_Comparison_Exp>
  organization?: InputMaybe<Organizations_Bool_Exp>
  rank?: InputMaybe<String_Comparison_Exp>
  recipient_email?: InputMaybe<Citext_Comparison_Exp>
  recipient_name?: InputMaybe<String_Comparison_Exp>
  render_status?: InputMaybe<Render_Status_Comparison_Exp>
  revoked_at?: InputMaybe<Timestamptz_Comparison_Exp>
  revoked_reason?: InputMaybe<String_Comparison_Exp>
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** unique or primary key constraints on table "certificates" */
export type Certificates_Constraint =
  /** unique or primary key constraint on columns "id", "org_id" */
  | 'certificates_id_org_id_key'
  /** unique or primary key constraint on columns "id" */
  | 'certificates_pkey'

/** input type for inserting data into table "certificates" */
export type Certificates_Insert_Input = {
  batch?: InputMaybe<Batches_Obj_Rel_Insert_Input>
  batch_id?: InputMaybe<Scalars['uuid']['input']>
  org_id?: InputMaybe<Scalars['uuid']['input']>
  rank?: InputMaybe<Scalars['String']['input']>
  recipient_email?: InputMaybe<Scalars['citext']['input']>
  recipient_name?: InputMaybe<Scalars['String']['input']>
}

/** aggregate max on columns */
export type Certificates_Max_Fields = {
  batch_id?: Maybe<Scalars['uuid']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
  file_path?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['uuid']['output']>
  org_id?: Maybe<Scalars['uuid']['output']>
  rank?: Maybe<Scalars['String']['output']>
  recipient_email?: Maybe<Scalars['citext']['output']>
  recipient_name?: Maybe<Scalars['String']['output']>
  render_status?: Maybe<Scalars['render_status']['output']>
  revoked_at?: Maybe<Scalars['timestamptz']['output']>
  revoked_reason?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
}

/** order by max() on columns of table "certificates" */
export type Certificates_Max_Order_By = {
  batch_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  file_path?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  rank?: InputMaybe<Order_By>
  recipient_email?: InputMaybe<Order_By>
  recipient_name?: InputMaybe<Order_By>
  render_status?: InputMaybe<Order_By>
  revoked_at?: InputMaybe<Order_By>
  revoked_reason?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Certificates_Min_Fields = {
  batch_id?: Maybe<Scalars['uuid']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
  file_path?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['uuid']['output']>
  org_id?: Maybe<Scalars['uuid']['output']>
  rank?: Maybe<Scalars['String']['output']>
  recipient_email?: Maybe<Scalars['citext']['output']>
  recipient_name?: Maybe<Scalars['String']['output']>
  render_status?: Maybe<Scalars['render_status']['output']>
  revoked_at?: Maybe<Scalars['timestamptz']['output']>
  revoked_reason?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
}

/** order by min() on columns of table "certificates" */
export type Certificates_Min_Order_By = {
  batch_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  file_path?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  rank?: InputMaybe<Order_By>
  recipient_email?: InputMaybe<Order_By>
  recipient_name?: InputMaybe<Order_By>
  render_status?: InputMaybe<Order_By>
  revoked_at?: InputMaybe<Order_By>
  revoked_reason?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** response of any mutation on the table "certificates" */
export type Certificates_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output']
  /** data from the rows affected by the mutation */
  returning: Array<Certificates>
}

/** on_conflict condition type for table "certificates" */
export type Certificates_On_Conflict = {
  constraint: Certificates_Constraint
  update_columns?: Array<Certificates_Update_Column>
  where?: InputMaybe<Certificates_Bool_Exp>
}

/** Ordering options when selecting data from "certificates". */
export type Certificates_Order_By = {
  batch?: InputMaybe<Batches_Order_By>
  batch_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  email_deliveries_aggregate?: InputMaybe<Email_Deliveries_Aggregate_Order_By>
  file_path?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  organization?: InputMaybe<Organizations_Order_By>
  rank?: InputMaybe<Order_By>
  recipient_email?: InputMaybe<Order_By>
  recipient_name?: InputMaybe<Order_By>
  render_status?: InputMaybe<Order_By>
  revoked_at?: InputMaybe<Order_By>
  revoked_reason?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** primary key columns input for table: certificates */
export type Certificates_Pk_Columns_Input = {
  id: Scalars['uuid']['input']
}

/** select columns of table "certificates" */
export type Certificates_Select_Column =
  /** column name */
  | 'batch_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'file_path'
  /** column name */
  | 'id'
  /** column name */
  | 'org_id'
  /** column name */
  | 'rank'
  /** column name */
  | 'recipient_email'
  /** column name */
  | 'recipient_name'
  /** column name */
  | 'render_status'
  /** column name */
  | 'revoked_at'
  /** column name */
  | 'revoked_reason'
  /** column name */
  | 'updated_at'

/** input type for updating data in table "certificates" */
export type Certificates_Set_Input = {
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>
  revoked_reason?: InputMaybe<Scalars['String']['input']>
}

/** Streaming cursor of the table "certificates" */
export type Certificates_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Certificates_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Certificates_Stream_Cursor_Value_Input = {
  batch_id?: InputMaybe<Scalars['uuid']['input']>
  created_at?: InputMaybe<Scalars['timestamptz']['input']>
  file_path?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['uuid']['input']>
  org_id?: InputMaybe<Scalars['uuid']['input']>
  rank?: InputMaybe<Scalars['String']['input']>
  recipient_email?: InputMaybe<Scalars['citext']['input']>
  recipient_name?: InputMaybe<Scalars['String']['input']>
  render_status?: InputMaybe<Scalars['render_status']['input']>
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>
  revoked_reason?: InputMaybe<Scalars['String']['input']>
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>
}

/** update columns of table "certificates" */
export type Certificates_Update_Column =
  /** column name */
  | 'revoked_at'
  /** column name */
  | 'revoked_reason'

export type Certificates_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Certificates_Set_Input>
  /** filter the rows which have to be updated */
  where: Certificates_Bool_Exp
}

/** Boolean expression to compare columns of type "citext". All fields are combined with logical 'AND'. */
export type Citext_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['citext']['input']>
  _gt?: InputMaybe<Scalars['citext']['input']>
  _gte?: InputMaybe<Scalars['citext']['input']>
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['citext']['input']>
  _in?: InputMaybe<Array<Scalars['citext']['input']>>
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['citext']['input']>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['citext']['input']>
  _lt?: InputMaybe<Scalars['citext']['input']>
  _lte?: InputMaybe<Scalars['citext']['input']>
  _neq?: InputMaybe<Scalars['citext']['input']>
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['citext']['input']>
  _nin?: InputMaybe<Array<Scalars['citext']['input']>>
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['citext']['input']>
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['citext']['input']>
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['citext']['input']>
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['citext']['input']>
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['citext']['input']>
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['citext']['input']>
}

/** ordering argument of a cursor */
export type Cursor_Ordering =
  /** ascending ordering of the cursor */
  | 'ASC'
  /** descending ordering of the cursor */
  | 'DESC'

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['date']['input']>
  _gt?: InputMaybe<Scalars['date']['input']>
  _gte?: InputMaybe<Scalars['date']['input']>
  _in?: InputMaybe<Array<Scalars['date']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['date']['input']>
  _lte?: InputMaybe<Scalars['date']['input']>
  _neq?: InputMaybe<Scalars['date']['input']>
  _nin?: InputMaybe<Array<Scalars['date']['input']>>
}

/** Boolean expression to compare columns of type "delivery_status". All fields are combined with logical 'AND'. */
export type Delivery_Status_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['delivery_status']['input']>
  _gt?: InputMaybe<Scalars['delivery_status']['input']>
  _gte?: InputMaybe<Scalars['delivery_status']['input']>
  _in?: InputMaybe<Array<Scalars['delivery_status']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['delivery_status']['input']>
  _lte?: InputMaybe<Scalars['delivery_status']['input']>
  _neq?: InputMaybe<Scalars['delivery_status']['input']>
  _nin?: InputMaybe<Array<Scalars['delivery_status']['input']>>
}

/** columns and relationships of "email_deliveries" */
export type Email_Deliveries = {
  attempts: Scalars['Int']['output']
  /** An object relationship */
  certificate?: Maybe<Certificates>
  certificate_id: Scalars['uuid']['output']
  created_at: Scalars['timestamptz']['output']
  email: Scalars['citext']['output']
  error?: Maybe<Scalars['String']['output']>
  id: Scalars['uuid']['output']
  org_id: Scalars['uuid']['output']
  /** An object relationship */
  organization?: Maybe<Organizations>
  sent_at?: Maybe<Scalars['timestamptz']['output']>
  status: Scalars['delivery_status']['output']
  updated_at: Scalars['timestamptz']['output']
}

/** aggregated selection of "email_deliveries" */
export type Email_Deliveries_Aggregate = {
  aggregate?: Maybe<Email_Deliveries_Aggregate_Fields>
  nodes: Array<Email_Deliveries>
}

export type Email_Deliveries_Aggregate_Bool_Exp = {
  count?: InputMaybe<Email_Deliveries_Aggregate_Bool_Exp_Count>
}

export type Email_Deliveries_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Email_Deliveries_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
  filter?: InputMaybe<Email_Deliveries_Bool_Exp>
  predicate: Int_Comparison_Exp
}

/** aggregate fields of "email_deliveries" */
export type Email_Deliveries_Aggregate_Fields = {
  avg?: Maybe<Email_Deliveries_Avg_Fields>
  count: Scalars['Int']['output']
  max?: Maybe<Email_Deliveries_Max_Fields>
  min?: Maybe<Email_Deliveries_Min_Fields>
  stddev?: Maybe<Email_Deliveries_Stddev_Fields>
  stddev_pop?: Maybe<Email_Deliveries_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Email_Deliveries_Stddev_Samp_Fields>
  sum?: Maybe<Email_Deliveries_Sum_Fields>
  var_pop?: Maybe<Email_Deliveries_Var_Pop_Fields>
  var_samp?: Maybe<Email_Deliveries_Var_Samp_Fields>
  variance?: Maybe<Email_Deliveries_Variance_Fields>
}

/** aggregate fields of "email_deliveries" */
export type Email_Deliveries_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Email_Deliveries_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** order by aggregate values of table "email_deliveries" */
export type Email_Deliveries_Aggregate_Order_By = {
  avg?: InputMaybe<Email_Deliveries_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Email_Deliveries_Max_Order_By>
  min?: InputMaybe<Email_Deliveries_Min_Order_By>
  stddev?: InputMaybe<Email_Deliveries_Stddev_Order_By>
  stddev_pop?: InputMaybe<Email_Deliveries_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Email_Deliveries_Stddev_Samp_Order_By>
  sum?: InputMaybe<Email_Deliveries_Sum_Order_By>
  var_pop?: InputMaybe<Email_Deliveries_Var_Pop_Order_By>
  var_samp?: InputMaybe<Email_Deliveries_Var_Samp_Order_By>
  variance?: InputMaybe<Email_Deliveries_Variance_Order_By>
}

/** aggregate avg on columns */
export type Email_Deliveries_Avg_Fields = {
  attempts?: Maybe<Scalars['Float']['output']>
}

/** order by avg() on columns of table "email_deliveries" */
export type Email_Deliveries_Avg_Order_By = {
  attempts?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "email_deliveries". All fields are combined with a logical 'AND'. */
export type Email_Deliveries_Bool_Exp = {
  _and?: InputMaybe<Array<Email_Deliveries_Bool_Exp>>
  _not?: InputMaybe<Email_Deliveries_Bool_Exp>
  _or?: InputMaybe<Array<Email_Deliveries_Bool_Exp>>
  attempts?: InputMaybe<Int_Comparison_Exp>
  certificate?: InputMaybe<Certificates_Bool_Exp>
  certificate_id?: InputMaybe<Uuid_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  email?: InputMaybe<Citext_Comparison_Exp>
  error?: InputMaybe<String_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  org_id?: InputMaybe<Uuid_Comparison_Exp>
  organization?: InputMaybe<Organizations_Bool_Exp>
  sent_at?: InputMaybe<Timestamptz_Comparison_Exp>
  status?: InputMaybe<Delivery_Status_Comparison_Exp>
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** aggregate max on columns */
export type Email_Deliveries_Max_Fields = {
  attempts?: Maybe<Scalars['Int']['output']>
  certificate_id?: Maybe<Scalars['uuid']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
  email?: Maybe<Scalars['citext']['output']>
  error?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['uuid']['output']>
  org_id?: Maybe<Scalars['uuid']['output']>
  sent_at?: Maybe<Scalars['timestamptz']['output']>
  status?: Maybe<Scalars['delivery_status']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
}

/** order by max() on columns of table "email_deliveries" */
export type Email_Deliveries_Max_Order_By = {
  attempts?: InputMaybe<Order_By>
  certificate_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  email?: InputMaybe<Order_By>
  error?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  sent_at?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Email_Deliveries_Min_Fields = {
  attempts?: Maybe<Scalars['Int']['output']>
  certificate_id?: Maybe<Scalars['uuid']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
  email?: Maybe<Scalars['citext']['output']>
  error?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['uuid']['output']>
  org_id?: Maybe<Scalars['uuid']['output']>
  sent_at?: Maybe<Scalars['timestamptz']['output']>
  status?: Maybe<Scalars['delivery_status']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
}

/** order by min() on columns of table "email_deliveries" */
export type Email_Deliveries_Min_Order_By = {
  attempts?: InputMaybe<Order_By>
  certificate_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  email?: InputMaybe<Order_By>
  error?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  sent_at?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "email_deliveries". */
export type Email_Deliveries_Order_By = {
  attempts?: InputMaybe<Order_By>
  certificate?: InputMaybe<Certificates_Order_By>
  certificate_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  email?: InputMaybe<Order_By>
  error?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  organization?: InputMaybe<Organizations_Order_By>
  sent_at?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** select columns of table "email_deliveries" */
export type Email_Deliveries_Select_Column =
  /** column name */
  | 'attempts'
  /** column name */
  | 'certificate_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'email'
  /** column name */
  | 'error'
  /** column name */
  | 'id'
  /** column name */
  | 'org_id'
  /** column name */
  | 'sent_at'
  /** column name */
  | 'status'
  /** column name */
  | 'updated_at'

/** aggregate stddev on columns */
export type Email_Deliveries_Stddev_Fields = {
  attempts?: Maybe<Scalars['Float']['output']>
}

/** order by stddev() on columns of table "email_deliveries" */
export type Email_Deliveries_Stddev_Order_By = {
  attempts?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Email_Deliveries_Stddev_Pop_Fields = {
  attempts?: Maybe<Scalars['Float']['output']>
}

/** order by stddev_pop() on columns of table "email_deliveries" */
export type Email_Deliveries_Stddev_Pop_Order_By = {
  attempts?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Email_Deliveries_Stddev_Samp_Fields = {
  attempts?: Maybe<Scalars['Float']['output']>
}

/** order by stddev_samp() on columns of table "email_deliveries" */
export type Email_Deliveries_Stddev_Samp_Order_By = {
  attempts?: InputMaybe<Order_By>
}

/** Streaming cursor of the table "email_deliveries" */
export type Email_Deliveries_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Email_Deliveries_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Email_Deliveries_Stream_Cursor_Value_Input = {
  attempts?: InputMaybe<Scalars['Int']['input']>
  certificate_id?: InputMaybe<Scalars['uuid']['input']>
  created_at?: InputMaybe<Scalars['timestamptz']['input']>
  email?: InputMaybe<Scalars['citext']['input']>
  error?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['uuid']['input']>
  org_id?: InputMaybe<Scalars['uuid']['input']>
  sent_at?: InputMaybe<Scalars['timestamptz']['input']>
  status?: InputMaybe<Scalars['delivery_status']['input']>
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>
}

/** aggregate sum on columns */
export type Email_Deliveries_Sum_Fields = {
  attempts?: Maybe<Scalars['Int']['output']>
}

/** order by sum() on columns of table "email_deliveries" */
export type Email_Deliveries_Sum_Order_By = {
  attempts?: InputMaybe<Order_By>
}

/** aggregate var_pop on columns */
export type Email_Deliveries_Var_Pop_Fields = {
  attempts?: Maybe<Scalars['Float']['output']>
}

/** order by var_pop() on columns of table "email_deliveries" */
export type Email_Deliveries_Var_Pop_Order_By = {
  attempts?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Email_Deliveries_Var_Samp_Fields = {
  attempts?: Maybe<Scalars['Float']['output']>
}

/** order by var_samp() on columns of table "email_deliveries" */
export type Email_Deliveries_Var_Samp_Order_By = {
  attempts?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Email_Deliveries_Variance_Fields = {
  attempts?: Maybe<Scalars['Float']['output']>
}

/** order by variance() on columns of table "email_deliveries" */
export type Email_Deliveries_Variance_Order_By = {
  attempts?: InputMaybe<Order_By>
}

/** columns and relationships of "events" */
export type Events = {
  /** An array relationship */
  batches: Array<Batches>
  /** An aggregate relationship */
  batches_aggregate: Batches_Aggregate
  created_at: Scalars['timestamptz']['output']
  created_by?: Maybe<Scalars['uuid']['output']>
  /** An object relationship */
  creator?: Maybe<Profiles>
  deleted_at?: Maybe<Scalars['timestamptz']['output']>
  event_date: Scalars['date']['output']
  id: Scalars['uuid']['output']
  issuer_name: Scalars['String']['output']
  name: Scalars['String']['output']
  org_id: Scalars['uuid']['output']
  /** An object relationship */
  organization: Organizations
  /** An object relationship */
  template?: Maybe<Templates>
  updated_at: Scalars['timestamptz']['output']
}

/** columns and relationships of "events" */
export type EventsBatchesArgs = {
  distinct_on?: InputMaybe<Array<Batches_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Batches_Order_By>>
  where?: InputMaybe<Batches_Bool_Exp>
}

/** columns and relationships of "events" */
export type EventsBatches_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Batches_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Batches_Order_By>>
  where?: InputMaybe<Batches_Bool_Exp>
}

/** aggregated selection of "events" */
export type Events_Aggregate = {
  aggregate?: Maybe<Events_Aggregate_Fields>
  nodes: Array<Events>
}

export type Events_Aggregate_Bool_Exp = {
  count?: InputMaybe<Events_Aggregate_Bool_Exp_Count>
}

export type Events_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Events_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
  filter?: InputMaybe<Events_Bool_Exp>
  predicate: Int_Comparison_Exp
}

/** aggregate fields of "events" */
export type Events_Aggregate_Fields = {
  count: Scalars['Int']['output']
  max?: Maybe<Events_Max_Fields>
  min?: Maybe<Events_Min_Fields>
}

/** aggregate fields of "events" */
export type Events_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Events_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** order by aggregate values of table "events" */
export type Events_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Events_Max_Order_By>
  min?: InputMaybe<Events_Min_Order_By>
}

/** Boolean expression to filter rows from the table "events". All fields are combined with a logical 'AND'. */
export type Events_Bool_Exp = {
  _and?: InputMaybe<Array<Events_Bool_Exp>>
  _not?: InputMaybe<Events_Bool_Exp>
  _or?: InputMaybe<Array<Events_Bool_Exp>>
  batches?: InputMaybe<Batches_Bool_Exp>
  batches_aggregate?: InputMaybe<Batches_Aggregate_Bool_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  created_by?: InputMaybe<Uuid_Comparison_Exp>
  creator?: InputMaybe<Profiles_Bool_Exp>
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>
  event_date?: InputMaybe<Date_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  issuer_name?: InputMaybe<String_Comparison_Exp>
  name?: InputMaybe<String_Comparison_Exp>
  org_id?: InputMaybe<Uuid_Comparison_Exp>
  organization?: InputMaybe<Organizations_Bool_Exp>
  template?: InputMaybe<Templates_Bool_Exp>
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** unique or primary key constraints on table "events" */
export type Events_Constraint =
  /** unique or primary key constraint on columns "id", "org_id" */
  | 'events_id_org_id_key'
  /** unique or primary key constraint on columns "id" */
  | 'events_pkey'

/** input type for inserting data into table "events" */
export type Events_Insert_Input = {
  batches?: InputMaybe<Batches_Arr_Rel_Insert_Input>
  event_date?: InputMaybe<Scalars['date']['input']>
  issuer_name?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  org_id?: InputMaybe<Scalars['uuid']['input']>
  template?: InputMaybe<Templates_Obj_Rel_Insert_Input>
}

/** aggregate max on columns */
export type Events_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>
  created_by?: Maybe<Scalars['uuid']['output']>
  deleted_at?: Maybe<Scalars['timestamptz']['output']>
  event_date?: Maybe<Scalars['date']['output']>
  id?: Maybe<Scalars['uuid']['output']>
  issuer_name?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
  org_id?: Maybe<Scalars['uuid']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
}

/** order by max() on columns of table "events" */
export type Events_Max_Order_By = {
  created_at?: InputMaybe<Order_By>
  created_by?: InputMaybe<Order_By>
  deleted_at?: InputMaybe<Order_By>
  event_date?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  issuer_name?: InputMaybe<Order_By>
  name?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Events_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>
  created_by?: Maybe<Scalars['uuid']['output']>
  deleted_at?: Maybe<Scalars['timestamptz']['output']>
  event_date?: Maybe<Scalars['date']['output']>
  id?: Maybe<Scalars['uuid']['output']>
  issuer_name?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
  org_id?: Maybe<Scalars['uuid']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
}

/** order by min() on columns of table "events" */
export type Events_Min_Order_By = {
  created_at?: InputMaybe<Order_By>
  created_by?: InputMaybe<Order_By>
  deleted_at?: InputMaybe<Order_By>
  event_date?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  issuer_name?: InputMaybe<Order_By>
  name?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** response of any mutation on the table "events" */
export type Events_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output']
  /** data from the rows affected by the mutation */
  returning: Array<Events>
}

/** input type for inserting object relation for remote table "events" */
export type Events_Obj_Rel_Insert_Input = {
  data: Events_Insert_Input
  /** upsert condition */
  on_conflict?: InputMaybe<Events_On_Conflict>
}

/** on_conflict condition type for table "events" */
export type Events_On_Conflict = {
  constraint: Events_Constraint
  update_columns?: Array<Events_Update_Column>
  where?: InputMaybe<Events_Bool_Exp>
}

/** Ordering options when selecting data from "events". */
export type Events_Order_By = {
  batches_aggregate?: InputMaybe<Batches_Aggregate_Order_By>
  created_at?: InputMaybe<Order_By>
  created_by?: InputMaybe<Order_By>
  creator?: InputMaybe<Profiles_Order_By>
  deleted_at?: InputMaybe<Order_By>
  event_date?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  issuer_name?: InputMaybe<Order_By>
  name?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  organization?: InputMaybe<Organizations_Order_By>
  template?: InputMaybe<Templates_Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** primary key columns input for table: events */
export type Events_Pk_Columns_Input = {
  id: Scalars['uuid']['input']
}

/** select columns of table "events" */
export type Events_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'deleted_at'
  /** column name */
  | 'event_date'
  /** column name */
  | 'id'
  /** column name */
  | 'issuer_name'
  /** column name */
  | 'name'
  /** column name */
  | 'org_id'
  /** column name */
  | 'updated_at'

/** input type for updating data in table "events" */
export type Events_Set_Input = {
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>
  event_date?: InputMaybe<Scalars['date']['input']>
  issuer_name?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
}

/** Streaming cursor of the table "events" */
export type Events_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Events_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Events_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>
  created_by?: InputMaybe<Scalars['uuid']['input']>
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>
  event_date?: InputMaybe<Scalars['date']['input']>
  id?: InputMaybe<Scalars['uuid']['input']>
  issuer_name?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  org_id?: InputMaybe<Scalars['uuid']['input']>
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>
}

/** update columns of table "events" */
export type Events_Update_Column =
  /** column name */
  | 'deleted_at'
  /** column name */
  | 'event_date'
  /** column name */
  | 'issuer_name'
  /** column name */
  | 'name'

export type Events_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Events_Set_Input>
  /** filter the rows which have to be updated */
  where: Events_Bool_Exp
}

/** columns and relationships of "feature_flags" */
export type Feature_Flags = {
  enabled: Scalars['Boolean']['output']
  id: Scalars['uuid']['output']
  key: Scalars['String']['output']
  org_id?: Maybe<Scalars['uuid']['output']>
  /** An object relationship */
  organization?: Maybe<Organizations>
}

/** order by aggregate values of table "feature_flags" */
export type Feature_Flags_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Feature_Flags_Max_Order_By>
  min?: InputMaybe<Feature_Flags_Min_Order_By>
}

/** Boolean expression to filter rows from the table "feature_flags". All fields are combined with a logical 'AND'. */
export type Feature_Flags_Bool_Exp = {
  _and?: InputMaybe<Array<Feature_Flags_Bool_Exp>>
  _not?: InputMaybe<Feature_Flags_Bool_Exp>
  _or?: InputMaybe<Array<Feature_Flags_Bool_Exp>>
  enabled?: InputMaybe<Boolean_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  key?: InputMaybe<String_Comparison_Exp>
  org_id?: InputMaybe<Uuid_Comparison_Exp>
  organization?: InputMaybe<Organizations_Bool_Exp>
}

/** order by max() on columns of table "feature_flags" */
export type Feature_Flags_Max_Order_By = {
  id?: InputMaybe<Order_By>
  key?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
}

/** order by min() on columns of table "feature_flags" */
export type Feature_Flags_Min_Order_By = {
  id?: InputMaybe<Order_By>
  key?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "feature_flags". */
export type Feature_Flags_Order_By = {
  enabled?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  key?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  organization?: InputMaybe<Organizations_Order_By>
}

/** select columns of table "feature_flags" */
export type Feature_Flags_Select_Column =
  /** column name */
  | 'enabled'
  /** column name */
  | 'id'
  /** column name */
  | 'key'
  /** column name */
  | 'org_id'

/** Streaming cursor of the table "feature_flags" */
export type Feature_Flags_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Feature_Flags_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Feature_Flags_Stream_Cursor_Value_Input = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>
  id?: InputMaybe<Scalars['uuid']['input']>
  key?: InputMaybe<Scalars['String']['input']>
  org_id?: InputMaybe<Scalars['uuid']['input']>
}

/** Boolean expression to compare columns of type "field_key". All fields are combined with logical 'AND'. */
export type Field_Key_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['field_key']['input']>
  _gt?: InputMaybe<Scalars['field_key']['input']>
  _gte?: InputMaybe<Scalars['field_key']['input']>
  _in?: InputMaybe<Array<Scalars['field_key']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['field_key']['input']>
  _lte?: InputMaybe<Scalars['field_key']['input']>
  _neq?: InputMaybe<Scalars['field_key']['input']>
  _nin?: InputMaybe<Array<Scalars['field_key']['input']>>
}

/** Boolean expression to compare columns of type "font_style". All fields are combined with logical 'AND'. */
export type Font_Style_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['font_style']['input']>
  _gt?: InputMaybe<Scalars['font_style']['input']>
  _gte?: InputMaybe<Scalars['font_style']['input']>
  _in?: InputMaybe<Array<Scalars['font_style']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['font_style']['input']>
  _lte?: InputMaybe<Scalars['font_style']['input']>
  _neq?: InputMaybe<Scalars['font_style']['input']>
  _nin?: InputMaybe<Array<Scalars['font_style']['input']>>
}

/** Boolean expression to compare columns of type "font_weight". All fields are combined with logical 'AND'. */
export type Font_Weight_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['font_weight']['input']>
  _gt?: InputMaybe<Scalars['font_weight']['input']>
  _gte?: InputMaybe<Scalars['font_weight']['input']>
  _in?: InputMaybe<Array<Scalars['font_weight']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['font_weight']['input']>
  _lte?: InputMaybe<Scalars['font_weight']['input']>
  _neq?: InputMaybe<Scalars['font_weight']['input']>
  _nin?: InputMaybe<Array<Scalars['font_weight']['input']>>
}

/** columns and relationships of "fonts" */
export type Fonts = {
  category: Scalars['String']['output']
  family: Scalars['String']['output']
  is_system: Scalars['Boolean']['output']
  render_family: Scalars['String']['output']
}

/** Boolean expression to filter rows from the table "fonts". All fields are combined with a logical 'AND'. */
export type Fonts_Bool_Exp = {
  _and?: InputMaybe<Array<Fonts_Bool_Exp>>
  _not?: InputMaybe<Fonts_Bool_Exp>
  _or?: InputMaybe<Array<Fonts_Bool_Exp>>
  category?: InputMaybe<String_Comparison_Exp>
  family?: InputMaybe<String_Comparison_Exp>
  is_system?: InputMaybe<Boolean_Comparison_Exp>
  render_family?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "fonts". */
export type Fonts_Order_By = {
  category?: InputMaybe<Order_By>
  family?: InputMaybe<Order_By>
  is_system?: InputMaybe<Order_By>
  render_family?: InputMaybe<Order_By>
}

/** select columns of table "fonts" */
export type Fonts_Select_Column =
  /** column name */
  | 'category'
  /** column name */
  | 'family'
  /** column name */
  | 'is_system'
  /** column name */
  | 'render_family'

/** Streaming cursor of the table "fonts" */
export type Fonts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Fonts_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Fonts_Stream_Cursor_Value_Input = {
  category?: InputMaybe<Scalars['String']['input']>
  family?: InputMaybe<Scalars['String']['input']>
  is_system?: InputMaybe<Scalars['Boolean']['input']>
  render_family?: InputMaybe<Scalars['String']['input']>
}

/** Boolean expression to compare columns of type "job_kind". All fields are combined with logical 'AND'. */
export type Job_Kind_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['job_kind']['input']>
  _gt?: InputMaybe<Scalars['job_kind']['input']>
  _gte?: InputMaybe<Scalars['job_kind']['input']>
  _in?: InputMaybe<Array<Scalars['job_kind']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['job_kind']['input']>
  _lte?: InputMaybe<Scalars['job_kind']['input']>
  _neq?: InputMaybe<Scalars['job_kind']['input']>
  _nin?: InputMaybe<Array<Scalars['job_kind']['input']>>
}

/** Boolean expression to compare columns of type "job_status". All fields are combined with logical 'AND'. */
export type Job_Status_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['job_status']['input']>
  _gt?: InputMaybe<Scalars['job_status']['input']>
  _gte?: InputMaybe<Scalars['job_status']['input']>
  _in?: InputMaybe<Array<Scalars['job_status']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['job_status']['input']>
  _lte?: InputMaybe<Scalars['job_status']['input']>
  _neq?: InputMaybe<Scalars['job_status']['input']>
  _nin?: InputMaybe<Array<Scalars['job_status']['input']>>
}

/** columns and relationships of "jobs" */
export type Jobs = {
  created_at: Scalars['timestamptz']['output']
  created_by?: Maybe<Scalars['uuid']['output']>
  /** An object relationship */
  creator?: Maybe<Profiles>
  error?: Maybe<Scalars['String']['output']>
  finished_at?: Maybe<Scalars['timestamptz']['output']>
  id: Scalars['uuid']['output']
  kind: Scalars['job_kind']['output']
  org_id: Scalars['uuid']['output']
  /** An object relationship */
  organization: Organizations
  progress: Scalars['Int']['output']
  ref_id?: Maybe<Scalars['uuid']['output']>
  result?: Maybe<Scalars['jsonb']['output']>
  started_at?: Maybe<Scalars['timestamptz']['output']>
  status: Scalars['job_status']['output']
  total: Scalars['Int']['output']
  updated_at: Scalars['timestamptz']['output']
}

/** columns and relationships of "jobs" */
export type JobsResultArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** order by aggregate values of table "jobs" */
export type Jobs_Aggregate_Order_By = {
  avg?: InputMaybe<Jobs_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Jobs_Max_Order_By>
  min?: InputMaybe<Jobs_Min_Order_By>
  stddev?: InputMaybe<Jobs_Stddev_Order_By>
  stddev_pop?: InputMaybe<Jobs_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Jobs_Stddev_Samp_Order_By>
  sum?: InputMaybe<Jobs_Sum_Order_By>
  var_pop?: InputMaybe<Jobs_Var_Pop_Order_By>
  var_samp?: InputMaybe<Jobs_Var_Samp_Order_By>
  variance?: InputMaybe<Jobs_Variance_Order_By>
}

/** order by avg() on columns of table "jobs" */
export type Jobs_Avg_Order_By = {
  progress?: InputMaybe<Order_By>
  total?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "jobs". All fields are combined with a logical 'AND'. */
export type Jobs_Bool_Exp = {
  _and?: InputMaybe<Array<Jobs_Bool_Exp>>
  _not?: InputMaybe<Jobs_Bool_Exp>
  _or?: InputMaybe<Array<Jobs_Bool_Exp>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  created_by?: InputMaybe<Uuid_Comparison_Exp>
  creator?: InputMaybe<Profiles_Bool_Exp>
  error?: InputMaybe<String_Comparison_Exp>
  finished_at?: InputMaybe<Timestamptz_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  kind?: InputMaybe<Job_Kind_Comparison_Exp>
  org_id?: InputMaybe<Uuid_Comparison_Exp>
  organization?: InputMaybe<Organizations_Bool_Exp>
  progress?: InputMaybe<Int_Comparison_Exp>
  ref_id?: InputMaybe<Uuid_Comparison_Exp>
  result?: InputMaybe<Jsonb_Comparison_Exp>
  started_at?: InputMaybe<Timestamptz_Comparison_Exp>
  status?: InputMaybe<Job_Status_Comparison_Exp>
  total?: InputMaybe<Int_Comparison_Exp>
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** order by max() on columns of table "jobs" */
export type Jobs_Max_Order_By = {
  created_at?: InputMaybe<Order_By>
  created_by?: InputMaybe<Order_By>
  error?: InputMaybe<Order_By>
  finished_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  kind?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  progress?: InputMaybe<Order_By>
  ref_id?: InputMaybe<Order_By>
  started_at?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  total?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** order by min() on columns of table "jobs" */
export type Jobs_Min_Order_By = {
  created_at?: InputMaybe<Order_By>
  created_by?: InputMaybe<Order_By>
  error?: InputMaybe<Order_By>
  finished_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  kind?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  progress?: InputMaybe<Order_By>
  ref_id?: InputMaybe<Order_By>
  started_at?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  total?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "jobs". */
export type Jobs_Order_By = {
  created_at?: InputMaybe<Order_By>
  created_by?: InputMaybe<Order_By>
  creator?: InputMaybe<Profiles_Order_By>
  error?: InputMaybe<Order_By>
  finished_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  kind?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  organization?: InputMaybe<Organizations_Order_By>
  progress?: InputMaybe<Order_By>
  ref_id?: InputMaybe<Order_By>
  result?: InputMaybe<Order_By>
  started_at?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  total?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** select columns of table "jobs" */
export type Jobs_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'error'
  /** column name */
  | 'finished_at'
  /** column name */
  | 'id'
  /** column name */
  | 'kind'
  /** column name */
  | 'org_id'
  /** column name */
  | 'progress'
  /** column name */
  | 'ref_id'
  /** column name */
  | 'result'
  /** column name */
  | 'started_at'
  /** column name */
  | 'status'
  /** column name */
  | 'total'
  /** column name */
  | 'updated_at'

/** order by stddev() on columns of table "jobs" */
export type Jobs_Stddev_Order_By = {
  progress?: InputMaybe<Order_By>
  total?: InputMaybe<Order_By>
}

/** order by stddev_pop() on columns of table "jobs" */
export type Jobs_Stddev_Pop_Order_By = {
  progress?: InputMaybe<Order_By>
  total?: InputMaybe<Order_By>
}

/** order by stddev_samp() on columns of table "jobs" */
export type Jobs_Stddev_Samp_Order_By = {
  progress?: InputMaybe<Order_By>
  total?: InputMaybe<Order_By>
}

/** Streaming cursor of the table "jobs" */
export type Jobs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Jobs_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Jobs_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>
  created_by?: InputMaybe<Scalars['uuid']['input']>
  error?: InputMaybe<Scalars['String']['input']>
  finished_at?: InputMaybe<Scalars['timestamptz']['input']>
  id?: InputMaybe<Scalars['uuid']['input']>
  kind?: InputMaybe<Scalars['job_kind']['input']>
  org_id?: InputMaybe<Scalars['uuid']['input']>
  progress?: InputMaybe<Scalars['Int']['input']>
  ref_id?: InputMaybe<Scalars['uuid']['input']>
  result?: InputMaybe<Scalars['jsonb']['input']>
  started_at?: InputMaybe<Scalars['timestamptz']['input']>
  status?: InputMaybe<Scalars['job_status']['input']>
  total?: InputMaybe<Scalars['Int']['input']>
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>
}

/** order by sum() on columns of table "jobs" */
export type Jobs_Sum_Order_By = {
  progress?: InputMaybe<Order_By>
  total?: InputMaybe<Order_By>
}

/** order by var_pop() on columns of table "jobs" */
export type Jobs_Var_Pop_Order_By = {
  progress?: InputMaybe<Order_By>
  total?: InputMaybe<Order_By>
}

/** order by var_samp() on columns of table "jobs" */
export type Jobs_Var_Samp_Order_By = {
  progress?: InputMaybe<Order_By>
  total?: InputMaybe<Order_By>
}

/** order by variance() on columns of table "jobs" */
export type Jobs_Variance_Order_By = {
  progress?: InputMaybe<Order_By>
  total?: InputMaybe<Order_By>
}

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>
}

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>
  _eq?: InputMaybe<Scalars['jsonb']['input']>
  _gt?: InputMaybe<Scalars['jsonb']['input']>
  _gte?: InputMaybe<Scalars['jsonb']['input']>
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  /** does the jsonpath return any item for the specified JSON value */
  _jsonb_path_exists?: InputMaybe<Scalars['String']['input']>
  /** does the jsonpath predicate check return true for the specified JSON value */
  _jsonb_path_match?: InputMaybe<Scalars['String']['input']>
  _lt?: InputMaybe<Scalars['jsonb']['input']>
  _lte?: InputMaybe<Scalars['jsonb']['input']>
  _neq?: InputMaybe<Scalars['jsonb']['input']>
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>
}

/** mutation root */
export type Mutation_Root = {
  /** Join an organisation with an invite token. */
  accept_invite: AcceptInviteOutput
  /** Create an organisation with the caller as owner. */
  bootstrap_org: BootstrapOrgOutput
  /** delete data from the table: "batches" */
  delete_batches?: Maybe<Batches_Mutation_Response>
  /** delete single row from the table: "batches" */
  delete_batches_by_pk?: Maybe<Batches>
  /** delete data from the table: "certificates" */
  delete_certificates?: Maybe<Certificates_Mutation_Response>
  /** delete single row from the table: "certificates" */
  delete_certificates_by_pk?: Maybe<Certificates>
  /** delete data from the table: "organization_invites" */
  delete_organization_invites?: Maybe<Organization_Invites_Mutation_Response>
  /** delete single row from the table: "organization_invites" */
  delete_organization_invites_by_pk?: Maybe<Organization_Invites>
  /** delete data from the table: "organization_members" */
  delete_organization_members?: Maybe<Organization_Members_Mutation_Response>
  /** delete single row from the table: "organization_members" */
  delete_organization_members_by_pk?: Maybe<Organization_Members>
  /** delete data from the table: "template_fields" */
  delete_template_fields?: Maybe<Template_Fields_Mutation_Response>
  /** delete single row from the table: "template_fields" */
  delete_template_fields_by_pk?: Maybe<Template_Fields>
  /** delete data from the table: "templates" */
  delete_templates?: Maybe<Templates_Mutation_Response>
  /** delete single row from the table: "templates" */
  delete_templates_by_pk?: Maybe<Templates>
  /** Queue a ZIP or PDF export of a rendered batch. */
  export_batch: JobOutput
  /** insert data into the table: "batches" */
  insert_batches?: Maybe<Batches_Mutation_Response>
  /** insert a single row into the table: "batches" */
  insert_batches_one?: Maybe<Batches>
  /** insert data into the table: "certificates" */
  insert_certificates?: Maybe<Certificates_Mutation_Response>
  /** insert a single row into the table: "certificates" */
  insert_certificates_one?: Maybe<Certificates>
  /** insert data into the table: "events" */
  insert_events?: Maybe<Events_Mutation_Response>
  /** insert a single row into the table: "events" */
  insert_events_one?: Maybe<Events>
  /** insert data into the table: "organization_members" */
  insert_organization_members?: Maybe<Organization_Members_Mutation_Response>
  /** insert a single row into the table: "organization_members" */
  insert_organization_members_one?: Maybe<Organization_Members>
  /** insert data into the table: "template_fields" */
  insert_template_fields?: Maybe<Template_Fields_Mutation_Response>
  /** insert a single row into the table: "template_fields" */
  insert_template_fields_one?: Maybe<Template_Fields>
  /** insert data into the table: "templates" */
  insert_templates?: Maybe<Templates_Mutation_Response>
  /** insert a single row into the table: "templates" */
  insert_templates_one?: Maybe<Templates>
  /** Invite a person by email. Admins and owners only. */
  invite_member: InviteMemberOutput
  /** Queue certificate emails. Needs the email-certificates feature flag. */
  send_batch_emails: JobOutput
  /** Queue the render job for a draft batch. */
  start_batch_render: JobOutput
  /** Decrypt migrated recipient data with the old password. Owners only. */
  unlock_legacy_data: UnlockLegacyDataOutput
  /** update data of the table: "certificates" */
  update_certificates?: Maybe<Certificates_Mutation_Response>
  /** update single row of the table: "certificates" */
  update_certificates_by_pk?: Maybe<Certificates>
  /** update multiples rows of table: "certificates" */
  update_certificates_many?: Maybe<Array<Maybe<Certificates_Mutation_Response>>>
  /** update data of the table: "events" */
  update_events?: Maybe<Events_Mutation_Response>
  /** update single row of the table: "events" */
  update_events_by_pk?: Maybe<Events>
  /** update multiples rows of table: "events" */
  update_events_many?: Maybe<Array<Maybe<Events_Mutation_Response>>>
  /** update data of the table: "organization_members" */
  update_organization_members?: Maybe<Organization_Members_Mutation_Response>
  /** update single row of the table: "organization_members" */
  update_organization_members_by_pk?: Maybe<Organization_Members>
  /** update multiples rows of table: "organization_members" */
  update_organization_members_many?: Maybe<Array<Maybe<Organization_Members_Mutation_Response>>>
  /** update data of the table: "organizations" */
  update_organizations?: Maybe<Organizations_Mutation_Response>
  /** update single row of the table: "organizations" */
  update_organizations_by_pk?: Maybe<Organizations>
  /** update multiples rows of table: "organizations" */
  update_organizations_many?: Maybe<Array<Maybe<Organizations_Mutation_Response>>>
  /** update data of the table: "profiles" */
  update_profiles?: Maybe<Profiles_Mutation_Response>
  /** update single row of the table: "profiles" */
  update_profiles_by_pk?: Maybe<Profiles>
  /** update multiples rows of table: "profiles" */
  update_profiles_many?: Maybe<Array<Maybe<Profiles_Mutation_Response>>>
  /** update data of the table: "template_fields" */
  update_template_fields?: Maybe<Template_Fields_Mutation_Response>
  /** update single row of the table: "template_fields" */
  update_template_fields_by_pk?: Maybe<Template_Fields>
  /** update multiples rows of table: "template_fields" */
  update_template_fields_many?: Maybe<Array<Maybe<Template_Fields_Mutation_Response>>>
  /** update data of the table: "templates" */
  update_templates?: Maybe<Templates_Mutation_Response>
  /** update single row of the table: "templates" */
  update_templates_by_pk?: Maybe<Templates>
  /** update multiples rows of table: "templates" */
  update_templates_many?: Maybe<Array<Maybe<Templates_Mutation_Response>>>
}

/** mutation root */
export type Mutation_RootAccept_InviteArgs = {
  token: Scalars['String']['input']
}

/** mutation root */
export type Mutation_RootBootstrap_OrgArgs = {
  name: Scalars['String']['input']
  slug: Scalars['String']['input']
}

/** mutation root */
export type Mutation_RootDelete_BatchesArgs = {
  where: Batches_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Batches_By_PkArgs = {
  id: Scalars['uuid']['input']
}

/** mutation root */
export type Mutation_RootDelete_CertificatesArgs = {
  where: Certificates_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Certificates_By_PkArgs = {
  id: Scalars['uuid']['input']
}

/** mutation root */
export type Mutation_RootDelete_Organization_InvitesArgs = {
  where: Organization_Invites_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Organization_Invites_By_PkArgs = {
  id: Scalars['uuid']['input']
}

/** mutation root */
export type Mutation_RootDelete_Organization_MembersArgs = {
  where: Organization_Members_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Organization_Members_By_PkArgs = {
  org_id: Scalars['uuid']['input']
  user_id: Scalars['uuid']['input']
}

/** mutation root */
export type Mutation_RootDelete_Template_FieldsArgs = {
  where: Template_Fields_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Template_Fields_By_PkArgs = {
  field_key: Scalars['field_key']['input']
  template_id: Scalars['uuid']['input']
}

/** mutation root */
export type Mutation_RootDelete_TemplatesArgs = {
  where: Templates_Bool_Exp
}

/** mutation root */
export type Mutation_RootDelete_Templates_By_PkArgs = {
  id: Scalars['uuid']['input']
}

/** mutation root */
export type Mutation_RootExport_BatchArgs = {
  batch_id: Scalars['uuid']['input']
  format: ExportFormat
}

/** mutation root */
export type Mutation_RootInsert_BatchesArgs = {
  objects: Array<Batches_Insert_Input>
  on_conflict?: InputMaybe<Batches_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Batches_OneArgs = {
  object: Batches_Insert_Input
  on_conflict?: InputMaybe<Batches_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_CertificatesArgs = {
  objects: Array<Certificates_Insert_Input>
  on_conflict?: InputMaybe<Certificates_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Certificates_OneArgs = {
  object: Certificates_Insert_Input
  on_conflict?: InputMaybe<Certificates_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_EventsArgs = {
  objects: Array<Events_Insert_Input>
  on_conflict?: InputMaybe<Events_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Events_OneArgs = {
  object: Events_Insert_Input
  on_conflict?: InputMaybe<Events_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Organization_MembersArgs = {
  objects: Array<Organization_Members_Insert_Input>
  on_conflict?: InputMaybe<Organization_Members_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Organization_Members_OneArgs = {
  object: Organization_Members_Insert_Input
  on_conflict?: InputMaybe<Organization_Members_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Template_FieldsArgs = {
  objects: Array<Template_Fields_Insert_Input>
  on_conflict?: InputMaybe<Template_Fields_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Template_Fields_OneArgs = {
  object: Template_Fields_Insert_Input
  on_conflict?: InputMaybe<Template_Fields_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_TemplatesArgs = {
  objects: Array<Templates_Insert_Input>
  on_conflict?: InputMaybe<Templates_On_Conflict>
}

/** mutation root */
export type Mutation_RootInsert_Templates_OneArgs = {
  object: Templates_Insert_Input
  on_conflict?: InputMaybe<Templates_On_Conflict>
}

/** mutation root */
export type Mutation_RootInvite_MemberArgs = {
  email: Scalars['String']['input']
  org_id: Scalars['uuid']['input']
  role: Scalars['String']['input']
}

/** mutation root */
export type Mutation_RootSend_Batch_EmailsArgs = {
  batch_id: Scalars['uuid']['input']
}

/** mutation root */
export type Mutation_RootStart_Batch_RenderArgs = {
  batch_id: Scalars['uuid']['input']
}

/** mutation root */
export type Mutation_RootUnlock_Legacy_DataArgs = {
  org_id: Scalars['uuid']['input']
  password: Scalars['String']['input']
}

/** mutation root */
export type Mutation_RootUpdate_CertificatesArgs = {
  _set?: InputMaybe<Certificates_Set_Input>
  where: Certificates_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Certificates_By_PkArgs = {
  _set?: InputMaybe<Certificates_Set_Input>
  pk_columns: Certificates_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_Certificates_ManyArgs = {
  updates: Array<Certificates_Updates>
}

/** mutation root */
export type Mutation_RootUpdate_EventsArgs = {
  _set?: InputMaybe<Events_Set_Input>
  where: Events_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Events_By_PkArgs = {
  _set?: InputMaybe<Events_Set_Input>
  pk_columns: Events_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_Events_ManyArgs = {
  updates: Array<Events_Updates>
}

/** mutation root */
export type Mutation_RootUpdate_Organization_MembersArgs = {
  _set?: InputMaybe<Organization_Members_Set_Input>
  where: Organization_Members_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Organization_Members_By_PkArgs = {
  _set?: InputMaybe<Organization_Members_Set_Input>
  pk_columns: Organization_Members_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_Organization_Members_ManyArgs = {
  updates: Array<Organization_Members_Updates>
}

/** mutation root */
export type Mutation_RootUpdate_OrganizationsArgs = {
  _set?: InputMaybe<Organizations_Set_Input>
  where: Organizations_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Organizations_By_PkArgs = {
  _set?: InputMaybe<Organizations_Set_Input>
  pk_columns: Organizations_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_Organizations_ManyArgs = {
  updates: Array<Organizations_Updates>
}

/** mutation root */
export type Mutation_RootUpdate_ProfilesArgs = {
  _set?: InputMaybe<Profiles_Set_Input>
  where: Profiles_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Profiles_By_PkArgs = {
  _set?: InputMaybe<Profiles_Set_Input>
  pk_columns: Profiles_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_Profiles_ManyArgs = {
  updates: Array<Profiles_Updates>
}

/** mutation root */
export type Mutation_RootUpdate_Template_FieldsArgs = {
  _inc?: InputMaybe<Template_Fields_Inc_Input>
  _set?: InputMaybe<Template_Fields_Set_Input>
  where: Template_Fields_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Template_Fields_By_PkArgs = {
  _inc?: InputMaybe<Template_Fields_Inc_Input>
  _set?: InputMaybe<Template_Fields_Set_Input>
  pk_columns: Template_Fields_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_Template_Fields_ManyArgs = {
  updates: Array<Template_Fields_Updates>
}

/** mutation root */
export type Mutation_RootUpdate_TemplatesArgs = {
  _inc?: InputMaybe<Templates_Inc_Input>
  _set?: InputMaybe<Templates_Set_Input>
  where: Templates_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_Templates_By_PkArgs = {
  _inc?: InputMaybe<Templates_Inc_Input>
  _set?: InputMaybe<Templates_Set_Input>
  pk_columns: Templates_Pk_Columns_Input
}

/** mutation root */
export type Mutation_RootUpdate_Templates_ManyArgs = {
  updates: Array<Templates_Updates>
}

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>
  _gt?: InputMaybe<Scalars['numeric']['input']>
  _gte?: InputMaybe<Scalars['numeric']['input']>
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['numeric']['input']>
  _lte?: InputMaybe<Scalars['numeric']['input']>
  _neq?: InputMaybe<Scalars['numeric']['input']>
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>
}

/** column ordering options */
export type Order_By =
  /** in ascending order, nulls last */
  | 'asc'
  /** in ascending order, nulls first */
  | 'asc_nulls_first'
  /** in ascending order, nulls last */
  | 'asc_nulls_last'
  /** in descending order, nulls first */
  | 'desc'
  /** in descending order, nulls first */
  | 'desc_nulls_first'
  /** in descending order, nulls last */
  | 'desc_nulls_last'

/** Boolean expression to compare columns of type "org_role". All fields are combined with logical 'AND'. */
export type Org_Role_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['org_role']['input']>
  _gt?: InputMaybe<Scalars['org_role']['input']>
  _gte?: InputMaybe<Scalars['org_role']['input']>
  _in?: InputMaybe<Array<Scalars['org_role']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['org_role']['input']>
  _lte?: InputMaybe<Scalars['org_role']['input']>
  _neq?: InputMaybe<Scalars['org_role']['input']>
  _nin?: InputMaybe<Array<Scalars['org_role']['input']>>
}

/** columns and relationships of "org_stats" */
export type Org_Stats = {
  batches_count?: Maybe<Scalars['bigint']['output']>
  certificates_count?: Maybe<Scalars['bigint']['output']>
  events_count?: Maybe<Scalars['bigint']['output']>
  last_batch_at?: Maybe<Scalars['timestamptz']['output']>
  org_id?: Maybe<Scalars['uuid']['output']>
  /** An object relationship */
  organization?: Maybe<Organizations>
}

/** Boolean expression to filter rows from the table "org_stats". All fields are combined with a logical 'AND'. */
export type Org_Stats_Bool_Exp = {
  _and?: InputMaybe<Array<Org_Stats_Bool_Exp>>
  _not?: InputMaybe<Org_Stats_Bool_Exp>
  _or?: InputMaybe<Array<Org_Stats_Bool_Exp>>
  batches_count?: InputMaybe<Bigint_Comparison_Exp>
  certificates_count?: InputMaybe<Bigint_Comparison_Exp>
  events_count?: InputMaybe<Bigint_Comparison_Exp>
  last_batch_at?: InputMaybe<Timestamptz_Comparison_Exp>
  org_id?: InputMaybe<Uuid_Comparison_Exp>
  organization?: InputMaybe<Organizations_Bool_Exp>
}

/** Ordering options when selecting data from "org_stats". */
export type Org_Stats_Order_By = {
  batches_count?: InputMaybe<Order_By>
  certificates_count?: InputMaybe<Order_By>
  events_count?: InputMaybe<Order_By>
  last_batch_at?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  organization?: InputMaybe<Organizations_Order_By>
}

/** select columns of table "org_stats" */
export type Org_Stats_Select_Column =
  /** column name */
  | 'batches_count'
  /** column name */
  | 'certificates_count'
  /** column name */
  | 'events_count'
  /** column name */
  | 'last_batch_at'
  /** column name */
  | 'org_id'

/** Streaming cursor of the table "org_stats" */
export type Org_Stats_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Org_Stats_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Org_Stats_Stream_Cursor_Value_Input = {
  batches_count?: InputMaybe<Scalars['bigint']['input']>
  certificates_count?: InputMaybe<Scalars['bigint']['input']>
  events_count?: InputMaybe<Scalars['bigint']['input']>
  last_batch_at?: InputMaybe<Scalars['timestamptz']['input']>
  org_id?: InputMaybe<Scalars['uuid']['input']>
}

/** columns and relationships of "organization_invites" */
export type Organization_Invites = {
  accepted_at?: Maybe<Scalars['timestamptz']['output']>
  created_at: Scalars['timestamptz']['output']
  email: Scalars['citext']['output']
  expires_at: Scalars['timestamptz']['output']
  id: Scalars['uuid']['output']
  invited_by?: Maybe<Scalars['uuid']['output']>
  /** An object relationship */
  inviter?: Maybe<Profiles>
  org_id: Scalars['uuid']['output']
  /** An object relationship */
  organization: Organizations
  role: Scalars['org_role']['output']
}

/** order by aggregate values of table "organization_invites" */
export type Organization_Invites_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Organization_Invites_Max_Order_By>
  min?: InputMaybe<Organization_Invites_Min_Order_By>
}

/** Boolean expression to filter rows from the table "organization_invites". All fields are combined with a logical 'AND'. */
export type Organization_Invites_Bool_Exp = {
  _and?: InputMaybe<Array<Organization_Invites_Bool_Exp>>
  _not?: InputMaybe<Organization_Invites_Bool_Exp>
  _or?: InputMaybe<Array<Organization_Invites_Bool_Exp>>
  accepted_at?: InputMaybe<Timestamptz_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  email?: InputMaybe<Citext_Comparison_Exp>
  expires_at?: InputMaybe<Timestamptz_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  invited_by?: InputMaybe<Uuid_Comparison_Exp>
  inviter?: InputMaybe<Profiles_Bool_Exp>
  org_id?: InputMaybe<Uuid_Comparison_Exp>
  organization?: InputMaybe<Organizations_Bool_Exp>
  role?: InputMaybe<Org_Role_Comparison_Exp>
}

/** order by max() on columns of table "organization_invites" */
export type Organization_Invites_Max_Order_By = {
  accepted_at?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  email?: InputMaybe<Order_By>
  expires_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  invited_by?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  role?: InputMaybe<Order_By>
}

/** order by min() on columns of table "organization_invites" */
export type Organization_Invites_Min_Order_By = {
  accepted_at?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  email?: InputMaybe<Order_By>
  expires_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  invited_by?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  role?: InputMaybe<Order_By>
}

/** response of any mutation on the table "organization_invites" */
export type Organization_Invites_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output']
  /** data from the rows affected by the mutation */
  returning: Array<Organization_Invites>
}

/** Ordering options when selecting data from "organization_invites". */
export type Organization_Invites_Order_By = {
  accepted_at?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  email?: InputMaybe<Order_By>
  expires_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  invited_by?: InputMaybe<Order_By>
  inviter?: InputMaybe<Profiles_Order_By>
  org_id?: InputMaybe<Order_By>
  organization?: InputMaybe<Organizations_Order_By>
  role?: InputMaybe<Order_By>
}

/** select columns of table "organization_invites" */
export type Organization_Invites_Select_Column =
  /** column name */
  | 'accepted_at'
  /** column name */
  | 'created_at'
  /** column name */
  | 'email'
  /** column name */
  | 'expires_at'
  /** column name */
  | 'id'
  /** column name */
  | 'invited_by'
  /** column name */
  | 'org_id'
  /** column name */
  | 'role'

/** Streaming cursor of the table "organization_invites" */
export type Organization_Invites_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Organization_Invites_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Organization_Invites_Stream_Cursor_Value_Input = {
  accepted_at?: InputMaybe<Scalars['timestamptz']['input']>
  created_at?: InputMaybe<Scalars['timestamptz']['input']>
  email?: InputMaybe<Scalars['citext']['input']>
  expires_at?: InputMaybe<Scalars['timestamptz']['input']>
  id?: InputMaybe<Scalars['uuid']['input']>
  invited_by?: InputMaybe<Scalars['uuid']['input']>
  org_id?: InputMaybe<Scalars['uuid']['input']>
  role?: InputMaybe<Scalars['org_role']['input']>
}

/** columns and relationships of "organization_members" */
export type Organization_Members = {
  created_at: Scalars['timestamptz']['output']
  org_id: Scalars['uuid']['output']
  /** An object relationship */
  organization: Organizations
  /** An object relationship */
  profile: Profiles
  role: Scalars['org_role']['output']
  user_id: Scalars['uuid']['output']
}

/** order by aggregate values of table "organization_members" */
export type Organization_Members_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Organization_Members_Max_Order_By>
  min?: InputMaybe<Organization_Members_Min_Order_By>
}

/** Boolean expression to filter rows from the table "organization_members". All fields are combined with a logical 'AND'. */
export type Organization_Members_Bool_Exp = {
  _and?: InputMaybe<Array<Organization_Members_Bool_Exp>>
  _not?: InputMaybe<Organization_Members_Bool_Exp>
  _or?: InputMaybe<Array<Organization_Members_Bool_Exp>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  org_id?: InputMaybe<Uuid_Comparison_Exp>
  organization?: InputMaybe<Organizations_Bool_Exp>
  profile?: InputMaybe<Profiles_Bool_Exp>
  role?: InputMaybe<Org_Role_Comparison_Exp>
  user_id?: InputMaybe<Uuid_Comparison_Exp>
}

/** unique or primary key constraints on table "organization_members" */
export type Organization_Members_Constraint =
  /** unique or primary key constraint on columns "user_id", "org_id" */
  'organization_members_pkey'

/** input type for inserting data into table "organization_members" */
export type Organization_Members_Insert_Input = {
  org_id?: InputMaybe<Scalars['uuid']['input']>
  role?: InputMaybe<Scalars['org_role']['input']>
  user_id?: InputMaybe<Scalars['uuid']['input']>
}

/** order by max() on columns of table "organization_members" */
export type Organization_Members_Max_Order_By = {
  created_at?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  role?: InputMaybe<Order_By>
  user_id?: InputMaybe<Order_By>
}

/** order by min() on columns of table "organization_members" */
export type Organization_Members_Min_Order_By = {
  created_at?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  role?: InputMaybe<Order_By>
  user_id?: InputMaybe<Order_By>
}

/** response of any mutation on the table "organization_members" */
export type Organization_Members_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output']
  /** data from the rows affected by the mutation */
  returning: Array<Organization_Members>
}

/** on_conflict condition type for table "organization_members" */
export type Organization_Members_On_Conflict = {
  constraint: Organization_Members_Constraint
  update_columns?: Array<Organization_Members_Update_Column>
  where?: InputMaybe<Organization_Members_Bool_Exp>
}

/** Ordering options when selecting data from "organization_members". */
export type Organization_Members_Order_By = {
  created_at?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  organization?: InputMaybe<Organizations_Order_By>
  profile?: InputMaybe<Profiles_Order_By>
  role?: InputMaybe<Order_By>
  user_id?: InputMaybe<Order_By>
}

/** primary key columns input for table: organization_members */
export type Organization_Members_Pk_Columns_Input = {
  org_id: Scalars['uuid']['input']
  user_id: Scalars['uuid']['input']
}

/** select columns of table "organization_members" */
export type Organization_Members_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'org_id'
  /** column name */
  | 'role'
  /** column name */
  | 'user_id'

/** input type for updating data in table "organization_members" */
export type Organization_Members_Set_Input = {
  role?: InputMaybe<Scalars['org_role']['input']>
}

/** Streaming cursor of the table "organization_members" */
export type Organization_Members_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Organization_Members_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Organization_Members_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>
  org_id?: InputMaybe<Scalars['uuid']['input']>
  role?: InputMaybe<Scalars['org_role']['input']>
  user_id?: InputMaybe<Scalars['uuid']['input']>
}

/** update columns of table "organization_members" */
export type Organization_Members_Update_Column =
  /** column name */
  'role'

export type Organization_Members_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Organization_Members_Set_Input>
  /** filter the rows which have to be updated */
  where: Organization_Members_Bool_Exp
}

/** columns and relationships of "organizations" */
export type Organizations = {
  created_at: Scalars['timestamptz']['output']
  /** An array relationship */
  events: Array<Events>
  /** An aggregate relationship */
  events_aggregate: Events_Aggregate
  /** An array relationship */
  feature_flags: Array<Feature_Flags>
  id: Scalars['uuid']['output']
  /** An array relationship */
  invites: Array<Organization_Invites>
  /** An array relationship */
  jobs: Array<Jobs>
  /** An array relationship */
  members: Array<Organization_Members>
  name: Scalars['String']['output']
  show_name_on_verify: Scalars['Boolean']['output']
  slug: Scalars['String']['output']
  /** An object relationship */
  stats?: Maybe<Org_Stats>
  updated_at: Scalars['timestamptz']['output']
}

/** columns and relationships of "organizations" */
export type OrganizationsEventsArgs = {
  distinct_on?: InputMaybe<Array<Events_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Events_Order_By>>
  where?: InputMaybe<Events_Bool_Exp>
}

/** columns and relationships of "organizations" */
export type OrganizationsEvents_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Events_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Events_Order_By>>
  where?: InputMaybe<Events_Bool_Exp>
}

/** columns and relationships of "organizations" */
export type OrganizationsFeature_FlagsArgs = {
  distinct_on?: InputMaybe<Array<Feature_Flags_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Feature_Flags_Order_By>>
  where?: InputMaybe<Feature_Flags_Bool_Exp>
}

/** columns and relationships of "organizations" */
export type OrganizationsInvitesArgs = {
  distinct_on?: InputMaybe<Array<Organization_Invites_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Organization_Invites_Order_By>>
  where?: InputMaybe<Organization_Invites_Bool_Exp>
}

/** columns and relationships of "organizations" */
export type OrganizationsJobsArgs = {
  distinct_on?: InputMaybe<Array<Jobs_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Jobs_Order_By>>
  where?: InputMaybe<Jobs_Bool_Exp>
}

/** columns and relationships of "organizations" */
export type OrganizationsMembersArgs = {
  distinct_on?: InputMaybe<Array<Organization_Members_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Organization_Members_Order_By>>
  where?: InputMaybe<Organization_Members_Bool_Exp>
}

/** Boolean expression to filter rows from the table "organizations". All fields are combined with a logical 'AND'. */
export type Organizations_Bool_Exp = {
  _and?: InputMaybe<Array<Organizations_Bool_Exp>>
  _not?: InputMaybe<Organizations_Bool_Exp>
  _or?: InputMaybe<Array<Organizations_Bool_Exp>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  events?: InputMaybe<Events_Bool_Exp>
  events_aggregate?: InputMaybe<Events_Aggregate_Bool_Exp>
  feature_flags?: InputMaybe<Feature_Flags_Bool_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  invites?: InputMaybe<Organization_Invites_Bool_Exp>
  jobs?: InputMaybe<Jobs_Bool_Exp>
  members?: InputMaybe<Organization_Members_Bool_Exp>
  name?: InputMaybe<String_Comparison_Exp>
  show_name_on_verify?: InputMaybe<Boolean_Comparison_Exp>
  slug?: InputMaybe<String_Comparison_Exp>
  stats?: InputMaybe<Org_Stats_Bool_Exp>
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** response of any mutation on the table "organizations" */
export type Organizations_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output']
  /** data from the rows affected by the mutation */
  returning: Array<Organizations>
}

/** Ordering options when selecting data from "organizations". */
export type Organizations_Order_By = {
  created_at?: InputMaybe<Order_By>
  events_aggregate?: InputMaybe<Events_Aggregate_Order_By>
  feature_flags_aggregate?: InputMaybe<Feature_Flags_Aggregate_Order_By>
  id?: InputMaybe<Order_By>
  invites_aggregate?: InputMaybe<Organization_Invites_Aggregate_Order_By>
  jobs_aggregate?: InputMaybe<Jobs_Aggregate_Order_By>
  members_aggregate?: InputMaybe<Organization_Members_Aggregate_Order_By>
  name?: InputMaybe<Order_By>
  show_name_on_verify?: InputMaybe<Order_By>
  slug?: InputMaybe<Order_By>
  stats?: InputMaybe<Org_Stats_Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** primary key columns input for table: organizations */
export type Organizations_Pk_Columns_Input = {
  id: Scalars['uuid']['input']
}

/** select columns of table "organizations" */
export type Organizations_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'show_name_on_verify'
  /** column name */
  | 'slug'
  /** column name */
  | 'updated_at'

/** input type for updating data in table "organizations" */
export type Organizations_Set_Input = {
  name?: InputMaybe<Scalars['String']['input']>
  show_name_on_verify?: InputMaybe<Scalars['Boolean']['input']>
}

/** Streaming cursor of the table "organizations" */
export type Organizations_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Organizations_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Organizations_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>
  id?: InputMaybe<Scalars['uuid']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  show_name_on_verify?: InputMaybe<Scalars['Boolean']['input']>
  slug?: InputMaybe<Scalars['String']['input']>
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>
}

export type Organizations_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Organizations_Set_Input>
  /** filter the rows which have to be updated */
  where: Organizations_Bool_Exp
}

/** columns and relationships of "profiles" */
export type Profiles = {
  created_at: Scalars['timestamptz']['output']
  email: Scalars['citext']['output']
  full_name?: Maybe<Scalars['String']['output']>
  id: Scalars['uuid']['output']
  /** An array relationship */
  memberships: Array<Organization_Members>
  updated_at: Scalars['timestamptz']['output']
}

/** columns and relationships of "profiles" */
export type ProfilesMembershipsArgs = {
  distinct_on?: InputMaybe<Array<Organization_Members_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Organization_Members_Order_By>>
  where?: InputMaybe<Organization_Members_Bool_Exp>
}

/** Boolean expression to filter rows from the table "profiles". All fields are combined with a logical 'AND'. */
export type Profiles_Bool_Exp = {
  _and?: InputMaybe<Array<Profiles_Bool_Exp>>
  _not?: InputMaybe<Profiles_Bool_Exp>
  _or?: InputMaybe<Array<Profiles_Bool_Exp>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  email?: InputMaybe<Citext_Comparison_Exp>
  full_name?: InputMaybe<String_Comparison_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  memberships?: InputMaybe<Organization_Members_Bool_Exp>
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** response of any mutation on the table "profiles" */
export type Profiles_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output']
  /** data from the rows affected by the mutation */
  returning: Array<Profiles>
}

/** Ordering options when selecting data from "profiles". */
export type Profiles_Order_By = {
  created_at?: InputMaybe<Order_By>
  email?: InputMaybe<Order_By>
  full_name?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  memberships_aggregate?: InputMaybe<Organization_Members_Aggregate_Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** primary key columns input for table: profiles */
export type Profiles_Pk_Columns_Input = {
  id: Scalars['uuid']['input']
}

/** select columns of table "profiles" */
export type Profiles_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'email'
  /** column name */
  | 'full_name'
  /** column name */
  | 'id'
  /** column name */
  | 'updated_at'

/** input type for updating data in table "profiles" */
export type Profiles_Set_Input = {
  full_name?: InputMaybe<Scalars['String']['input']>
}

/** Streaming cursor of the table "profiles" */
export type Profiles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Profiles_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Profiles_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>
  email?: InputMaybe<Scalars['citext']['input']>
  full_name?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['uuid']['input']>
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>
}

export type Profiles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Profiles_Set_Input>
  /** filter the rows which have to be updated */
  where: Profiles_Bool_Exp
}

export type Query_Root = {
  /** fetch data from the table: "audit_log" */
  audit_log: Array<Audit_Log>
  /** fetch data from the table: "audit_log" using primary key columns */
  audit_log_by_pk?: Maybe<Audit_Log>
  /** An array relationship */
  batches: Array<Batches>
  /** An aggregate relationship */
  batches_aggregate: Batches_Aggregate
  /** fetch data from the table: "batches" using primary key columns */
  batches_by_pk?: Maybe<Batches>
  /** An array relationship */
  certificates: Array<Certificates>
  /** An aggregate relationship */
  certificates_aggregate: Certificates_Aggregate
  /** fetch data from the table: "certificates" using primary key columns */
  certificates_by_pk?: Maybe<Certificates>
  /** An array relationship */
  email_deliveries: Array<Email_Deliveries>
  /** An aggregate relationship */
  email_deliveries_aggregate: Email_Deliveries_Aggregate
  /** fetch data from the table: "email_deliveries" using primary key columns */
  email_deliveries_by_pk?: Maybe<Email_Deliveries>
  /** An array relationship */
  events: Array<Events>
  /** An aggregate relationship */
  events_aggregate: Events_Aggregate
  /** fetch data from the table: "events" using primary key columns */
  events_by_pk?: Maybe<Events>
  /** An array relationship */
  feature_flags: Array<Feature_Flags>
  /** fetch data from the table: "feature_flags" using primary key columns */
  feature_flags_by_pk?: Maybe<Feature_Flags>
  /** fetch data from the table: "fonts" */
  fonts: Array<Fonts>
  /** fetch data from the table: "fonts" using primary key columns */
  fonts_by_pk?: Maybe<Fonts>
  /** Signed download URL for a finished export job. */
  get_export_url: SignedUrlOutput
  /** Signed image URL for the public verify page. */
  get_verify_preview_url?: Maybe<SignedUrlOutput>
  /** An array relationship */
  jobs: Array<Jobs>
  /** fetch data from the table: "jobs" using primary key columns */
  jobs_by_pk?: Maybe<Jobs>
  /** fetch data from the table: "org_stats" */
  org_stats: Array<Org_Stats>
  /** fetch data from the table: "organization_invites" */
  organization_invites: Array<Organization_Invites>
  /** fetch data from the table: "organization_invites" using primary key columns */
  organization_invites_by_pk?: Maybe<Organization_Invites>
  /** fetch data from the table: "organization_members" */
  organization_members: Array<Organization_Members>
  /** fetch data from the table: "organization_members" using primary key columns */
  organization_members_by_pk?: Maybe<Organization_Members>
  /** fetch data from the table: "organizations" */
  organizations: Array<Organizations>
  /** fetch data from the table: "organizations" using primary key columns */
  organizations_by_pk?: Maybe<Organizations>
  /** fetch data from the table: "profiles" */
  profiles: Array<Profiles>
  /** fetch data from the table: "profiles" using primary key columns */
  profiles_by_pk?: Maybe<Profiles>
  /** fetch data from the table: "template_fields" */
  template_fields: Array<Template_Fields>
  /** fetch data from the table: "template_fields" using primary key columns */
  template_fields_by_pk?: Maybe<Template_Fields>
  /** fetch data from the table: "templates" */
  templates: Array<Templates>
  /** fetch data from the table: "templates" using primary key columns */
  templates_by_pk?: Maybe<Templates>
  verify_certificate: Array<Certificate_Verification>
}

export type Query_RootAudit_LogArgs = {
  distinct_on?: InputMaybe<Array<Audit_Log_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Audit_Log_Order_By>>
  where?: InputMaybe<Audit_Log_Bool_Exp>
}

export type Query_RootAudit_Log_By_PkArgs = {
  id: Scalars['bigint']['input']
}

export type Query_RootBatchesArgs = {
  distinct_on?: InputMaybe<Array<Batches_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Batches_Order_By>>
  where?: InputMaybe<Batches_Bool_Exp>
}

export type Query_RootBatches_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Batches_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Batches_Order_By>>
  where?: InputMaybe<Batches_Bool_Exp>
}

export type Query_RootBatches_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Query_RootCertificatesArgs = {
  distinct_on?: InputMaybe<Array<Certificates_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Certificates_Order_By>>
  where?: InputMaybe<Certificates_Bool_Exp>
}

export type Query_RootCertificates_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Certificates_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Certificates_Order_By>>
  where?: InputMaybe<Certificates_Bool_Exp>
}

export type Query_RootCertificates_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Query_RootEmail_DeliveriesArgs = {
  distinct_on?: InputMaybe<Array<Email_Deliveries_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Email_Deliveries_Order_By>>
  where?: InputMaybe<Email_Deliveries_Bool_Exp>
}

export type Query_RootEmail_Deliveries_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Email_Deliveries_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Email_Deliveries_Order_By>>
  where?: InputMaybe<Email_Deliveries_Bool_Exp>
}

export type Query_RootEmail_Deliveries_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Query_RootEventsArgs = {
  distinct_on?: InputMaybe<Array<Events_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Events_Order_By>>
  where?: InputMaybe<Events_Bool_Exp>
}

export type Query_RootEvents_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Events_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Events_Order_By>>
  where?: InputMaybe<Events_Bool_Exp>
}

export type Query_RootEvents_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Query_RootFeature_FlagsArgs = {
  distinct_on?: InputMaybe<Array<Feature_Flags_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Feature_Flags_Order_By>>
  where?: InputMaybe<Feature_Flags_Bool_Exp>
}

export type Query_RootFeature_Flags_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Query_RootFontsArgs = {
  distinct_on?: InputMaybe<Array<Fonts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Fonts_Order_By>>
  where?: InputMaybe<Fonts_Bool_Exp>
}

export type Query_RootFonts_By_PkArgs = {
  family: Scalars['String']['input']
}

export type Query_RootGet_Export_UrlArgs = {
  job_id: Scalars['uuid']['input']
}

export type Query_RootGet_Verify_Preview_UrlArgs = {
  certificate_id: Scalars['uuid']['input']
}

export type Query_RootJobsArgs = {
  distinct_on?: InputMaybe<Array<Jobs_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Jobs_Order_By>>
  where?: InputMaybe<Jobs_Bool_Exp>
}

export type Query_RootJobs_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Query_RootOrg_StatsArgs = {
  distinct_on?: InputMaybe<Array<Org_Stats_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Org_Stats_Order_By>>
  where?: InputMaybe<Org_Stats_Bool_Exp>
}

export type Query_RootOrganization_InvitesArgs = {
  distinct_on?: InputMaybe<Array<Organization_Invites_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Organization_Invites_Order_By>>
  where?: InputMaybe<Organization_Invites_Bool_Exp>
}

export type Query_RootOrganization_Invites_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Query_RootOrganization_MembersArgs = {
  distinct_on?: InputMaybe<Array<Organization_Members_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Organization_Members_Order_By>>
  where?: InputMaybe<Organization_Members_Bool_Exp>
}

export type Query_RootOrganization_Members_By_PkArgs = {
  org_id: Scalars['uuid']['input']
  user_id: Scalars['uuid']['input']
}

export type Query_RootOrganizationsArgs = {
  distinct_on?: InputMaybe<Array<Organizations_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Organizations_Order_By>>
  where?: InputMaybe<Organizations_Bool_Exp>
}

export type Query_RootOrganizations_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Query_RootProfilesArgs = {
  distinct_on?: InputMaybe<Array<Profiles_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Profiles_Order_By>>
  where?: InputMaybe<Profiles_Bool_Exp>
}

export type Query_RootProfiles_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Query_RootTemplate_FieldsArgs = {
  distinct_on?: InputMaybe<Array<Template_Fields_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Template_Fields_Order_By>>
  where?: InputMaybe<Template_Fields_Bool_Exp>
}

export type Query_RootTemplate_Fields_By_PkArgs = {
  field_key: Scalars['field_key']['input']
  template_id: Scalars['uuid']['input']
}

export type Query_RootTemplatesArgs = {
  distinct_on?: InputMaybe<Array<Templates_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Templates_Order_By>>
  where?: InputMaybe<Templates_Bool_Exp>
}

export type Query_RootTemplates_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Query_RootVerify_CertificateArgs = {
  args: Verify_Certificate_Arguments
  distinct_on?: InputMaybe<Array<Certificate_Verification_Enum_Name>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Certificate_Verification_Order_By>>
  where?: InputMaybe<Certificate_Verification_Bool_Exp_Bool_Exp>
}

/** Boolean expression to compare columns of type "render_status". All fields are combined with logical 'AND'. */
export type Render_Status_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['render_status']['input']>
  _gt?: InputMaybe<Scalars['render_status']['input']>
  _gte?: InputMaybe<Scalars['render_status']['input']>
  _in?: InputMaybe<Array<Scalars['render_status']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['render_status']['input']>
  _lte?: InputMaybe<Scalars['render_status']['input']>
  _neq?: InputMaybe<Scalars['render_status']['input']>
  _nin?: InputMaybe<Array<Scalars['render_status']['input']>>
}

export type Subscription_Root = {
  /** fetch data from the table: "audit_log" */
  audit_log: Array<Audit_Log>
  /** fetch data from the table: "audit_log" using primary key columns */
  audit_log_by_pk?: Maybe<Audit_Log>
  /** fetch data from the table in a streaming manner: "audit_log" */
  audit_log_stream: Array<Audit_Log>
  /** An array relationship */
  batches: Array<Batches>
  /** An aggregate relationship */
  batches_aggregate: Batches_Aggregate
  /** fetch data from the table: "batches" using primary key columns */
  batches_by_pk?: Maybe<Batches>
  /** fetch data from the table in a streaming manner: "batches" */
  batches_stream: Array<Batches>
  /** An array relationship */
  certificates: Array<Certificates>
  /** An aggregate relationship */
  certificates_aggregate: Certificates_Aggregate
  /** fetch data from the table: "certificates" using primary key columns */
  certificates_by_pk?: Maybe<Certificates>
  /** fetch data from the table in a streaming manner: "certificates" */
  certificates_stream: Array<Certificates>
  /** An array relationship */
  email_deliveries: Array<Email_Deliveries>
  /** An aggregate relationship */
  email_deliveries_aggregate: Email_Deliveries_Aggregate
  /** fetch data from the table: "email_deliveries" using primary key columns */
  email_deliveries_by_pk?: Maybe<Email_Deliveries>
  /** fetch data from the table in a streaming manner: "email_deliveries" */
  email_deliveries_stream: Array<Email_Deliveries>
  /** An array relationship */
  events: Array<Events>
  /** An aggregate relationship */
  events_aggregate: Events_Aggregate
  /** fetch data from the table: "events" using primary key columns */
  events_by_pk?: Maybe<Events>
  /** fetch data from the table in a streaming manner: "events" */
  events_stream: Array<Events>
  /** An array relationship */
  feature_flags: Array<Feature_Flags>
  /** fetch data from the table: "feature_flags" using primary key columns */
  feature_flags_by_pk?: Maybe<Feature_Flags>
  /** fetch data from the table in a streaming manner: "feature_flags" */
  feature_flags_stream: Array<Feature_Flags>
  /** fetch data from the table: "fonts" */
  fonts: Array<Fonts>
  /** fetch data from the table: "fonts" using primary key columns */
  fonts_by_pk?: Maybe<Fonts>
  /** fetch data from the table in a streaming manner: "fonts" */
  fonts_stream: Array<Fonts>
  /** An array relationship */
  jobs: Array<Jobs>
  /** fetch data from the table: "jobs" using primary key columns */
  jobs_by_pk?: Maybe<Jobs>
  /** fetch data from the table in a streaming manner: "jobs" */
  jobs_stream: Array<Jobs>
  /** fetch data from the table: "org_stats" */
  org_stats: Array<Org_Stats>
  /** fetch data from the table in a streaming manner: "org_stats" */
  org_stats_stream: Array<Org_Stats>
  /** fetch data from the table: "organization_invites" */
  organization_invites: Array<Organization_Invites>
  /** fetch data from the table: "organization_invites" using primary key columns */
  organization_invites_by_pk?: Maybe<Organization_Invites>
  /** fetch data from the table in a streaming manner: "organization_invites" */
  organization_invites_stream: Array<Organization_Invites>
  /** fetch data from the table: "organization_members" */
  organization_members: Array<Organization_Members>
  /** fetch data from the table: "organization_members" using primary key columns */
  organization_members_by_pk?: Maybe<Organization_Members>
  /** fetch data from the table in a streaming manner: "organization_members" */
  organization_members_stream: Array<Organization_Members>
  /** fetch data from the table: "organizations" */
  organizations: Array<Organizations>
  /** fetch data from the table: "organizations" using primary key columns */
  organizations_by_pk?: Maybe<Organizations>
  /** fetch data from the table in a streaming manner: "organizations" */
  organizations_stream: Array<Organizations>
  /** fetch data from the table: "profiles" */
  profiles: Array<Profiles>
  /** fetch data from the table: "profiles" using primary key columns */
  profiles_by_pk?: Maybe<Profiles>
  /** fetch data from the table in a streaming manner: "profiles" */
  profiles_stream: Array<Profiles>
  /** fetch data from the table: "template_fields" */
  template_fields: Array<Template_Fields>
  /** fetch data from the table: "template_fields" using primary key columns */
  template_fields_by_pk?: Maybe<Template_Fields>
  /** fetch data from the table in a streaming manner: "template_fields" */
  template_fields_stream: Array<Template_Fields>
  /** fetch data from the table: "templates" */
  templates: Array<Templates>
  /** fetch data from the table: "templates" using primary key columns */
  templates_by_pk?: Maybe<Templates>
  /** fetch data from the table in a streaming manner: "templates" */
  templates_stream: Array<Templates>
  verify_certificate: Array<Certificate_Verification>
}

export type Subscription_RootAudit_LogArgs = {
  distinct_on?: InputMaybe<Array<Audit_Log_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Audit_Log_Order_By>>
  where?: InputMaybe<Audit_Log_Bool_Exp>
}

export type Subscription_RootAudit_Log_By_PkArgs = {
  id: Scalars['bigint']['input']
}

export type Subscription_RootAudit_Log_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Audit_Log_Stream_Cursor_Input>>
  where?: InputMaybe<Audit_Log_Bool_Exp>
}

export type Subscription_RootBatchesArgs = {
  distinct_on?: InputMaybe<Array<Batches_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Batches_Order_By>>
  where?: InputMaybe<Batches_Bool_Exp>
}

export type Subscription_RootBatches_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Batches_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Batches_Order_By>>
  where?: InputMaybe<Batches_Bool_Exp>
}

export type Subscription_RootBatches_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Subscription_RootBatches_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Batches_Stream_Cursor_Input>>
  where?: InputMaybe<Batches_Bool_Exp>
}

export type Subscription_RootCertificatesArgs = {
  distinct_on?: InputMaybe<Array<Certificates_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Certificates_Order_By>>
  where?: InputMaybe<Certificates_Bool_Exp>
}

export type Subscription_RootCertificates_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Certificates_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Certificates_Order_By>>
  where?: InputMaybe<Certificates_Bool_Exp>
}

export type Subscription_RootCertificates_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Subscription_RootCertificates_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Certificates_Stream_Cursor_Input>>
  where?: InputMaybe<Certificates_Bool_Exp>
}

export type Subscription_RootEmail_DeliveriesArgs = {
  distinct_on?: InputMaybe<Array<Email_Deliveries_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Email_Deliveries_Order_By>>
  where?: InputMaybe<Email_Deliveries_Bool_Exp>
}

export type Subscription_RootEmail_Deliveries_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Email_Deliveries_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Email_Deliveries_Order_By>>
  where?: InputMaybe<Email_Deliveries_Bool_Exp>
}

export type Subscription_RootEmail_Deliveries_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Subscription_RootEmail_Deliveries_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Email_Deliveries_Stream_Cursor_Input>>
  where?: InputMaybe<Email_Deliveries_Bool_Exp>
}

export type Subscription_RootEventsArgs = {
  distinct_on?: InputMaybe<Array<Events_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Events_Order_By>>
  where?: InputMaybe<Events_Bool_Exp>
}

export type Subscription_RootEvents_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Events_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Events_Order_By>>
  where?: InputMaybe<Events_Bool_Exp>
}

export type Subscription_RootEvents_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Subscription_RootEvents_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Events_Stream_Cursor_Input>>
  where?: InputMaybe<Events_Bool_Exp>
}

export type Subscription_RootFeature_FlagsArgs = {
  distinct_on?: InputMaybe<Array<Feature_Flags_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Feature_Flags_Order_By>>
  where?: InputMaybe<Feature_Flags_Bool_Exp>
}

export type Subscription_RootFeature_Flags_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Subscription_RootFeature_Flags_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Feature_Flags_Stream_Cursor_Input>>
  where?: InputMaybe<Feature_Flags_Bool_Exp>
}

export type Subscription_RootFontsArgs = {
  distinct_on?: InputMaybe<Array<Fonts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Fonts_Order_By>>
  where?: InputMaybe<Fonts_Bool_Exp>
}

export type Subscription_RootFonts_By_PkArgs = {
  family: Scalars['String']['input']
}

export type Subscription_RootFonts_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Fonts_Stream_Cursor_Input>>
  where?: InputMaybe<Fonts_Bool_Exp>
}

export type Subscription_RootJobsArgs = {
  distinct_on?: InputMaybe<Array<Jobs_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Jobs_Order_By>>
  where?: InputMaybe<Jobs_Bool_Exp>
}

export type Subscription_RootJobs_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Subscription_RootJobs_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Jobs_Stream_Cursor_Input>>
  where?: InputMaybe<Jobs_Bool_Exp>
}

export type Subscription_RootOrg_StatsArgs = {
  distinct_on?: InputMaybe<Array<Org_Stats_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Org_Stats_Order_By>>
  where?: InputMaybe<Org_Stats_Bool_Exp>
}

export type Subscription_RootOrg_Stats_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Org_Stats_Stream_Cursor_Input>>
  where?: InputMaybe<Org_Stats_Bool_Exp>
}

export type Subscription_RootOrganization_InvitesArgs = {
  distinct_on?: InputMaybe<Array<Organization_Invites_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Organization_Invites_Order_By>>
  where?: InputMaybe<Organization_Invites_Bool_Exp>
}

export type Subscription_RootOrganization_Invites_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Subscription_RootOrganization_Invites_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Organization_Invites_Stream_Cursor_Input>>
  where?: InputMaybe<Organization_Invites_Bool_Exp>
}

export type Subscription_RootOrganization_MembersArgs = {
  distinct_on?: InputMaybe<Array<Organization_Members_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Organization_Members_Order_By>>
  where?: InputMaybe<Organization_Members_Bool_Exp>
}

export type Subscription_RootOrganization_Members_By_PkArgs = {
  org_id: Scalars['uuid']['input']
  user_id: Scalars['uuid']['input']
}

export type Subscription_RootOrganization_Members_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Organization_Members_Stream_Cursor_Input>>
  where?: InputMaybe<Organization_Members_Bool_Exp>
}

export type Subscription_RootOrganizationsArgs = {
  distinct_on?: InputMaybe<Array<Organizations_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Organizations_Order_By>>
  where?: InputMaybe<Organizations_Bool_Exp>
}

export type Subscription_RootOrganizations_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Subscription_RootOrganizations_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Organizations_Stream_Cursor_Input>>
  where?: InputMaybe<Organizations_Bool_Exp>
}

export type Subscription_RootProfilesArgs = {
  distinct_on?: InputMaybe<Array<Profiles_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Profiles_Order_By>>
  where?: InputMaybe<Profiles_Bool_Exp>
}

export type Subscription_RootProfiles_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Subscription_RootProfiles_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Profiles_Stream_Cursor_Input>>
  where?: InputMaybe<Profiles_Bool_Exp>
}

export type Subscription_RootTemplate_FieldsArgs = {
  distinct_on?: InputMaybe<Array<Template_Fields_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Template_Fields_Order_By>>
  where?: InputMaybe<Template_Fields_Bool_Exp>
}

export type Subscription_RootTemplate_Fields_By_PkArgs = {
  field_key: Scalars['field_key']['input']
  template_id: Scalars['uuid']['input']
}

export type Subscription_RootTemplate_Fields_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Template_Fields_Stream_Cursor_Input>>
  where?: InputMaybe<Template_Fields_Bool_Exp>
}

export type Subscription_RootTemplatesArgs = {
  distinct_on?: InputMaybe<Array<Templates_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Templates_Order_By>>
  where?: InputMaybe<Templates_Bool_Exp>
}

export type Subscription_RootTemplates_By_PkArgs = {
  id: Scalars['uuid']['input']
}

export type Subscription_RootTemplates_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Templates_Stream_Cursor_Input>>
  where?: InputMaybe<Templates_Bool_Exp>
}

export type Subscription_RootVerify_CertificateArgs = {
  args: Verify_Certificate_Arguments
  distinct_on?: InputMaybe<Array<Certificate_Verification_Enum_Name>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Certificate_Verification_Order_By>>
  where?: InputMaybe<Certificate_Verification_Bool_Exp_Bool_Exp>
}

/** columns and relationships of "template_fields" */
export type Template_Fields = {
  color: Scalars['String']['output']
  field_key: Scalars['field_key']['output']
  /** An object relationship */
  font: Fonts
  font_family: Scalars['String']['output']
  font_style: Scalars['font_style']['output']
  font_weight: Scalars['font_weight']['output']
  height: Scalars['numeric']['output']
  /** An object relationship */
  template: Templates
  template_id: Scalars['uuid']['output']
  text_decoration: Scalars['text_decoration']['output']
  width: Scalars['numeric']['output']
  x: Scalars['numeric']['output']
  y: Scalars['numeric']['output']
}

/** order by aggregate values of table "template_fields" */
export type Template_Fields_Aggregate_Order_By = {
  avg?: InputMaybe<Template_Fields_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Template_Fields_Max_Order_By>
  min?: InputMaybe<Template_Fields_Min_Order_By>
  stddev?: InputMaybe<Template_Fields_Stddev_Order_By>
  stddev_pop?: InputMaybe<Template_Fields_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Template_Fields_Stddev_Samp_Order_By>
  sum?: InputMaybe<Template_Fields_Sum_Order_By>
  var_pop?: InputMaybe<Template_Fields_Var_Pop_Order_By>
  var_samp?: InputMaybe<Template_Fields_Var_Samp_Order_By>
  variance?: InputMaybe<Template_Fields_Variance_Order_By>
}

/** input type for inserting array relation for remote table "template_fields" */
export type Template_Fields_Arr_Rel_Insert_Input = {
  data: Array<Template_Fields_Insert_Input>
  /** upsert condition */
  on_conflict?: InputMaybe<Template_Fields_On_Conflict>
}

/** order by avg() on columns of table "template_fields" */
export type Template_Fields_Avg_Order_By = {
  height?: InputMaybe<Order_By>
  width?: InputMaybe<Order_By>
  x?: InputMaybe<Order_By>
  y?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "template_fields". All fields are combined with a logical 'AND'. */
export type Template_Fields_Bool_Exp = {
  _and?: InputMaybe<Array<Template_Fields_Bool_Exp>>
  _not?: InputMaybe<Template_Fields_Bool_Exp>
  _or?: InputMaybe<Array<Template_Fields_Bool_Exp>>
  color?: InputMaybe<String_Comparison_Exp>
  field_key?: InputMaybe<Field_Key_Comparison_Exp>
  font?: InputMaybe<Fonts_Bool_Exp>
  font_family?: InputMaybe<String_Comparison_Exp>
  font_style?: InputMaybe<Font_Style_Comparison_Exp>
  font_weight?: InputMaybe<Font_Weight_Comparison_Exp>
  height?: InputMaybe<Numeric_Comparison_Exp>
  template?: InputMaybe<Templates_Bool_Exp>
  template_id?: InputMaybe<Uuid_Comparison_Exp>
  text_decoration?: InputMaybe<Text_Decoration_Comparison_Exp>
  width?: InputMaybe<Numeric_Comparison_Exp>
  x?: InputMaybe<Numeric_Comparison_Exp>
  y?: InputMaybe<Numeric_Comparison_Exp>
}

/** unique or primary key constraints on table "template_fields" */
export type Template_Fields_Constraint =
  /** unique or primary key constraint on columns "template_id", "field_key" */
  'template_fields_pkey'

/** input type for incrementing numeric columns in table "template_fields" */
export type Template_Fields_Inc_Input = {
  height?: InputMaybe<Scalars['numeric']['input']>
  width?: InputMaybe<Scalars['numeric']['input']>
  x?: InputMaybe<Scalars['numeric']['input']>
  y?: InputMaybe<Scalars['numeric']['input']>
}

/** input type for inserting data into table "template_fields" */
export type Template_Fields_Insert_Input = {
  color?: InputMaybe<Scalars['String']['input']>
  field_key?: InputMaybe<Scalars['field_key']['input']>
  font_family?: InputMaybe<Scalars['String']['input']>
  font_style?: InputMaybe<Scalars['font_style']['input']>
  font_weight?: InputMaybe<Scalars['font_weight']['input']>
  height?: InputMaybe<Scalars['numeric']['input']>
  template?: InputMaybe<Templates_Obj_Rel_Insert_Input>
  template_id?: InputMaybe<Scalars['uuid']['input']>
  text_decoration?: InputMaybe<Scalars['text_decoration']['input']>
  width?: InputMaybe<Scalars['numeric']['input']>
  x?: InputMaybe<Scalars['numeric']['input']>
  y?: InputMaybe<Scalars['numeric']['input']>
}

/** order by max() on columns of table "template_fields" */
export type Template_Fields_Max_Order_By = {
  color?: InputMaybe<Order_By>
  field_key?: InputMaybe<Order_By>
  font_family?: InputMaybe<Order_By>
  font_style?: InputMaybe<Order_By>
  font_weight?: InputMaybe<Order_By>
  height?: InputMaybe<Order_By>
  template_id?: InputMaybe<Order_By>
  text_decoration?: InputMaybe<Order_By>
  width?: InputMaybe<Order_By>
  x?: InputMaybe<Order_By>
  y?: InputMaybe<Order_By>
}

/** order by min() on columns of table "template_fields" */
export type Template_Fields_Min_Order_By = {
  color?: InputMaybe<Order_By>
  field_key?: InputMaybe<Order_By>
  font_family?: InputMaybe<Order_By>
  font_style?: InputMaybe<Order_By>
  font_weight?: InputMaybe<Order_By>
  height?: InputMaybe<Order_By>
  template_id?: InputMaybe<Order_By>
  text_decoration?: InputMaybe<Order_By>
  width?: InputMaybe<Order_By>
  x?: InputMaybe<Order_By>
  y?: InputMaybe<Order_By>
}

/** response of any mutation on the table "template_fields" */
export type Template_Fields_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output']
  /** data from the rows affected by the mutation */
  returning: Array<Template_Fields>
}

/** on_conflict condition type for table "template_fields" */
export type Template_Fields_On_Conflict = {
  constraint: Template_Fields_Constraint
  update_columns?: Array<Template_Fields_Update_Column>
  where?: InputMaybe<Template_Fields_Bool_Exp>
}

/** Ordering options when selecting data from "template_fields". */
export type Template_Fields_Order_By = {
  color?: InputMaybe<Order_By>
  field_key?: InputMaybe<Order_By>
  font?: InputMaybe<Fonts_Order_By>
  font_family?: InputMaybe<Order_By>
  font_style?: InputMaybe<Order_By>
  font_weight?: InputMaybe<Order_By>
  height?: InputMaybe<Order_By>
  template?: InputMaybe<Templates_Order_By>
  template_id?: InputMaybe<Order_By>
  text_decoration?: InputMaybe<Order_By>
  width?: InputMaybe<Order_By>
  x?: InputMaybe<Order_By>
  y?: InputMaybe<Order_By>
}

/** primary key columns input for table: template_fields */
export type Template_Fields_Pk_Columns_Input = {
  field_key: Scalars['field_key']['input']
  template_id: Scalars['uuid']['input']
}

/** select columns of table "template_fields" */
export type Template_Fields_Select_Column =
  /** column name */
  | 'color'
  /** column name */
  | 'field_key'
  /** column name */
  | 'font_family'
  /** column name */
  | 'font_style'
  /** column name */
  | 'font_weight'
  /** column name */
  | 'height'
  /** column name */
  | 'template_id'
  /** column name */
  | 'text_decoration'
  /** column name */
  | 'width'
  /** column name */
  | 'x'
  /** column name */
  | 'y'

/** input type for updating data in table "template_fields" */
export type Template_Fields_Set_Input = {
  color?: InputMaybe<Scalars['String']['input']>
  font_family?: InputMaybe<Scalars['String']['input']>
  font_style?: InputMaybe<Scalars['font_style']['input']>
  font_weight?: InputMaybe<Scalars['font_weight']['input']>
  height?: InputMaybe<Scalars['numeric']['input']>
  text_decoration?: InputMaybe<Scalars['text_decoration']['input']>
  width?: InputMaybe<Scalars['numeric']['input']>
  x?: InputMaybe<Scalars['numeric']['input']>
  y?: InputMaybe<Scalars['numeric']['input']>
}

/** order by stddev() on columns of table "template_fields" */
export type Template_Fields_Stddev_Order_By = {
  height?: InputMaybe<Order_By>
  width?: InputMaybe<Order_By>
  x?: InputMaybe<Order_By>
  y?: InputMaybe<Order_By>
}

/** order by stddev_pop() on columns of table "template_fields" */
export type Template_Fields_Stddev_Pop_Order_By = {
  height?: InputMaybe<Order_By>
  width?: InputMaybe<Order_By>
  x?: InputMaybe<Order_By>
  y?: InputMaybe<Order_By>
}

/** order by stddev_samp() on columns of table "template_fields" */
export type Template_Fields_Stddev_Samp_Order_By = {
  height?: InputMaybe<Order_By>
  width?: InputMaybe<Order_By>
  x?: InputMaybe<Order_By>
  y?: InputMaybe<Order_By>
}

/** Streaming cursor of the table "template_fields" */
export type Template_Fields_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Template_Fields_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Template_Fields_Stream_Cursor_Value_Input = {
  color?: InputMaybe<Scalars['String']['input']>
  field_key?: InputMaybe<Scalars['field_key']['input']>
  font_family?: InputMaybe<Scalars['String']['input']>
  font_style?: InputMaybe<Scalars['font_style']['input']>
  font_weight?: InputMaybe<Scalars['font_weight']['input']>
  height?: InputMaybe<Scalars['numeric']['input']>
  template_id?: InputMaybe<Scalars['uuid']['input']>
  text_decoration?: InputMaybe<Scalars['text_decoration']['input']>
  width?: InputMaybe<Scalars['numeric']['input']>
  x?: InputMaybe<Scalars['numeric']['input']>
  y?: InputMaybe<Scalars['numeric']['input']>
}

/** order by sum() on columns of table "template_fields" */
export type Template_Fields_Sum_Order_By = {
  height?: InputMaybe<Order_By>
  width?: InputMaybe<Order_By>
  x?: InputMaybe<Order_By>
  y?: InputMaybe<Order_By>
}

/** update columns of table "template_fields" */
export type Template_Fields_Update_Column =
  /** column name */
  | 'color'
  /** column name */
  | 'font_family'
  /** column name */
  | 'font_style'
  /** column name */
  | 'font_weight'
  /** column name */
  | 'height'
  /** column name */
  | 'text_decoration'
  /** column name */
  | 'width'
  /** column name */
  | 'x'
  /** column name */
  | 'y'

export type Template_Fields_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Template_Fields_Inc_Input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Template_Fields_Set_Input>
  /** filter the rows which have to be updated */
  where: Template_Fields_Bool_Exp
}

/** order by var_pop() on columns of table "template_fields" */
export type Template_Fields_Var_Pop_Order_By = {
  height?: InputMaybe<Order_By>
  width?: InputMaybe<Order_By>
  x?: InputMaybe<Order_By>
  y?: InputMaybe<Order_By>
}

/** order by var_samp() on columns of table "template_fields" */
export type Template_Fields_Var_Samp_Order_By = {
  height?: InputMaybe<Order_By>
  width?: InputMaybe<Order_By>
  x?: InputMaybe<Order_By>
  y?: InputMaybe<Order_By>
}

/** order by variance() on columns of table "template_fields" */
export type Template_Fields_Variance_Order_By = {
  height?: InputMaybe<Order_By>
  width?: InputMaybe<Order_By>
  x?: InputMaybe<Order_By>
  y?: InputMaybe<Order_By>
}

/** columns and relationships of "templates" */
export type Templates = {
  created_at: Scalars['timestamptz']['output']
  created_by?: Maybe<Scalars['uuid']['output']>
  /** An object relationship */
  creator?: Maybe<Profiles>
  /** An object relationship */
  event?: Maybe<Events>
  event_id: Scalars['uuid']['output']
  /** An array relationship */
  fields: Array<Template_Fields>
  id: Scalars['uuid']['output']
  image_height: Scalars['Int']['output']
  image_path: Scalars['String']['output']
  image_width: Scalars['Int']['output']
  org_id: Scalars['uuid']['output']
  /** An object relationship */
  organization?: Maybe<Organizations>
  updated_at: Scalars['timestamptz']['output']
}

/** columns and relationships of "templates" */
export type TemplatesFieldsArgs = {
  distinct_on?: InputMaybe<Array<Template_Fields_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Template_Fields_Order_By>>
  where?: InputMaybe<Template_Fields_Bool_Exp>
}

/** Boolean expression to filter rows from the table "templates". All fields are combined with a logical 'AND'. */
export type Templates_Bool_Exp = {
  _and?: InputMaybe<Array<Templates_Bool_Exp>>
  _not?: InputMaybe<Templates_Bool_Exp>
  _or?: InputMaybe<Array<Templates_Bool_Exp>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  created_by?: InputMaybe<Uuid_Comparison_Exp>
  creator?: InputMaybe<Profiles_Bool_Exp>
  event?: InputMaybe<Events_Bool_Exp>
  event_id?: InputMaybe<Uuid_Comparison_Exp>
  fields?: InputMaybe<Template_Fields_Bool_Exp>
  id?: InputMaybe<Uuid_Comparison_Exp>
  image_height?: InputMaybe<Int_Comparison_Exp>
  image_path?: InputMaybe<String_Comparison_Exp>
  image_width?: InputMaybe<Int_Comparison_Exp>
  org_id?: InputMaybe<Uuid_Comparison_Exp>
  organization?: InputMaybe<Organizations_Bool_Exp>
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** unique or primary key constraints on table "templates" */
export type Templates_Constraint =
  /** unique or primary key constraint on columns "event_id" */
  | 'templates_event_id_key'
  /** unique or primary key constraint on columns "id", "event_id" */
  | 'templates_id_event_id_key'
  /** unique or primary key constraint on columns "id", "org_id" */
  | 'templates_id_org_id_key'
  /** unique or primary key constraint on columns "id" */
  | 'templates_pkey'

/** input type for incrementing numeric columns in table "templates" */
export type Templates_Inc_Input = {
  image_height?: InputMaybe<Scalars['Int']['input']>
  image_width?: InputMaybe<Scalars['Int']['input']>
}

/** input type for inserting data into table "templates" */
export type Templates_Insert_Input = {
  event?: InputMaybe<Events_Obj_Rel_Insert_Input>
  event_id?: InputMaybe<Scalars['uuid']['input']>
  fields?: InputMaybe<Template_Fields_Arr_Rel_Insert_Input>
  image_height?: InputMaybe<Scalars['Int']['input']>
  image_path?: InputMaybe<Scalars['String']['input']>
  image_width?: InputMaybe<Scalars['Int']['input']>
  org_id?: InputMaybe<Scalars['uuid']['input']>
}

/** response of any mutation on the table "templates" */
export type Templates_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output']
  /** data from the rows affected by the mutation */
  returning: Array<Templates>
}

/** input type for inserting object relation for remote table "templates" */
export type Templates_Obj_Rel_Insert_Input = {
  data: Templates_Insert_Input
  /** upsert condition */
  on_conflict?: InputMaybe<Templates_On_Conflict>
}

/** on_conflict condition type for table "templates" */
export type Templates_On_Conflict = {
  constraint: Templates_Constraint
  update_columns?: Array<Templates_Update_Column>
  where?: InputMaybe<Templates_Bool_Exp>
}

/** Ordering options when selecting data from "templates". */
export type Templates_Order_By = {
  created_at?: InputMaybe<Order_By>
  created_by?: InputMaybe<Order_By>
  creator?: InputMaybe<Profiles_Order_By>
  event?: InputMaybe<Events_Order_By>
  event_id?: InputMaybe<Order_By>
  fields_aggregate?: InputMaybe<Template_Fields_Aggregate_Order_By>
  id?: InputMaybe<Order_By>
  image_height?: InputMaybe<Order_By>
  image_path?: InputMaybe<Order_By>
  image_width?: InputMaybe<Order_By>
  org_id?: InputMaybe<Order_By>
  organization?: InputMaybe<Organizations_Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** primary key columns input for table: templates */
export type Templates_Pk_Columns_Input = {
  id: Scalars['uuid']['input']
}

/** select columns of table "templates" */
export type Templates_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'event_id'
  /** column name */
  | 'id'
  /** column name */
  | 'image_height'
  /** column name */
  | 'image_path'
  /** column name */
  | 'image_width'
  /** column name */
  | 'org_id'
  /** column name */
  | 'updated_at'

/** input type for updating data in table "templates" */
export type Templates_Set_Input = {
  image_height?: InputMaybe<Scalars['Int']['input']>
  image_path?: InputMaybe<Scalars['String']['input']>
  image_width?: InputMaybe<Scalars['Int']['input']>
}

/** Streaming cursor of the table "templates" */
export type Templates_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Templates_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Templates_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>
  created_by?: InputMaybe<Scalars['uuid']['input']>
  event_id?: InputMaybe<Scalars['uuid']['input']>
  id?: InputMaybe<Scalars['uuid']['input']>
  image_height?: InputMaybe<Scalars['Int']['input']>
  image_path?: InputMaybe<Scalars['String']['input']>
  image_width?: InputMaybe<Scalars['Int']['input']>
  org_id?: InputMaybe<Scalars['uuid']['input']>
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>
}

/** update columns of table "templates" */
export type Templates_Update_Column =
  /** column name */
  | 'image_height'
  /** column name */
  | 'image_path'
  /** column name */
  | 'image_width'

export type Templates_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Templates_Inc_Input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Templates_Set_Input>
  /** filter the rows which have to be updated */
  where: Templates_Bool_Exp
}

/** Boolean expression to compare columns of type "text_decoration". All fields are combined with logical 'AND'. */
export type Text_Decoration_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['text_decoration']['input']>
  _gt?: InputMaybe<Scalars['text_decoration']['input']>
  _gte?: InputMaybe<Scalars['text_decoration']['input']>
  _in?: InputMaybe<Array<Scalars['text_decoration']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['text_decoration']['input']>
  _lte?: InputMaybe<Scalars['text_decoration']['input']>
  _neq?: InputMaybe<Scalars['text_decoration']['input']>
  _nin?: InputMaybe<Array<Scalars['text_decoration']['input']>>
}

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>
  _gt?: InputMaybe<Scalars['timestamptz']['input']>
  _gte?: InputMaybe<Scalars['timestamptz']['input']>
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['timestamptz']['input']>
  _lte?: InputMaybe<Scalars['timestamptz']['input']>
  _neq?: InputMaybe<Scalars['timestamptz']['input']>
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>
}

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']['input']>
  _gt?: InputMaybe<Scalars['uuid']['input']>
  _gte?: InputMaybe<Scalars['uuid']['input']>
  _in?: InputMaybe<Array<Scalars['uuid']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['uuid']['input']>
  _lte?: InputMaybe<Scalars['uuid']['input']>
  _neq?: InputMaybe<Scalars['uuid']['input']>
  _nin?: InputMaybe<Array<Scalars['uuid']['input']>>
}

/** verify_certificateNative Query Arguments */
export type Verify_Certificate_Arguments = {
  /** Native Query argument certificate_id */
  certificate_id: Scalars['uuid']['input']
}

export type CreateBatchMutationVariables = Exact<{
  object: Batches_Insert_Input
}>

export type CreateBatchMutation = { insert_batches_one?: { id: string } | null }

export type StartBatchRenderMutationVariables = Exact<{
  batchId: Scalars['uuid']['input']
}>

export type StartBatchRenderMutation = { start_batch_render: { job_id: string } }

export type BatchQueryVariables = Exact<{
  id: Scalars['uuid']['input']
  limit: Scalars['Int']['input']
  offset: Scalars['Int']['input']
}>

export type BatchQuery = {
  batches_by_pk?: {
    id: string
    org_id: string
    status: import('../../types/database').Database['public']['Enums']['batch_status']
    recipient_count: number
    has_rank: boolean
    created_at: string
    event?: { id: string; name: string } | null
    creator?: { full_name?: string | null; email: string } | null
    rendered: { aggregate?: { count: number } | null }
    without_email: { aggregate?: { count: number } | null }
    certificates: Array<{
      id: string
      recipient_name?: string | null
      recipient_email?: string | null
      rank?: string | null
      file_path?: string | null
      render_status: import('../../types/database').Database['public']['Enums']['render_status']
      revoked_at?: string | null
      email_deliveries: Array<{
        status: import('../../types/database').Database['public']['Enums']['delivery_status']
        error?: string | null
        sent_at?: string | null
      }>
    }>
  } | null
}

export type BatchJobsSubscriptionVariables = Exact<{
  batchId: Scalars['uuid']['input']
}>

export type BatchJobsSubscription = {
  jobs: Array<{
    id: string
    kind: import('../../types/database').Database['public']['Enums']['job_kind']
    status: import('../../types/database').Database['public']['Enums']['job_status']
    progress: number
    total: number
    error?: string | null
    result?: Record<string, unknown> | null
    created_at: string
    finished_at?: string | null
  }>
}

export type ExportBatchMutationVariables = Exact<{
  batchId: Scalars['uuid']['input']
  format: ExportFormat
}>

export type ExportBatchMutation = { export_batch: { job_id: string } }

export type ExportUrlQueryVariables = Exact<{
  jobId: Scalars['uuid']['input']
}>

export type ExportUrlQuery = { get_export_url: { url: string; expires_at: string } }

export type SendBatchEmailsMutationVariables = Exact<{
  batchId: Scalars['uuid']['input']
}>

export type SendBatchEmailsMutation = { send_batch_emails: { job_id: string } }

export type DeliveryCountsQueryVariables = Exact<{
  batchId: Scalars['uuid']['input']
}>

export type DeliveryCountsQuery = {
  sent: { aggregate?: { count: number } | null }
  failed: { aggregate?: { count: number } | null }
  queued: { aggregate?: { count: number } | null }
}

export type CertificatesSearchQueryVariables = Exact<{
  where: Certificates_Bool_Exp
  limit: Scalars['Int']['input']
  offset: Scalars['Int']['input']
  orderBy?: InputMaybe<Array<Certificates_Order_By> | Certificates_Order_By>
}>

export type CertificatesSearchQuery = {
  certificates: Array<{
    id: string
    recipient_name?: string | null
    recipient_email?: string | null
    rank?: string | null
    created_at: string
    revoked_at?: string | null
    revoked_reason?: string | null
    render_status: import('../../types/database').Database['public']['Enums']['render_status']
    batch?: { id: string; event?: { id: string; name: string } | null } | null
  }>
  certificates_aggregate: { aggregate?: { count: number } | null }
}

export type RevokeCertificateMutationVariables = Exact<{
  id: Scalars['uuid']['input']
  revokedAt?: InputMaybe<Scalars['timestamptz']['input']>
  reason?: InputMaybe<Scalars['String']['input']>
}>

export type RevokeCertificateMutation = {
  update_certificates_by_pk?: {
    id: string
    revoked_at?: string | null
    revoked_reason?: string | null
  } | null
}

export type DashboardQueryVariables = Exact<{
  orgId: Scalars['uuid']['input']
}>

export type DashboardQuery = {
  org_stats: Array<{
    events_count?: number | null
    batches_count?: number | null
    certificates_count?: number | null
    last_batch_at?: string | null
  }>
  events: Array<{
    id: string
    name: string
    issuer_name: string
    event_date: string
    template?: { id: string; image_path: string } | null
    batches_aggregate: { aggregate?: { count: number } | null }
  }>
}

export type EventQueryVariables = Exact<{
  id: Scalars['uuid']['input']
}>

export type EventQuery = {
  events_by_pk?: {
    id: string
    org_id: string
    name: string
    issuer_name: string
    event_date: string
    deleted_at?: string | null
    template?: {
      id: string
      image_path: string
      image_width: number
      image_height: number
      fields: Array<{
        field_key: import('../../types/database').Database['public']['Enums']['field_key']
        x: number
        y: number
        width: number
        height: number
        font_family: string
        font_weight: import('../../types/database').Database['public']['Enums']['font_weight']
        font_style: import('../../types/database').Database['public']['Enums']['font_style']
        text_decoration: import('../../types/database').Database['public']['Enums']['text_decoration']
        color: string
      }>
    } | null
    batches: Array<{
      id: string
      status: import('../../types/database').Database['public']['Enums']['batch_status']
      recipient_count: number
      created_at: string
      creator?: { full_name?: string | null; email: string } | null
    }>
  } | null
}

export type CreateEventMutationVariables = Exact<{
  object: Events_Insert_Input
}>

export type CreateEventMutation = { insert_events_one?: { id: string } | null }

export type UpdateEventMutationVariables = Exact<{
  id: Scalars['uuid']['input']
  set: Events_Set_Input
}>

export type UpdateEventMutation = {
  update_events_by_pk?: {
    id: string
    name: string
    issuer_name: string
    event_date: string
    deleted_at?: string | null
  } | null
}

export type FontsQueryVariables = Exact<{ [key: string]: never }>

export type FontsQuery = {
  fonts: Array<{ family: string; category: string; is_system: boolean; render_family: string }>
}

export type CreateTemplateMutationVariables = Exact<{
  object: Templates_Insert_Input
}>

export type CreateTemplateMutation = { insert_templates_one?: { id: string } | null }

export type ReplaceTemplateMutationVariables = Exact<{
  id: Scalars['uuid']['input']
  set: Templates_Set_Input
  fields: Array<Template_Fields_Insert_Input> | Template_Fields_Insert_Input
}>

export type ReplaceTemplateMutation = {
  delete_template_fields?: { affected_rows: number } | null
  insert_template_fields?: { affected_rows: number } | null
  update_templates_by_pk?: { id: string } | null
}

export type EventOptionsQueryVariables = Exact<{
  orgId: Scalars['uuid']['input']
}>

export type EventOptionsQuery = { events: Array<{ id: string; name: string }> }

export type MyMembershipsQueryVariables = Exact<{
  userId: Scalars['uuid']['input']
}>

export type MyMembershipsQuery = {
  organization_members: Array<{
    role: import('../../types/database').Database['public']['Enums']['org_role']
    organization: { id: string; name: string; slug: string; show_name_on_verify: boolean }
  }>
}

export type BootstrapOrgMutationVariables = Exact<{
  name: Scalars['String']['input']
  slug: Scalars['String']['input']
}>

export type BootstrapOrgMutation = { bootstrap_org: { org_id: string } }

export type AcceptInviteMutationVariables = Exact<{
  token: Scalars['String']['input']
}>

export type AcceptInviteMutation = { accept_invite: { org_id: string } }

export type UpdateOrganizationMutationVariables = Exact<{
  id: Scalars['uuid']['input']
  name: Scalars['String']['input']
  showNameOnVerify: Scalars['Boolean']['input']
}>

export type UpdateOrganizationMutation = {
  update_organizations_by_pk?: { id: string; name: string; show_name_on_verify: boolean } | null
}

export type MembersQueryVariables = Exact<{
  orgId: Scalars['uuid']['input']
}>

export type MembersQuery = {
  organization_members: Array<{
    user_id: string
    role: import('../../types/database').Database['public']['Enums']['org_role']
    created_at: string
    profile: { full_name?: string | null; email: string }
  }>
}

export type InvitesQueryVariables = Exact<{
  orgId: Scalars['uuid']['input']
}>

export type InvitesQuery = {
  organization_invites: Array<{
    id: string
    email: string
    role: import('../../types/database').Database['public']['Enums']['org_role']
    expires_at: string
    created_at: string
  }>
}

export type InviteMemberMutationVariables = Exact<{
  orgId: Scalars['uuid']['input']
  email: Scalars['String']['input']
  role: Scalars['String']['input']
}>

export type InviteMemberMutation = { invite_member: { invite_id: string } }

export type DeleteInviteMutationVariables = Exact<{
  id: Scalars['uuid']['input']
}>

export type DeleteInviteMutation = { delete_organization_invites_by_pk?: { id: string } | null }

export type UpdateMemberRoleMutationVariables = Exact<{
  orgId: Scalars['uuid']['input']
  userId: Scalars['uuid']['input']
  role: Scalars['org_role']['input']
}>

export type UpdateMemberRoleMutation = {
  update_organization_members_by_pk?: {
    user_id: string
    role: import('../../types/database').Database['public']['Enums']['org_role']
  } | null
}

export type RemoveMemberMutationVariables = Exact<{
  orgId: Scalars['uuid']['input']
  userId: Scalars['uuid']['input']
}>

export type RemoveMemberMutation = {
  delete_organization_members_by_pk?: { user_id: string } | null
}

export type LockedLegacyCountQueryVariables = Exact<{
  orgId: Scalars['uuid']['input']
}>

export type LockedLegacyCountQuery = {
  certificates_aggregate: { aggregate?: { count: number } | null }
}

export type UnlockLegacyDataMutationVariables = Exact<{
  orgId: Scalars['uuid']['input']
  password: Scalars['String']['input']
}>

export type UnlockLegacyDataMutation = {
  unlock_legacy_data: { unlocked_batches: number; unlocked_certificates: number }
}

export type FeatureFlagsQueryVariables = Exact<{
  key: Scalars['String']['input']
}>

export type FeatureFlagsQuery = {
  feature_flags: Array<{ org_id?: string | null; enabled: boolean }>
}

export type VerifyCertificateQueryVariables = Exact<{
  certificateId: Scalars['uuid']['input']
}>

export type VerifyCertificateQuery = {
  verify_certificate: Array<{
    certificate_id: string
    organisation_name: string
    issuer_name: string
    event_name: string
    event_date: string
    issued_at: string
    recipient_name?: string | null
    rank?: string | null
    is_revoked: boolean
  }>
}

export type VerifyPreviewUrlQueryVariables = Exact<{
  certificateId: Scalars['uuid']['input']
}>

export type VerifyPreviewUrlQuery = { get_verify_preview_url?: { url: string } | null }

export const CreateBatchDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateBatch' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'object' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'batches_insert_input' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'insert_batches_one' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'object' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'object' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateBatchMutation, CreateBatchMutationVariables>
export const StartBatchRenderDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'StartBatchRender' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'batchId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'start_batch_render' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'batch_id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'batchId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'job_id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<StartBatchRenderMutation, StartBatchRenderMutationVariables>
export const BatchDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Batch' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'batches_by_pk' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'org_id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'recipient_count' } },
                { kind: 'Field', name: { kind: 'Name', value: 'has_rank' } },
                { kind: 'Field', name: { kind: 'Name', value: 'created_at' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'event' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'creator' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'full_name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  alias: { kind: 'Name', value: 'rendered' },
                  name: { kind: 'Name', value: 'certificates_aggregate' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'where' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'render_status' },
                            value: {
                              kind: 'ObjectValue',
                              fields: [
                                {
                                  kind: 'ObjectField',
                                  name: { kind: 'Name', value: '_eq' },
                                  value: { kind: 'EnumValue', value: 'done' },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'aggregate' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  alias: { kind: 'Name', value: 'without_email' },
                  name: { kind: 'Name', value: 'certificates_aggregate' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'where' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'recipient_email' },
                            value: {
                              kind: 'ObjectValue',
                              fields: [
                                {
                                  kind: 'ObjectField',
                                  name: { kind: 'Name', value: '_is_null' },
                                  value: { kind: 'BooleanValue', value: true },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'aggregate' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'certificates' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'order_by' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'created_at' },
                            value: { kind: 'EnumValue', value: 'asc' },
                          },
                        ],
                      },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'limit' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'offset' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'recipient_name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'recipient_email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'rank' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'file_path' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'render_status' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'revoked_at' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'email_deliveries' },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'order_by' },
                            value: {
                              kind: 'ObjectValue',
                              fields: [
                                {
                                  kind: 'ObjectField',
                                  name: { kind: 'Name', value: 'created_at' },
                                  value: { kind: 'EnumValue', value: 'desc' },
                                },
                              ],
                            },
                          },
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'limit' },
                            value: { kind: 'IntValue', value: '1' },
                          },
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'sent_at' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<BatchQuery, BatchQueryVariables>
export const BatchJobsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'subscription',
      name: { kind: 'Name', value: 'BatchJobs' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'batchId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'jobs' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'ref_id' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_eq' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'batchId' } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'order_by' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'created_at' },
                      value: { kind: 'EnumValue', value: 'desc' },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '10' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'kind' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'progress' } },
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                { kind: 'Field', name: { kind: 'Name', value: 'result' } },
                { kind: 'Field', name: { kind: 'Name', value: 'created_at' } },
                { kind: 'Field', name: { kind: 'Name', value: 'finished_at' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<BatchJobsSubscription, BatchJobsSubscriptionVariables>
export const ExportBatchDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'ExportBatch' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'batchId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'format' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ExportFormat' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'export_batch' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'batch_id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'batchId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'format' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'format' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'job_id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ExportBatchMutation, ExportBatchMutationVariables>
export const ExportUrlDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ExportUrl' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'jobId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'get_export_url' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'job_id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'jobId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                { kind: 'Field', name: { kind: 'Name', value: 'expires_at' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ExportUrlQuery, ExportUrlQueryVariables>
export const SendBatchEmailsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'SendBatchEmails' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'batchId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'send_batch_emails' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'batch_id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'batchId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'job_id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SendBatchEmailsMutation, SendBatchEmailsMutationVariables>
export const DeliveryCountsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'DeliveryCounts' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'batchId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'sent' },
            name: { kind: 'Name', value: 'email_deliveries_aggregate' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'certificate' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'batch_id' },
                            value: {
                              kind: 'ObjectValue',
                              fields: [
                                {
                                  kind: 'ObjectField',
                                  name: { kind: 'Name', value: '_eq' },
                                  value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'batchId' },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'status' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_eq' },
                            value: { kind: 'EnumValue', value: 'sent' },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'aggregate' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'failed' },
            name: { kind: 'Name', value: 'email_deliveries_aggregate' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'certificate' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'batch_id' },
                            value: {
                              kind: 'ObjectValue',
                              fields: [
                                {
                                  kind: 'ObjectField',
                                  name: { kind: 'Name', value: '_eq' },
                                  value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'batchId' },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'status' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_eq' },
                            value: { kind: 'EnumValue', value: 'failed' },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'aggregate' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'queued' },
            name: { kind: 'Name', value: 'email_deliveries_aggregate' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'certificate' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'batch_id' },
                            value: {
                              kind: 'ObjectValue',
                              fields: [
                                {
                                  kind: 'ObjectField',
                                  name: { kind: 'Name', value: '_eq' },
                                  value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'batchId' },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'status' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_eq' },
                            value: { kind: 'EnumValue', value: 'queued' },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'aggregate' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeliveryCountsQuery, DeliveryCountsQueryVariables>
export const CertificatesSearchDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'CertificatesSearch' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'where' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'certificates_bool_exp' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NonNullType',
              type: { kind: 'NamedType', name: { kind: 'Name', value: 'certificates_order_by' } },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'certificates' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'where' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'offset' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'order_by' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'recipient_name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'recipient_email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'rank' } },
                { kind: 'Field', name: { kind: 'Name', value: 'created_at' } },
                { kind: 'Field', name: { kind: 'Name', value: 'revoked_at' } },
                { kind: 'Field', name: { kind: 'Name', value: 'revoked_reason' } },
                { kind: 'Field', name: { kind: 'Name', value: 'render_status' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'batch' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'event' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'certificates_aggregate' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'where' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'aggregate' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CertificatesSearchQuery, CertificatesSearchQueryVariables>
export const RevokeCertificateDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RevokeCertificate' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'revokedAt' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'timestamptz' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'reason' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'update_certificates_by_pk' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'pk_columns' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: '_set' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'revoked_at' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'revokedAt' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'revoked_reason' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'reason' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'revoked_at' } },
                { kind: 'Field', name: { kind: 'Name', value: 'revoked_reason' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RevokeCertificateMutation, RevokeCertificateMutationVariables>
export const DashboardDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Dashboard' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'org_stats' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'org_id' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_eq' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'events_count' } },
                { kind: 'Field', name: { kind: 'Name', value: 'batches_count' } },
                { kind: 'Field', name: { kind: 'Name', value: 'certificates_count' } },
                { kind: 'Field', name: { kind: 'Name', value: 'last_batch_at' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'events' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'org_id' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_eq' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
                          },
                        ],
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'deleted_at' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_is_null' },
                            value: { kind: 'BooleanValue', value: true },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'order_by' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'event_date' },
                      value: { kind: 'EnumValue', value: 'desc' },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'issuer_name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'event_date' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'template' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'image_path' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'batches_aggregate' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'aggregate' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DashboardQuery, DashboardQueryVariables>
export const EventDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Event' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'events_by_pk' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'org_id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'issuer_name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'event_date' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deleted_at' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'template' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'image_path' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'image_width' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'image_height' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fields' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'field_key' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'x' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'y' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'width' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'height' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'font_family' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'font_weight' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'font_style' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'text_decoration' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'batches' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'order_by' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'created_at' },
                            value: { kind: 'EnumValue', value: 'desc' },
                          },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'recipient_count' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'created_at' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'creator' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'full_name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EventQuery, EventQueryVariables>
export const CreateEventDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateEvent' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'object' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'events_insert_input' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'insert_events_one' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'object' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'object' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>
export const UpdateEventDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateEvent' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'set' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'events_set_input' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'update_events_by_pk' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'pk_columns' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: '_set' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'set' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'issuer_name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'event_date' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deleted_at' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateEventMutation, UpdateEventMutationVariables>
export const FontsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Fonts' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'fonts' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'order_by' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'family' },
                      value: { kind: 'EnumValue', value: 'asc' },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'family' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'is_system' } },
                { kind: 'Field', name: { kind: 'Name', value: 'render_family' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FontsQuery, FontsQueryVariables>
export const CreateTemplateDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateTemplate' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'object' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'templates_insert_input' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'insert_templates_one' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'object' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'object' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateTemplateMutation, CreateTemplateMutationVariables>
export const ReplaceTemplateDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'ReplaceTemplate' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'set' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'templates_set_input' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'fields' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: { kind: 'Name', value: 'template_fields_insert_input' },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'delete_template_fields' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'template_id' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_eq' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'insert_template_fields' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'objects' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'fields' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'update_templates_by_pk' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'pk_columns' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: '_set' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'set' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ReplaceTemplateMutation, ReplaceTemplateMutationVariables>
export const EventOptionsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'EventOptions' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'events' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'org_id' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_eq' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'order_by' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'event_date' },
                      value: { kind: 'EnumValue', value: 'desc' },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EventOptionsQuery, EventOptionsQueryVariables>
export const MyMembershipsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'MyMemberships' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'organization_members' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'user_id' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_eq' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'order_by' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'created_at' },
                      value: { kind: 'EnumValue', value: 'asc' },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'organization' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'show_name_on_verify' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MyMembershipsQuery, MyMembershipsQueryVariables>
export const BootstrapOrgDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'BootstrapOrg' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'bootstrap_org' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'org_id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<BootstrapOrgMutation, BootstrapOrgMutationVariables>
export const AcceptInviteDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'AcceptInvite' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'token' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'accept_invite' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'token' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'token' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'org_id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AcceptInviteMutation, AcceptInviteMutationVariables>
export const UpdateOrganizationDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateOrganization' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'showNameOnVerify' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'update_organizations_by_pk' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'pk_columns' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: '_set' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'name' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'show_name_on_verify' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'showNameOnVerify' },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'show_name_on_verify' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>
export const MembersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Members' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'organization_members' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'org_id' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_eq' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'order_by' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'created_at' },
                      value: { kind: 'EnumValue', value: 'asc' },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'user_id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                { kind: 'Field', name: { kind: 'Name', value: 'created_at' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'profile' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'full_name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MembersQuery, MembersQueryVariables>
export const InvitesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Invites' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'organization_invites' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'org_id' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_eq' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
                          },
                        ],
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'accepted_at' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_is_null' },
                            value: { kind: 'BooleanValue', value: true },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'order_by' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'created_at' },
                      value: { kind: 'EnumValue', value: 'desc' },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                { kind: 'Field', name: { kind: 'Name', value: 'expires_at' } },
                { kind: 'Field', name: { kind: 'Name', value: 'created_at' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<InvitesQuery, InvitesQueryVariables>
export const InviteMemberDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'InviteMember' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'role' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'invite_member' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'org_id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'email' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'role' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'role' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'invite_id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<InviteMemberMutation, InviteMemberMutationVariables>
export const DeleteInviteDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteInvite' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'delete_organization_invites_by_pk' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteInviteMutation, DeleteInviteMutationVariables>
export const UpdateMemberRoleDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateMemberRole' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'role' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'org_role' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'update_organization_members_by_pk' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'pk_columns' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'org_id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'user_id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: '_set' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'role' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'role' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'user_id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'role' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateMemberRoleMutation, UpdateMemberRoleMutationVariables>
export const RemoveMemberDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveMember' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'delete_organization_members_by_pk' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'org_id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'user_id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'user_id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RemoveMemberMutation, RemoveMemberMutationVariables>
export const LockedLegacyCountDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'LockedLegacyCount' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'certificates_aggregate' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'org_id' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_eq' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
                          },
                        ],
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'recipient_name' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_is_null' },
                            value: { kind: 'BooleanValue', value: true },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'aggregate' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LockedLegacyCountQuery, LockedLegacyCountQueryVariables>
export const UnlockLegacyDataDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UnlockLegacyData' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'password' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'unlock_legacy_data' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'org_id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'orgId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'password' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'password' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'unlocked_batches' } },
                { kind: 'Field', name: { kind: 'Name', value: 'unlocked_certificates' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UnlockLegacyDataMutation, UnlockLegacyDataMutationVariables>
export const FeatureFlagsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FeatureFlags' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'key' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'feature_flags' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'key' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_eq' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'key' } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'org_id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FeatureFlagsQuery, FeatureFlagsQueryVariables>
export const VerifyCertificateDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'VerifyCertificate' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'certificateId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'verify_certificate' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'args' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'certificate_id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'certificateId' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'certificate_id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'organisation_name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'issuer_name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'event_name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'event_date' } },
                { kind: 'Field', name: { kind: 'Name', value: 'issued_at' } },
                { kind: 'Field', name: { kind: 'Name', value: 'recipient_name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'rank' } },
                { kind: 'Field', name: { kind: 'Name', value: 'is_revoked' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<VerifyCertificateQuery, VerifyCertificateQueryVariables>
export const VerifyPreviewUrlDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'VerifyPreviewUrl' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'certificateId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'get_verify_preview_url' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'certificate_id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'certificateId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'url' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<VerifyPreviewUrlQuery, VerifyPreviewUrlQueryVariables>
