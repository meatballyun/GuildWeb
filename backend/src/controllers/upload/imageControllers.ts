// @ts-nocheck
import fs from 'fs';
import { ApplicationError } from '../../utils/error/applicationError';

const UPLOAD_PATH =
  process.env.NODE_ENV === 'development'
    ? process.env.TEST_UPLOAD_PATH
    : process.env.PI_SERVICE_URL;

const MaxFileSizeMB = 5;
class ImageController {
  async saveImage(req, res, next) {
    const imageUrl = req.body.image;
    const fileSizeMB = Buffer.byteLength(imageUrl, 'base64') / (1024 * 1024);
    if (fileSizeMB > MaxFileSizeMB) throw new ApplicationError(413);

    if (!imageUrl || !imageUrl.startsWith('data:image')) throw new ApplicationError(415);
    const imageFormatMatch = imageUrl.match(/^data:image\/(\w+);base64,/);
    if (!imageFormatMatch) throw new ApplicationError(415);

    const imageFormat = imageFormatMatch[1].toLowerCase();
    const supportedFormats = ['jpeg', 'jpg', 'png', 'gif'];
    if (!supportedFormats.includes(imageFormat)) throw new ApplicationError(415);

    const filename = `${Date.now()}.${imageFormat}`;
    const path = `/uploads/image/${req.body.type}/${filename}`;
    try {
      await fs.promises.writeFile(`public${path}`, imageUrl.split(';base64,').pop(), {
        encoding: 'base64',
      });
      await fs.promises.chmod(`public${path}`, 0o644);
      return res.status(200).json({ data: { imageUrl: `${UPLOAD_PATH}${path}` } });
    } catch (err) {
      throw new ApplicationError(500, err);
    }
  }
}

export default ImageController;
