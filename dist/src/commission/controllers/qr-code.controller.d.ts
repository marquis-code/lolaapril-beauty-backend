import { Response } from 'express';
export declare class QRCodeController {
    generateQRCode(code: string, res: Response): Promise<void>;
    downloadQRCode(code: string, res: Response): Promise<void>;
}
