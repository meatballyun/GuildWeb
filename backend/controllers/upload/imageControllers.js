const fs = require('fs');
const ApplicationError = require('../../utils/error/applicationError.js');
const path = require('path');

IMAGE_UPLOAD_PATH = process.env.NODE_ENV === 'development' ? process.env.IMAGE_UPLOAD_PATH1 : process.env.IMAGE_UPLOAD_PATH2;


class ImageController {
    async saveImage(req, res) {
        try {
            const imageUrl = req.body.image;
            const filename = `${Date.now()}.jpg`;
            const path = `/uploads/image/${req.body.type}/${filename}`;
            await fs.writeFile(`${IMAGE_UPLOAD_PATH}${path}`, imageUrl.split(';base64,').pop(), { encoding: 'base64' },(err)=>{console.log(err)});
            res.status(200).json({
                success: true,
                message: "Image uploaded successfully.",
                data: { 
                    imageUrl: path,
                },
            });
        } catch (err) {
            return next(new ApplicationError(400, err));

        }
    }
    
}

module.exports = ImageController;