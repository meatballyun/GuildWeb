import fs from 'fs';
import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { ApplicationError } from '../../utils/error/applicationError';
import { FE_URL } from '../../config';

const MaxFileSizeMB = 5;
export const saveImage = async (req: TypedRequest, res: Response, next: NextFunction) => {
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
    await fs.promises.writeFile(`src/public${path}`, imageUrl.split(';base64,').pop(), {
      encoding: 'base64',
    });
    await fs.promises.chmod(`src/public${path}`, 0o644);
    return res.status(200).json({ data: { imageUrl: `${FE_URL}${path}` } });
  } catch (err) {
    throw new ApplicationError(500, err as string);
  }
};
