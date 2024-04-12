const fs = require('fs');
const path = require('path');

class ImageController {
    async saveImage(req, res) {
        try {
            const imageUrl = req.body.image;
            const filename = `${Date.now()}.jpg`;
            const path = `/uploads/image/${req.body.type}/${filename}`;
            await fs.writeFile(`C:/Users/Rex/Desktop/GuildWeb/frontend/public${path}`, imageUrl.split(';base64,').pop(), { encoding: 'base64' },(err)=>{console.log(err)});
            res.status(200).json({
                success: true,
                message: "Image uploaded successfully.",
                data: { 
                    imageUrl: path,
                },
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: "Bad Request: The server cannot process the image upload request.",
                data: "Bad Request"
            });
        }
    }
    
}

module.exports = ImageController;