const fs = require('fs');
const ApplicationError = require('../../utils/error/applicationError.js');
const path = require('path');

class ImageController {
    async saveImage(req, res, next) {
        try {
            const imageUrl = req.body.image;
            const maxFileSizeMB = 5;
            const fileSizeMB = Buffer.byteLength(imageUrl, 'base64') / (1024 * 1024);
            if (fileSizeMB > maxFileSizeMB) {
                return res.status(413).json({
                    success: false,
                    message: `File size exceeds the limit of ${maxFileSizeMB} MB.`,
                    data: "Payload Too Large"
                });
            }

            if (!imageUrl || !imageUrl.startsWith('data:image')) {
                return next(new ApplicationError(415));
            }
            const imageFormatMatch = imageUrl.match(/^data:image\/(\w+);base64,/);
            if (!imageFormatMatch) {
                return next(new ApplicationError(415));
            }            
            const imageFormat = imageFormatMatch[1].toLowerCase();
            const supportedFormats = ['jpeg', 'jpg', 'png', 'gif'];
            if (!supportedFormats.includes(imageFormat)) {
                throw new Error('Unsupported image format.');
            }

            const filename = `${Date.now()}.${imageFormat}`;
            const path = `uploads/image/${req.body.type}/${filename}`;
            await fs.writeFile(`public/${path}`, imageUrl.split(';base64,').pop(), { encoding: 'base64' },(err)=>{console.log(err)});
            return res.status(200).json({
                success: true,
                message: "Image uploaded successfully.",
                data: { 
                    imageUrl: `${process.env.UPLOAD_PATH}${path}`,
                },
            });
        } catch (err) {
            return next(new ApplicationError(400, err));
        }
    }

    async deleteImage(req, res, next) {
        try {            
            const localImagePath = path.join('public', req.params.url.replace(process.env.UPLOAD_PATH, ''));
            await fs.access(localImagePath);
            await fs.unlink(localImagePath);
            return res.status(200).json({
                success: true,
                message: "Image delete successfully.",
                data: "OK",
            });
        } catch (err) {
            return next(new ApplicationError(400, err));
        }
    }
    
}

module.exports = ImageController;