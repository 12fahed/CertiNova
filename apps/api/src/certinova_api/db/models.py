from typing import Optional
import datetime
import decimal
import enum
import uuid

from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    Column,
    Computed,
    Date,
    DateTime,
    Enum,
    ForeignKeyConstraint,
    Identity,
    Index,
    Integer,
    Numeric,
    PrimaryKeyConstraint,
    SmallInteger,
    String,
    Table,
    Text,
    UniqueConstraint,
    Uuid,
    text,
)
from sqlalchemy.dialects.postgresql import CITEXT, JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class BatchStatus(str, enum.Enum):
    DRAFT = "draft"
    QUEUED = "queued"
    RENDERING = "rendering"
    READY = "ready"
    FAILED = "failed"


class DeliveryStatus(str, enum.Enum):
    QUEUED = "queued"
    SENT = "sent"
    FAILED = "failed"


class FieldKey(str, enum.Enum):
    RECIPIENT_NAME = "recipient_name"
    ORGANISATION_NAME = "organisation_name"
    RANK = "rank"
    CERTIFICATE_LINK = "certificate_link"
    CERTIFICATE_QR = "certificate_qr"


class FontStyle(str, enum.Enum):
    NORMAL = "normal"
    ITALIC = "italic"


class FontWeight(str, enum.Enum):
    NORMAL = "normal"
    BOLD = "bold"


class JobKind(str, enum.Enum):
    RENDER = "render"
    EXPORT = "export"
    EMAIL = "email"
    LEGACY_UNLOCK = "legacy_unlock"


class JobStatus(str, enum.Enum):
    QUEUED = "queued"
    RUNNING = "running"
    DONE = "done"
    FAILED = "failed"


class OrgRole(str, enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"


class RenderStatus(str, enum.Enum):
    PENDING = "pending"
    DONE = "done"
    FAILED = "failed"


class TextDecoration(str, enum.Enum):
    NONE = "none"
    UNDERLINE = "underline"


class Users(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint(
            "email_change_confirm_status >= 0 AND email_change_confirm_status <= 2",
            name="users_email_change_confirm_status_check",
        ),
        PrimaryKeyConstraint("id", name="users_pkey"),
        UniqueConstraint("phone", name="users_phone_key"),
        Index(
            "confirmation_token_idx",
            "confirmation_token",
            postgresql_where="((confirmation_token)::text !~ '^[0-9 ]*$'::text)",
            unique=True,
        ),
        Index(
            "email_change_token_current_idx",
            "email_change_token_current",
            postgresql_where="((email_change_token_current)::text !~ '^[0-9 ]*$'::text)",
            unique=True,
        ),
        Index(
            "email_change_token_new_idx",
            "email_change_token_new",
            postgresql_where="((email_change_token_new)::text !~ '^[0-9 ]*$'::text)",
            unique=True,
        ),
        Index(
            "reauthentication_token_idx",
            "reauthentication_token",
            postgresql_where="((reauthentication_token)::text !~ '^[0-9 ]*$'::text)",
            unique=True,
        ),
        Index(
            "recovery_token_idx",
            "recovery_token",
            postgresql_where="((recovery_token)::text !~ '^[0-9 ]*$'::text)",
            unique=True,
        ),
        Index(
            "users_email_partial_key",
            "email",
            postgresql_where="(is_sso_user = false)",
            unique=True,
        ),
        Index("users_instance_id_email_idx", "instance_id"),
        Index("users_instance_id_idx", "instance_id"),
        Index("users_is_anonymous_idx", "is_anonymous"),
        {"comment": "Auth: Stores user login data within a secure schema.", "schema": "auth"},
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    is_sso_user: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        comment="Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.",
    )
    is_anonymous: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=text("false")
    )
    instance_id: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid)
    aud: Mapped[Optional[str]] = mapped_column(String(255))
    role: Mapped[Optional[str]] = mapped_column(String(255))
    email: Mapped[Optional[str]] = mapped_column(String(255))
    encrypted_password: Mapped[Optional[str]] = mapped_column(String(255))
    email_confirmed_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    invited_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    confirmation_token: Mapped[Optional[str]] = mapped_column(String(255))
    confirmation_sent_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    recovery_token: Mapped[Optional[str]] = mapped_column(String(255))
    recovery_sent_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    email_change_token_new: Mapped[Optional[str]] = mapped_column(String(255))
    email_change: Mapped[Optional[str]] = mapped_column(String(255))
    email_change_sent_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    last_sign_in_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    raw_app_meta_data: Mapped[Optional[object]] = mapped_column(JSONB)
    raw_user_meta_data: Mapped[Optional[object]] = mapped_column(JSONB)
    is_super_admin: Mapped[Optional[bool]] = mapped_column(Boolean)
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    phone: Mapped[Optional[str]] = mapped_column(
        Text, server_default=text("NULL::character varying")
    )
    phone_confirmed_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    phone_change: Mapped[Optional[str]] = mapped_column(
        Text, server_default=text("''::character varying")
    )
    phone_change_token: Mapped[Optional[str]] = mapped_column(
        String(255), server_default=text("''::character varying")
    )
    phone_change_sent_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    confirmed_at: Mapped[Optional[datetime.datetime]] = mapped_column(
        DateTime(True), Computed("LEAST(email_confirmed_at, phone_confirmed_at)", persisted=True)
    )
    email_change_token_current: Mapped[Optional[str]] = mapped_column(
        String(255), server_default=text("''::character varying")
    )
    email_change_confirm_status: Mapped[Optional[int]] = mapped_column(
        SmallInteger, server_default=text("0")
    )
    banned_until: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    reauthentication_token: Mapped[Optional[str]] = mapped_column(
        String(255), server_default=text("''::character varying")
    )
    reauthentication_sent_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    deleted_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))

    profiles: Mapped["Profiles"] = relationship("Profiles", uselist=False, back_populates="users")


class IdMap(Base):
    __tablename__ = "id_map"
    __table_args__ = (
        PrimaryKeyConstraint("collection", "mongo_id", name="id_map_pkey"),
        UniqueConstraint("collection", "new_id", name="id_map_collection_new_id_key"),
        {
            "comment": "Maps each MongoDB _id to its new uuid, so the migration can run "
            "again safely.",
            "schema": "legacy",
        },
    )

    collection: Mapped[str] = mapped_column(Text, primary_key=True)
    mongo_id: Mapped[str] = mapped_column(Text, primary_key=True)
    new_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    migrated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )


class Fonts(Base):
    __tablename__ = "fonts"
    __table_args__ = (
        CheckConstraint(
            "category = ANY (ARRAY['sans'::text, 'serif'::text, 'script'::text, 'display'::text, 'mono'::text])",
            name="fonts_category_check",
        ),
        PrimaryKeyConstraint("family", name="fonts_pkey"),
        {"comment": "Fonts that the editor and both renderers support.", "schema": "public"},
    )

    family: Mapped[str] = mapped_column(Text, primary_key=True)
    category: Mapped[str] = mapped_column(Text, nullable=False)
    is_system: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
    render_family: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Font the server renders with. Differs from family only for system fonts that cannot be bundled.",
    )

    template_fields: Mapped[list["TemplateFields"]] = relationship(
        "TemplateFields", back_populates="fonts"
    )


t_org_stats = Table(
    "org_stats",
    Base.metadata,
    Column("org_id", Uuid),
    Column("events_count", BigInteger),
    Column("batches_count", BigInteger),
    Column("certificates_count", BigInteger),
    Column("last_batch_at", DateTime(True)),
    schema="public",
    comment="Live counts per organisation. Replaces the old Record collection.",
)


class Organizations(Base):
    __tablename__ = "organizations"
    __table_args__ = (
        CheckConstraint(
            "char_length(name) >= 2 AND char_length(name) <= 100", name="organizations_name_check"
        ),
        CheckConstraint(
            "slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::text AND char_length(slug) >= 3 AND char_length(slug) <= 64",
            name="organizations_slug_check",
        ),
        PrimaryKeyConstraint("id", name="organizations_pkey"),
        UniqueConstraint("slug", name="organizations_slug_key"),
        {"comment": "A team that issues certificates.", "schema": "public"},
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, server_default=text("gen_random_uuid()")
    )
    name: Mapped[str] = mapped_column(Text, nullable=False)
    slug: Mapped[str] = mapped_column(Text, nullable=False)
    show_name_on_verify: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("true"),
        comment="Show the recipient name on the public verify page.",
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )

    feature_flags: Mapped[list["FeatureFlags"]] = relationship("FeatureFlags", back_populates="org")
    audit_log: Mapped[list["AuditLog"]] = relationship("AuditLog", back_populates="org")
    events: Mapped[list["Events"]] = relationship("Events", back_populates="org")
    jobs: Mapped[list["Jobs"]] = relationship("Jobs", back_populates="org")
    organization_invites: Mapped[list["OrganizationInvites"]] = relationship(
        "OrganizationInvites", back_populates="org"
    )
    organization_members: Mapped[list["OrganizationMembers"]] = relationship(
        "OrganizationMembers", back_populates="org"
    )


class FeatureFlags(Base):
    __tablename__ = "feature_flags"
    __table_args__ = (
        CheckConstraint("key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::text", name="feature_flags_key_check"),
        ForeignKeyConstraint(
            ["org_id"],
            ["public.organizations.id"],
            ondelete="CASCADE",
            name="feature_flags_org_id_fkey",
        ),
        PrimaryKeyConstraint("id", name="feature_flags_pkey"),
        UniqueConstraint("key", "org_id", name="feature_flags_key_org_id_key"),
        Index("feature_flags_org_id_idx", "org_id"),
        {
            "comment": "Feature switches. A null org_id is the global value; an org row "
            "overrides it.",
            "schema": "public",
        },
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, server_default=text("gen_random_uuid()")
    )
    key: Mapped[str] = mapped_column(Text, nullable=False)
    enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    org_id: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid)

    org: Mapped[Optional["Organizations"]] = relationship(
        "Organizations", back_populates="feature_flags"
    )


class Profiles(Base):
    __tablename__ = "profiles"
    __table_args__ = (
        CheckConstraint("char_length(full_name) <= 200", name="profiles_full_name_check"),
        CheckConstraint("private.is_valid_email(email::text)", name="profiles_email_check"),
        ForeignKeyConstraint(
            ["id"], ["auth.users.id"], ondelete="CASCADE", name="profiles_id_fkey"
        ),
        PrimaryKeyConstraint("id", name="profiles_pkey"),
        {"comment": "One row per Supabase Auth user.", "schema": "public"},
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    email: Mapped[str] = mapped_column(CITEXT, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    full_name: Mapped[Optional[str]] = mapped_column(Text)

    users: Mapped["Users"] = relationship("Users", back_populates="profiles")
    audit_log: Mapped[list["AuditLog"]] = relationship("AuditLog", back_populates="actor")
    events: Mapped[list["Events"]] = relationship("Events", back_populates="profiles")
    jobs: Mapped[list["Jobs"]] = relationship("Jobs", back_populates="profiles")
    organization_invites: Mapped[list["OrganizationInvites"]] = relationship(
        "OrganizationInvites", back_populates="profiles"
    )
    organization_members: Mapped[list["OrganizationMembers"]] = relationship(
        "OrganizationMembers", back_populates="user"
    )
    templates: Mapped[list["Templates"]] = relationship("Templates", back_populates="profiles")
    batches: Mapped[list["Batches"]] = relationship("Batches", back_populates="profiles")


class AuditLog(Base):
    __tablename__ = "audit_log"
    __table_args__ = (
        ForeignKeyConstraint(
            ["actor_id"],
            ["public.profiles.id"],
            ondelete="SET NULL",
            name="audit_log_actor_id_fkey",
        ),
        ForeignKeyConstraint(
            ["org_id"],
            ["public.organizations.id"],
            ondelete="CASCADE",
            name="audit_log_org_id_fkey",
        ),
        PrimaryKeyConstraint("id", name="audit_log_pkey"),
        Index("audit_log_entity_idx", "entity", "entity_id"),
        Index("audit_log_org_id_idx", "org_id", "at"),
        {"comment": "Append-only record of important changes.", "schema": "public"},
    )

    id: Mapped[int] = mapped_column(
        BigInteger,
        Identity(
            always=True,
            start=1,
            increment=1,
            minvalue=1,
            maxvalue=9223372036854775807,
            cycle=False,
            cache=1,
        ),
        primary_key=True,
        autoincrement=True,
    )
    action: Mapped[str] = mapped_column(Text, nullable=False)
    entity: Mapped[str] = mapped_column(Text, nullable=False)
    data: Mapped[object] = mapped_column(JSONB, nullable=False, server_default=text("'{}'::jsonb"))
    at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    org_id: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid)
    actor_id: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid)
    entity_id: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid)

    actor: Mapped[Optional["Profiles"]] = relationship("Profiles", back_populates="audit_log")
    org: Mapped[Optional["Organizations"]] = relationship(
        "Organizations", back_populates="audit_log"
    )


class Events(Base):
    __tablename__ = "events"
    __table_args__ = (
        CheckConstraint(
            "char_length(issuer_name) >= 2 AND char_length(issuer_name) <= 100",
            name="events_issuer_name_check",
        ),
        CheckConstraint(
            "char_length(name) >= 2 AND char_length(name) <= 200", name="events_name_check"
        ),
        ForeignKeyConstraint(
            ["created_by"],
            ["public.profiles.id"],
            ondelete="SET NULL",
            name="events_created_by_fkey",
        ),
        ForeignKeyConstraint(
            ["org_id"], ["public.organizations.id"], ondelete="CASCADE", name="events_org_id_fkey"
        ),
        PrimaryKeyConstraint("id", name="events_pkey"),
        UniqueConstraint("id", "org_id", name="events_id_org_id_key"),
        Index("events_created_by_idx", "created_by"),
        Index("events_org_id_idx", "org_id", "event_date", postgresql_where="(deleted_at IS NULL)"),
        {
            "comment": "An event that issues certificates. Soft delete keeps old verify "
            "links working.",
            "schema": "public",
        },
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, server_default=text("gen_random_uuid()")
    )
    org_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    issuer_name: Mapped[str] = mapped_column(Text, nullable=False)
    event_date: Mapped[datetime.date] = mapped_column(
        Date, nullable=False, server_default=text("CURRENT_DATE")
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid)
    deleted_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))

    profiles: Mapped[Optional["Profiles"]] = relationship("Profiles", back_populates="events")
    org: Mapped["Organizations"] = relationship("Organizations", back_populates="events")
    templates: Mapped[list["Templates"]] = relationship("Templates", back_populates="events")
    batches: Mapped[list["Batches"]] = relationship("Batches", back_populates="events")


class Jobs(Base):
    __tablename__ = "jobs"
    __table_args__ = (
        CheckConstraint("progress <= total", name="jobs_check"),
        CheckConstraint("progress >= 0", name="jobs_progress_check"),
        CheckConstraint("total >= 0", name="jobs_total_check"),
        ForeignKeyConstraint(
            ["created_by"], ["public.profiles.id"], ondelete="SET NULL", name="jobs_created_by_fkey"
        ),
        ForeignKeyConstraint(
            ["org_id"], ["public.organizations.id"], ondelete="CASCADE", name="jobs_org_id_fkey"
        ),
        PrimaryKeyConstraint("id", name="jobs_pkey"),
        Index("jobs_org_id_idx", "org_id", "created_at"),
        Index("jobs_ref_id_idx", "ref_id"),
        {
            "comment": "Long work done by the worker. The app subscribes to progress.",
            "schema": "public",
        },
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, server_default=text("gen_random_uuid()")
    )
    org_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    kind: Mapped[JobKind] = mapped_column(
        Enum(
            JobKind,
            values_callable=lambda cls: [member.value for member in cls],
            name="job_kind",
            schema="public",
        ),
        nullable=False,
    )
    status: Mapped[JobStatus] = mapped_column(
        Enum(
            JobStatus,
            values_callable=lambda cls: [member.value for member in cls],
            name="job_status",
            schema="public",
        ),
        nullable=False,
        server_default=text("'queued'::public.job_status"),
    )
    progress: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    total: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    ref_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, comment="The batch the job works on, when it has one."
    )
    error: Mapped[Optional[str]] = mapped_column(Text)
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid)
    started_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    finished_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    result: Mapped[Optional[object]] = mapped_column(
        JSONB,
        comment='Output of a finished job, e.g. {"path": "<org_id>/<job_id>.zip", "format": "images_zip"} for exports.',
    )

    profiles: Mapped[Optional["Profiles"]] = relationship("Profiles", back_populates="jobs")
    org: Mapped["Organizations"] = relationship("Organizations", back_populates="jobs")


class OrganizationInvites(Base):
    __tablename__ = "organization_invites"
    __table_args__ = (
        CheckConstraint(
            "private.is_valid_email(email::text)", name="organization_invites_email_check"
        ),
        CheckConstraint("role <> 'owner'::public.org_role", name="organization_invites_role_check"),
        ForeignKeyConstraint(
            ["invited_by"],
            ["public.profiles.id"],
            ondelete="SET NULL",
            name="organization_invites_invited_by_fkey",
        ),
        ForeignKeyConstraint(
            ["org_id"],
            ["public.organizations.id"],
            ondelete="CASCADE",
            name="organization_invites_org_id_fkey",
        ),
        PrimaryKeyConstraint("id", name="organization_invites_pkey"),
        UniqueConstraint("token_hash", name="organization_invites_token_hash_key"),
        Index("organization_invites_org_id_idx", "org_id"),
        Index(
            "organization_invites_pending_email_idx",
            "org_id",
            "email",
            postgresql_where="(accepted_at IS NULL)",
            unique=True,
        ),
        {
            "comment": "Open invites to join an organisation. Only the token hash is stored.",
            "schema": "public",
        },
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, server_default=text("gen_random_uuid()")
    )
    org_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    email: Mapped[str] = mapped_column(CITEXT, nullable=False)
    role: Mapped[OrgRole] = mapped_column(
        Enum(
            OrgRole,
            values_callable=lambda cls: [member.value for member in cls],
            name="org_role",
            schema="public",
        ),
        nullable=False,
        server_default=text("'member'::public.org_role"),
    )
    token_hash: Mapped[str] = mapped_column(Text, nullable=False)
    expires_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("(now() + '7 days'::interval)")
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    invited_by: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid)
    accepted_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))

    profiles: Mapped[Optional["Profiles"]] = relationship(
        "Profiles", back_populates="organization_invites"
    )
    org: Mapped["Organizations"] = relationship(
        "Organizations", back_populates="organization_invites"
    )


class OrganizationMembers(Base):
    __tablename__ = "organization_members"
    __table_args__ = (
        ForeignKeyConstraint(
            ["org_id"],
            ["public.organizations.id"],
            ondelete="CASCADE",
            name="organization_members_org_id_fkey",
        ),
        ForeignKeyConstraint(
            ["user_id"],
            ["public.profiles.id"],
            ondelete="CASCADE",
            name="organization_members_user_id_fkey",
        ),
        PrimaryKeyConstraint("org_id", "user_id", name="organization_members_pkey"),
        Index("organization_members_user_id_idx", "user_id"),
        {"comment": "Links users to organisations with a role.", "schema": "public"},
    )

    org_id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    role: Mapped[OrgRole] = mapped_column(
        Enum(
            OrgRole,
            values_callable=lambda cls: [member.value for member in cls],
            name="org_role",
            schema="public",
        ),
        nullable=False,
        server_default=text("'member'::public.org_role"),
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )

    org: Mapped["Organizations"] = relationship(
        "Organizations", back_populates="organization_members"
    )
    user: Mapped["Profiles"] = relationship("Profiles", back_populates="organization_members")


class Templates(Base):
    __tablename__ = "templates"
    __table_args__ = (
        CheckConstraint("image_height > 0", name="templates_image_height_check"),
        CheckConstraint("image_width > 0", name="templates_image_width_check"),
        ForeignKeyConstraint(
            ["created_by"],
            ["public.profiles.id"],
            ondelete="SET NULL",
            name="templates_created_by_fkey",
        ),
        ForeignKeyConstraint(
            ["event_id", "org_id"],
            ["public.events.id", "public.events.org_id"],
            ondelete="CASCADE",
            name="templates_event_id_org_id_fkey",
        ),
        PrimaryKeyConstraint("id", name="templates_pkey"),
        UniqueConstraint("event_id", name="templates_event_id_key"),
        UniqueConstraint("id", "event_id", name="templates_id_event_id_key"),
        UniqueConstraint("id", "org_id", name="templates_id_org_id_key"),
        Index("templates_org_id_idx", "org_id"),
        {"comment": "The background image of an event certificate.", "schema": "public"},
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, server_default=text("gen_random_uuid()")
    )
    org_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    event_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    image_path: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Object key in the templates storage bucket: <org_id>/<template_id>.<ext>.",
    )
    image_width: Mapped[int] = mapped_column(Integer, nullable=False)
    image_height: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid)

    profiles: Mapped[Optional["Profiles"]] = relationship("Profiles", back_populates="templates")
    events: Mapped["Events"] = relationship("Events", back_populates="templates")
    batches: Mapped[list["Batches"]] = relationship("Batches", back_populates="templates")
    template_fields: Mapped[list["TemplateFields"]] = relationship(
        "TemplateFields", back_populates="template"
    )


class Batches(Base):
    __tablename__ = "batches"
    __table_args__ = (
        CheckConstraint("recipient_count >= 0", name="batches_recipient_count_check"),
        ForeignKeyConstraint(
            ["created_by"],
            ["public.profiles.id"],
            ondelete="SET NULL",
            name="batches_created_by_fkey",
        ),
        ForeignKeyConstraint(
            ["event_id", "org_id"],
            ["public.events.id", "public.events.org_id"],
            ondelete="CASCADE",
            name="batches_event_id_org_id_fkey",
        ),
        ForeignKeyConstraint(
            ["template_id", "event_id"],
            ["public.templates.id", "public.templates.event_id"],
            ondelete="CASCADE",
            name="batches_template_id_event_id_fkey",
        ),
        PrimaryKeyConstraint("id", name="batches_pkey"),
        UniqueConstraint("id", "org_id", name="batches_id_org_id_key"),
        Index("batches_event_id_idx", "event_id", "created_at"),
        Index("batches_org_id_idx", "org_id", "created_at"),
        Index("batches_template_id_idx", "template_id"),
        {"comment": "One generation run for an event.", "schema": "public"},
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, server_default=text("gen_random_uuid()")
    )
    org_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    event_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    template_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    status: Mapped[BatchStatus] = mapped_column(
        Enum(
            BatchStatus,
            values_callable=lambda cls: [member.value for member in cls],
            name="batch_status",
            schema="public",
        ),
        nullable=False,
        server_default=text("'draft'::public.batch_status"),
    )
    recipient_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    has_rank: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    template_snapshot: Mapped[Optional[object]] = mapped_column(
        JSONB,
        comment="Template image and fields at render time, so later template edits do not change issued certificates.",
    )
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid)

    profiles: Mapped[Optional["Profiles"]] = relationship("Profiles", back_populates="batches")
    events: Mapped["Events"] = relationship("Events", back_populates="batches")
    templates: Mapped["Templates"] = relationship("Templates", back_populates="batches")
    encrypted_batches: Mapped["EncryptedBatches"] = relationship(
        "EncryptedBatches", uselist=False, back_populates="batch"
    )
    certificates: Mapped[list["Certificates"]] = relationship(
        "Certificates", back_populates="batches"
    )


class TemplateFields(Base):
    __tablename__ = "template_fields"
    __table_args__ = (
        CheckConstraint(
            "color ~ '^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$'::text", name="template_fields_color_check"
        ),
        CheckConstraint("height > 0::numeric", name="template_fields_height_check"),
        CheckConstraint("width > 0::numeric", name="template_fields_width_check"),
        CheckConstraint("x >= 0::numeric", name="template_fields_x_check"),
        CheckConstraint("y >= 0::numeric", name="template_fields_y_check"),
        ForeignKeyConstraint(
            ["font_family"],
            ["public.fonts.family"],
            onupdate="CASCADE",
            name="template_fields_font_family_fkey",
        ),
        ForeignKeyConstraint(
            ["template_id"],
            ["public.templates.id"],
            ondelete="CASCADE",
            name="template_fields_template_id_fkey",
        ),
        PrimaryKeyConstraint("template_id", "field_key", name="template_fields_pkey"),
        Index("template_fields_font_family_idx", "font_family"),
        {
            "comment": "One box on a template. Positions are natural image pixels.",
            "schema": "public",
        },
    )

    template_id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    field_key: Mapped[FieldKey] = mapped_column(
        Enum(
            FieldKey,
            values_callable=lambda cls: [member.value for member in cls],
            name="field_key",
            schema="public",
        ),
        primary_key=True,
    )
    x: Mapped[decimal.Decimal] = mapped_column(Numeric, nullable=False)
    y: Mapped[decimal.Decimal] = mapped_column(Numeric, nullable=False)
    width: Mapped[decimal.Decimal] = mapped_column(Numeric, nullable=False)
    height: Mapped[decimal.Decimal] = mapped_column(Numeric, nullable=False)
    font_family: Mapped[str] = mapped_column(
        Text, nullable=False, server_default=text("'Inter'::text")
    )
    font_weight: Mapped[FontWeight] = mapped_column(
        Enum(
            FontWeight,
            values_callable=lambda cls: [member.value for member in cls],
            name="font_weight",
            schema="public",
        ),
        nullable=False,
        server_default=text("'normal'::public.font_weight"),
    )
    font_style: Mapped[FontStyle] = mapped_column(
        Enum(
            FontStyle,
            values_callable=lambda cls: [member.value for member in cls],
            name="font_style",
            schema="public",
        ),
        nullable=False,
        server_default=text("'normal'::public.font_style"),
    )
    text_decoration: Mapped[TextDecoration] = mapped_column(
        Enum(
            TextDecoration,
            values_callable=lambda cls: [member.value for member in cls],
            name="text_decoration",
            schema="public",
        ),
        nullable=False,
        server_default=text("'none'::public.text_decoration"),
    )
    color: Mapped[str] = mapped_column(Text, nullable=False, server_default=text("'#000000'::text"))

    fonts: Mapped["Fonts"] = relationship("Fonts", back_populates="template_fields")
    template: Mapped["Templates"] = relationship("Templates", back_populates="template_fields")


class EncryptedBatches(Base):
    __tablename__ = "encrypted_batches"
    __table_args__ = (
        CheckConstraint(
            "unlocked_at IS NULL AND encrypted_data IS NOT NULL AND salt IS NOT NULL AND iv IS NOT NULL OR unlocked_at IS NOT NULL AND encrypted_data IS NULL AND salt IS NULL AND iv IS NULL",
            name="encrypted_batches_check",
        ),
        ForeignKeyConstraint(
            ["batch_id"],
            ["public.batches.id"],
            ondelete="CASCADE",
            name="encrypted_batches_batch_id_fkey",
        ),
        PrimaryKeyConstraint("batch_id", name="encrypted_batches_pkey"),
        Index("encrypted_batches_locked_idx", "batch_id", postgresql_where="(unlocked_at IS NULL)"),
        {
            "comment": "Old recipient lists encrypted with the user password "
            "(AES-256-CBC, PBKDF2-SHA256).",
            "schema": "legacy",
        },
    )

    batch_id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    encrypted_data: Mapped[Optional[str]] = mapped_column(Text)
    salt: Mapped[Optional[str]] = mapped_column(Text)
    iv: Mapped[Optional[str]] = mapped_column(Text)
    unlocked_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))

    batch: Mapped["Batches"] = relationship("Batches", back_populates="encrypted_batches")


class Certificates(Base):
    __tablename__ = "certificates"
    __table_args__ = (
        CheckConstraint(
            "char_length(rank) >= 1 AND char_length(rank) <= 100", name="certificates_rank_check"
        ),
        CheckConstraint(
            "char_length(recipient_name) >= 1 AND char_length(recipient_name) <= 200",
            name="certificates_recipient_name_check",
        ),
        CheckConstraint(
            "char_length(revoked_reason) <= 500", name="certificates_revoked_reason_check"
        ),
        CheckConstraint(
            "private.is_valid_email(recipient_email::text)",
            name="certificates_recipient_email_check",
        ),
        CheckConstraint(
            "revoked_reason IS NULL OR revoked_at IS NOT NULL", name="certificates_check"
        ),
        ForeignKeyConstraint(
            ["batch_id", "org_id"],
            ["public.batches.id", "public.batches.org_id"],
            ondelete="CASCADE",
            name="certificates_batch_id_org_id_fkey",
        ),
        PrimaryKeyConstraint("id", name="certificates_pkey"),
        UniqueConstraint("id", "org_id", name="certificates_id_org_id_key"),
        Index("certificates_batch_id_idx", "batch_id"),
        Index("certificates_org_id_idx", "org_id", "created_at"),
        Index(
            "certificates_recipient_email_trgm_idx",
            postgresql_ops={"(recipient_email::text)": "gin_trgm_ops"},
            postgresql_using="gin",
        ),
        Index(
            "certificates_recipient_name_trgm_idx",
            "recipient_name",
            postgresql_ops={"recipient_name": "gin_trgm_ops"},
            postgresql_using="gin",
        ),
        {
            "comment": "One certificate for one recipient. The id is the public verify UUID.",
            "schema": "public",
        },
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, server_default=text("gen_random_uuid()")
    )
    org_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    batch_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    render_status: Mapped[RenderStatus] = mapped_column(
        Enum(
            RenderStatus,
            values_callable=lambda cls: [member.value for member in cls],
            name="render_status",
            schema="public",
        ),
        nullable=False,
        server_default=text("'pending'::public.render_status"),
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    recipient_name: Mapped[Optional[str]] = mapped_column(
        Text, comment="Null only for migrated certificates whose data is still locked."
    )
    recipient_email: Mapped[Optional[str]] = mapped_column(CITEXT)
    rank: Mapped[Optional[str]] = mapped_column(Text)
    file_path: Mapped[Optional[str]] = mapped_column(
        Text, comment="Object key in the certificates storage bucket: <org_id>/<batch_id>/<id>.png."
    )
    revoked_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    revoked_reason: Mapped[Optional[str]] = mapped_column(Text)

    batches: Mapped["Batches"] = relationship("Batches", back_populates="certificates")
    email_deliveries: Mapped[list["EmailDeliveries"]] = relationship(
        "EmailDeliveries", back_populates="certificates"
    )


class EmailDeliveries(Base):
    __tablename__ = "email_deliveries"
    __table_args__ = (
        CheckConstraint("attempts >= 0", name="email_deliveries_attempts_check"),
        CheckConstraint("private.is_valid_email(email::text)", name="email_deliveries_email_check"),
        ForeignKeyConstraint(
            ["certificate_id", "org_id"],
            ["public.certificates.id", "public.certificates.org_id"],
            ondelete="CASCADE",
            name="email_deliveries_certificate_id_org_id_fkey",
        ),
        PrimaryKeyConstraint("id", name="email_deliveries_pkey"),
        Index("email_deliveries_certificate_id_idx", "certificate_id"),
        Index("email_deliveries_org_status_idx", "org_id", "status"),
        {"comment": "One email send for one certificate.", "schema": "public"},
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, server_default=text("gen_random_uuid()")
    )
    org_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    certificate_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    email: Mapped[str] = mapped_column(CITEXT, nullable=False)
    status: Mapped[DeliveryStatus] = mapped_column(
        Enum(
            DeliveryStatus,
            values_callable=lambda cls: [member.value for member in cls],
            name="delivery_status",
            schema="public",
        ),
        nullable=False,
        server_default=text("'queued'::public.delivery_status"),
    )
    attempts: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("now()")
    )
    error: Mapped[Optional[str]] = mapped_column(Text)
    sent_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))

    certificates: Mapped["Certificates"] = relationship(
        "Certificates", back_populates="email_deliveries"
    )
