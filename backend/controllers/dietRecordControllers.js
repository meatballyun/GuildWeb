const DietRecord = require('../models/dietRecordModel.js');

const UserInfoController = require('./userinfoControllers');
const userInfoController = new UserInfoController();
const updateUserExp = userInfoController.updateUserExp;

class DietRecordController {
    async addDietRecord(req, res) {
        try {
            const CREATOR = req.session.passport.user;
            await DietRecord.addDietRecord(CREATOR, req.body.dietDate, req.body.category, req.body.recipe, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal, req.body.count);
            
            return res.status(200).json({ data : 'ok' });
        } catch (error) {
            console.error(error);
            console.log('addDietRecord Error!!!');
        }
    }

    async getDietRecord(req, res) {
        try {
            const CREATOR = req.session.passport.user;      
            const dietRecords = await DietRecord.getDietRecord(CREATOR, req.query.q);
            if(!dietRecords?.length){
                const data = {
                    target: {
                      carbs: 155,
                      pro: 183,
                      fats: 53,
                      kcal: 2000,
                    },
                    imageUrl: 'https://images.plurk.com/7bNYY08ndWsLYQSHRORr8H.jpg',
                    foods: {},
                    carbs: 0,
                    pro: 0,
                    fats: 0,
                    kcal: 0,
                };

                return res.status(200).json({ data : data });
            };

            // const data = records.map(row => ({
            //     id: row.ID,
            //     name: row.NAME,
            //     description: row.DESCRIPTION,                
            //     carbs: row.CARBS,
            //     pro: row.PRO,
            //     fats: row.FATS,
            //     kcal: row.KCAL,
            //     unit: row.UNIT,
            //     imageUrl: row.IMAGE_URL
            // }));
            if (data) {
                return res.status(200).json({ data : data });
            }
        } catch (error) {
            console.error(error);
            console.log('getDietRecord Error!!!');
        }
    }

}

module.exports = DietRecordController;