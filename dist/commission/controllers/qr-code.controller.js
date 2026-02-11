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
exports.QRCodeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const QRCode = require("qrcode");
let QRCodeController = class QRCodeController {
    async generateQRCode(code, res) {
        try {
            const trackingUrl = `${process.env.APP_URL}/book?track=${code}`;
            const qrCodeBuffer = await QRCode.toBuffer(trackingUrl, {
                type: 'png',
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Disposition', `inline; filename="${code}.png"`);
            res.send(qrCodeBuffer);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
                message: 'Failed to generate QR code'
            });
        }
    }
    async downloadQRCode(code, res) {
        try {
            const trackingUrl = `${process.env.APP_URL}/book?track=${code}`;
            const qrCodeBuffer = await QRCode.toBuffer(trackingUrl, {
                type: 'png',
                width: 600,
                margin: 2
            });
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Disposition', `attachment; filename="${code}-qr.png"`);
            res.send(qrCodeBuffer);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
                message: 'Failed to download QR code'
            });
        }
    }
};
__decorate([
    (0, common_1.Get)(':code'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate QR code image' }),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QRCodeController.prototype, "generateQRCode", null);
__decorate([
    (0, common_1.Get)(':code/download'),
    (0, swagger_1.ApiOperation)({ summary: 'Download QR code image' }),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QRCodeController.prototype, "downloadQRCode", null);
QRCodeController = __decorate([
    (0, swagger_1.ApiTags)('QR Code'),
    (0, common_1.Controller)('qr')
], QRCodeController);
exports.QRCodeController = QRCodeController;
//# sourceMappingURL=qr-code.controller.js.map