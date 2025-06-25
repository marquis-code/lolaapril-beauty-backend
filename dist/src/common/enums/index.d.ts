export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    EDITOR = "editor"
}
export declare enum PublicationStatus {
    DRAFT = "draft",
    PENDING_REVIEW = "pending_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    PUBLISHED = "published"
}
export declare enum ProgramStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    INACTIVE = "inactive",
    ARCHIVED = "archived"
}
export declare enum BlogStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare enum FormFieldType {
    TEXT = "text",
    EMAIL = "email",
    NUMBER = "number",
    TEXTAREA = "textarea",
    SELECT = "select",
    RADIO = "radio",
    CHECKBOX = "checkbox",
    DATE = "date",
    FILE = "file"
}
export declare enum AuditAction {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
    SOFT_DELETE = "soft_delete",
    HARD_DELETE = "hard_delete",
    RESTORE = "restore",
    LOGIN = "login",
    LOGOUT = "logout"
}
