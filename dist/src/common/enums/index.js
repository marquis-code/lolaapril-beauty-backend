"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogStatus = exports.ContentBlockType = exports.AuditAction = exports.FormFieldType = exports.ProgramStatus = exports.PublicationStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["ADMIN"] = "admin";
    UserRole["EDITOR"] = "editor";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var PublicationStatus;
(function (PublicationStatus) {
    PublicationStatus["DRAFT"] = "draft";
    PublicationStatus["PENDING_REVIEW"] = "pending_review";
    PublicationStatus["APPROVED"] = "approved";
    PublicationStatus["REJECTED"] = "rejected";
    PublicationStatus["PUBLISHED"] = "published";
})(PublicationStatus = exports.PublicationStatus || (exports.PublicationStatus = {}));
var ProgramStatus;
(function (ProgramStatus) {
    ProgramStatus["DRAFT"] = "draft";
    ProgramStatus["ACTIVE"] = "active";
    ProgramStatus["INACTIVE"] = "inactive";
    ProgramStatus["ARCHIVED"] = "archived";
})(ProgramStatus = exports.ProgramStatus || (exports.ProgramStatus = {}));
var FormFieldType;
(function (FormFieldType) {
    FormFieldType["TEXT"] = "text";
    FormFieldType["EMAIL"] = "email";
    FormFieldType["NUMBER"] = "number";
    FormFieldType["TEXTAREA"] = "textarea";
    FormFieldType["SELECT"] = "select";
    FormFieldType["RADIO"] = "radio";
    FormFieldType["CHECKBOX"] = "checkbox";
    FormFieldType["DATE"] = "date";
    FormFieldType["FILE"] = "file";
})(FormFieldType = exports.FormFieldType || (exports.FormFieldType = {}));
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "create";
    AuditAction["UPDATE"] = "update";
    AuditAction["DELETE"] = "delete";
    AuditAction["SOFT_DELETE"] = "soft_delete";
    AuditAction["HARD_DELETE"] = "hard_delete";
    AuditAction["RESTORE"] = "restore";
    AuditAction["LOGIN"] = "login";
    AuditAction["LOGOUT"] = "logout";
})(AuditAction = exports.AuditAction || (exports.AuditAction = {}));
var ContentBlockType;
(function (ContentBlockType) {
    ContentBlockType["PARAGRAPH"] = "paragraph";
    ContentBlockType["HEADING_1"] = "heading1";
    ContentBlockType["HEADING_2"] = "heading2";
    ContentBlockType["HEADING_3"] = "heading3";
    ContentBlockType["QUOTE"] = "quote";
    ContentBlockType["CODE"] = "code";
    ContentBlockType["IMAGE"] = "image";
    ContentBlockType["VIDEO"] = "video";
    ContentBlockType["AUDIO"] = "audio";
    ContentBlockType["EMBED"] = "embed";
    ContentBlockType["DIVIDER"] = "divider";
    ContentBlockType["LIST_ORDERED"] = "orderedList";
    ContentBlockType["LIST_UNORDERED"] = "unorderedList";
    ContentBlockType["TABLE"] = "table";
    ContentBlockType["CALLOUT"] = "callout";
    ContentBlockType["TOGGLE"] = "toggle";
    ContentBlockType["GALLERY"] = "gallery";
})(ContentBlockType = exports.ContentBlockType || (exports.ContentBlockType = {}));
var BlogStatus;
(function (BlogStatus) {
    BlogStatus["DRAFT"] = "draft";
    BlogStatus["PUBLISHED"] = "published";
    BlogStatus["SCHEDULED"] = "scheduled";
    BlogStatus["ARCHIVED"] = "archived";
    BlogStatus["PRIVATE"] = "private";
})(BlogStatus = exports.BlogStatus || (exports.BlogStatus = {}));
//# sourceMappingURL=index.js.map