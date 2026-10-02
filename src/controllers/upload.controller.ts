import { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse';

export class UploadController {
  static async presignUploadUrl(req: Request, res: Response) {
    const { filename, filetype } = req.body;
    const key = `uploads/${Date.now()}-${filename || 'image.png'}`;
    const uploadUrl = `https://storage.googleapis.com/mobile_marketplace_api-storage/${key}`;
    const publicUrl = `https://storage.googleapis.com/mobile_marketplace_api-storage/${key}`;

    return sendSuccess(res, {
      uploadUrl,
      publicUrl,
      key,
      expiresInSeconds: 900,
    });
  }
}
