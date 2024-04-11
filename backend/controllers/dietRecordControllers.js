const DietRecord = require('../models/dietRecordModel.js');
const Recipe = require('../models/recipeModel.js');

const UserInfoController = require('./userinfoControllers');
const userInfoController = new UserInfoController();
const updateUserExp = userInfoController.updateUserExp;

class DietRecordController {
    async addDietRecord(req, res) {
        try {
            const CREATOR = req.session.passport.user;
            await DietRecord.addDietRecord(CREATOR, req.body.date, req.body.category, req.body.recipe, req.body.amount);
            
            return res.status(200).json({ data : 'ok' });
        } catch (error) {
            console.error(error);
            console.log('addDietRecord Error!!!');
        }
    }
    
    async getDietRecord(req, res) {
        try {
            const CREATOR = req.session.passport.user;  
            const query = await DietRecord.getDietRecord(CREATOR, req.query.date);
            if(query?.length){
                const dietRecords = await Promise.all(query.map(async (rows) => {
                    const [ row ] = await Recipe.getRecipesById(rows.RECIPES);
                    const recipe = {
                        id: row.ID,
                        name: row.NAME,
                        carbs: row.CARBS,
                        pro: row.PRO,
                        fats: row.FATS,
                        kcal: row.KCAL,
                        unit: row.UNIT,
                        imageUrl: row.IMAGE_URL,
                    };
                    return {
                        id: rows.ID,
                        amount: rows.AMOUNT,                        
                        category: rows.CATEGORY,
                        recipe: recipe,
                    };
                }));
                const data = {
                    target: {
                        carbs: 155,
                        pro: 183,
                        fats: 53,
                        kcal: 2000,
                    },
                    imageUrl: '',
                    foods: dietRecords,
                }

                return res.status(200).json({ data : data });
                
            } else {
                const data = {
                    target: {
                      carbs: 155,
                      pro: 183,
                      fats: 53,
                      kcal: 2000,
                    },
                    imageUrl: '',
                    foods: [],
                    carbs: 0,
                    pro: 0,
                    fats: 0,
                    kcal: 0,
                };

                return res.status(200).json({ data : data });
            }
        } catch (error) {
            console.error(error);
            console.log('getDietRecord Error!!!');
        }
    }

    async deleteDietRecord(req, res) {
        try {
            await DietRecord.deleteDietRecord(req.params.id);            
            return res.status(200).json({ data : 'ok' });
        } catch (error) {
            console.error(error);
            console.log('addDietRecord Error!!!');
        }
    }

}

module.exports = DietRecordController;