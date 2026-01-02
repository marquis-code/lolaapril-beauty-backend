// ============================================================================
// 7. QR CODE CONTROLLER
// src/commission/controllers/qr-code.controller.ts
// ============================================================================

import { Controller, Get, Param, Res } from '@nestjs/common'
import { Response } from 'express'
import * as QRCode from 'qrcode'

@Controller('qr')
export class QRCodeController {
  @Get(':code')
  async generateQRCode(
    @Param('code') code: string,
    @Res() res: Response
  ) {
    try {
      const trackingUrl = `${process.env.APP_URL}/book?track=${code}`
      
      const qrCodeBuffer = await QRCode.toBuffer(trackingUrl, {
        type: 'png',
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      res.setHeader('Content-Type', 'image/png')
      res.setHeader('Content-Disposition', `inline; filename="${code}.png"`)
      res.send(qrCodeBuffer)
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to generate QR code'
      })
    }
  }

  @Get(':code/download')
  async downloadQRCode(
    @Param('code') code: string,
    @Res() res: Response
  ) {
    try {
      const trackingUrl = `${process.env.APP_URL}/book?track=${code}`
      
      const qrCodeBuffer = await QRCode.toBuffer(trackingUrl, {
        type: 'png',
        width: 600,
        margin: 2
      })

      res.setHeader('Content-Type', 'image/png')
      res.setHeader('Content-Disposition', `attachment; filename="${code}-qr.png"`)
      res.send(qrCodeBuffer)
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to download QR code'
      })
    }
  }
}
