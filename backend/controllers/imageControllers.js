const fs = require('fs');
const path = require('path');

class ImageController {
    async saveImage(req, res) {
        try {
            const imageUrl = req.body.image;
            const filename = `${Date.now()}.jpg`;
            const path = `/uploads/image/${req.body.type}/${filename}`;
            await fs.writeFile(`C:/Users/Rex/Desktop/GuildWeb/frontend/public${path}`, imageUrl.split(';base64,').pop(), { encoding: 'base64' },(err)=>{console.log(err)});
            res.status(200).json({ imageUrl: path });

        } catch (err) {
            res.status(500).json({
                message: err
            });
        }
    }
    
}

module.exports = ImageController;