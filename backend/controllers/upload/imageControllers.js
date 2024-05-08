const fs = require('fs');
const ApplicationError = require('../../utils/error/applicationError.js');
const path = require('path');
const UPLOAD_PATH = process.env.NODE_ENV === 'development' ? process.env.TEST_UPLOAD_PATH : API_SERVICE_URL;


const MaxFileSizeMB = 5;
class ImageController {
  async saveImage(req, res, next) {
    const imageUrl = req.body.image;
    const fileSizeMB = Buffer.byteLength(imageUrl, 'base64') / (1024 * 1024);
    if (fileSizeMB > MaxFileSizeMB) return next(new ApplicationError(413));
  
    if (!imageUrl || !imageUrl.startsWith('data:image')) return next(new ApplicationError(415));
    const imageFormatMatch = imageUrl.match(/^data:image\/(\w+);base64,/);
    if (!imageFormatMatch) return next(new ApplicationError(415));
    const imageFormat = imageFormatMatch[1].toLowerCase();
    const supportedFormats = ['jpeg', 'jpg', 'png', 'gif'];
    if (!supportedFormats.includes(imageFormat)) return next(new ApplicationError(415));
      
    const filename = `${Date.now()}.${imageFormat}`;
    const path = `/uploads/image/${req.body.type}/${filename}`;
    try {
      await fs.promises.writeFile(`public${path}`, imageUrl.split(';base64,').pop(), { encoding: 'base64' });  
      await fs.promises.chmod(`public${path}`, 0o644);  
      return res.status(200).json({ data: { imageUrl: `${UPLOAD_PATH}${path}` } });
    } catch (err) {
      return next(new ApplicationError(500, err));
    }
  }
}

module.exports = ImageController;
