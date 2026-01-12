"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportController = void 0;
const common_1 = require("@nestjs/common");
const support_service_1 = require("./support.service");
const create_ticket_dto_1 = require("./dto/create-ticket.dto");
const auth_1 = require("../auth");
let SupportController = class SupportController {
    constructor(supportService) {
        this.supportService = supportService;
    }
    createTicket(createDto) {
        return this.supportService.createTicket(createDto);
    }
    getTicket(id) {
        return this.supportService.getTicket(id);
    }
    getTickets(filter) {
        return this.supportService.getTickets(filter);
    }
    updateStatus(id, body) {
        return this.supportService.updateTicketStatus(id, body.status, body.userId);
    }
    assignTicket(id, agentId) {
        return this.supportService.assignTicket(id, agentId);
    }
    addMessage(id, messageData) {
        return this.supportService.addMessage(id, messageData);
    }
    getMessages(id, includeInternal) {
        return this.supportService.getMessages(id, includeInternal);
    }
    getStats(businessId) {
        return this.supportService.getTicketStats(businessId);
    }
    makeCall(id, body) {
        return this.supportService.makeCall(id, body.phoneNumber, body.agentId);
    }
    sendSMS(id, body) {
        return this.supportService.sendSMS(id, body.phoneNumber, body.message);
    }
};
__decorate([
    (0, common_1.Post)('tickets'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ticket_dto_1.CreateTicketDto]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "createTicket", null);
__decorate([
    (0, common_1.Get)('tickets/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "getTicket", null);
__decorate([
    (0, common_1.Get)('tickets'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "getTickets", null);
__decorate([
    (0, common_1.Put)('tickets/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)('tickets/:id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "assignTicket", null);
__decorate([
    (0, common_1.Post)('tickets/:id/messages'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "addMessage", null);
__decorate([
    (0, common_1.Get)('tickets/:id/messages'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('includeInternal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "getMessages", null);
__decorate([
    (0, auth_1.ValidateBusiness)(),
    (0, common_1.Get)('stats'),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('tickets/:id/call'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "makeCall", null);
__decorate([
    (0, common_1.Post)('tickets/:id/sms'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "sendSMS", null);
SupportController = __decorate([
    (0, common_1.Controller)('support'),
    __metadata("design:paramtypes", [support_service_1.SupportService])
], SupportController);
exports.SupportController = SupportController;
//# sourceMappingURL=support.controller.js.map