const fs = require('fs');
const path = require('path');

class ImageController {
    async saveImage(req, type) {
        try {
            const imageUrl = req.body.imageUrl;
            const filename = type + '-' + req.body.id + '.png';
            const path = `/uploads/image/${type}/${filename}`;
            await fs.writeFile(`C:/Users/Rex/Desktop/GuildWeb/frontend/public${path}`, imageUrl.split(';base64,').pop(), { encoding: 'base64' },(err)=>{console.log(err)});
            return path;

        } catch (err) {
            console.log('saveImage Error!!!', err);
        }
    }
    
}

module.exports = ImageController;