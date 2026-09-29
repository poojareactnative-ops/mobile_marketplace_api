"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepairStatus = exports.ApplicationStatus = exports.UserStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SYSTEM_USER"] = "SYSTEM_USER";
    UserRole["SUPER_SELLER"] = "SUPER_SELLER";
    UserRole["SELLER_ADMIN"] = "SELLER_ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    UserStatus["APPROVED"] = "APPROVED";
    UserStatus["REJECTED"] = "REJECTED";
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["SUSPENDED"] = "SUSPENDED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["PENDING"] = "PENDING";
    ApplicationStatus["APPROVED"] = "APPROVED";
    ApplicationStatus["REJECTED"] = "REJECTED";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
var RepairStatus;
(function (RepairStatus) {
    RepairStatus["SUBMITTED"] = "SUBMITTED";
    RepairStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    RepairStatus["QUOTED"] = "QUOTED";
    RepairStatus["APPROVED"] = "APPROVED";
    RepairStatus["IN_PROGRESS"] = "IN_PROGRESS";
    RepairStatus["READY"] = "READY";
    RepairStatus["COMPLETED"] = "COMPLETED";
    RepairStatus["CANCELLED"] = "CANCELLED";
    RepairStatus["NOT_REPAIRABLE"] = "NOT_REPAIRABLE";
})(RepairStatus || (exports.RepairStatus = RepairStatus = {}));
