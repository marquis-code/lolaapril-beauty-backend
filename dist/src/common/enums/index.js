"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditAction = exports.FormFieldType = exports.BlogStatus = exports.ProgramStatus = exports.PublicationStatus = exports.UserRole = void 0;
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
var BlogStatus;
(function (BlogStatus) {
    BlogStatus["DRAFT"] = "draft";
    BlogStatus["PUBLISHED"] = "published";
    BlogStatus["ARCHIVED"] = "archived";
})(BlogStatus = exports.BlogStatus || (exports.BlogStatus = {}));
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
//# sourceMappingURL=index.js.map