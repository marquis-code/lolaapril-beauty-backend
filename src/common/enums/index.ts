export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  EDITOR = "editor",
}

export enum PublicationStatus {
  DRAFT = "draft",
  PENDING_REVIEW = "pending_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  PUBLISHED = "published",
}

export enum ProgramStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}

// export enum BlogStatus {
//   DRAFT = "draft",
//   PUBLISHED = "published",
//   ARCHIVED = "archived",
// }

export enum FormFieldType {
  TEXT = "text",
  EMAIL = "email",
  NUMBER = "number",
  TEXTAREA = "textarea",
  SELECT = "select",
  RADIO = "radio",
  CHECKBOX = "checkbox",
  DATE = "date",
  FILE = "file",
}

export enum AuditAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  SOFT_DELETE = "soft_delete",
  HARD_DELETE = "hard_delete",
  RESTORE = "restore",
  LOGIN = "login",
  LOGOUT = "logout",
}


export enum ContentBlockType {
  PARAGRAPH = "paragraph",
  HEADING_1 = "heading1",
  HEADING_2 = "heading2",
  HEADING_3 = "heading3",
  QUOTE = "quote",
  CODE = "code",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  EMBED = "embed",
  DIVIDER = "divider",
  LIST_ORDERED = "orderedList",
  LIST_UNORDERED = "unorderedList",
  TABLE = "table",
  CALLOUT = "callout",
  TOGGLE = "toggle",
  GALLERY = "gallery",
}

export enum BlogStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  SCHEDULED = "scheduled",
  ARCHIVED = "archived",
  PRIVATE = "private",
}
