const DietRecord = require('../../models/dietRecordModel.js');
const Recipe = require('../../models/recipeModel.js');
const User = require('../../models/userModel.js');

const userInfoController = new (require('../user/userinfoControllers.js'))();
const updateUserExp = userInfoController.updateUserExp;
const ApplicationError = require('../../utils/error/applicationError.js');

class DietRecordController {    
    async getDietRecords(req, res, next) {
        try {
            const [ userinfo ] = await User.getUserById(req.session.passport.user);
            const query = await DietRecord.getDietRecord(req.session.passport.user, req.query.date);
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
                        carbs: userinfo.CARBS,
                        pro: userinfo.PRO,
                        fats: userinfo.FATS,
                        kcal: userinfo.KCAL,
                    },
                    foods: dietRecords,
                }

                return res.status(200).json({ 
                    success: true,
                    message: "Data retrieval successful.",
                    data : data 
                });
                
            } else {
                const data = {
                    target: {
                        carbs: userinfo.CARBS,
                        pro: userinfo.PRO,
                        fats: userinfo.FATS,
                        kcal: userinfo.KCAL,
                    },
                    foods: [],
                };

                return res.status(200).json({ 
                    success: true,
                    message: "Data retrieval successful.",
                    data : data 
                });
            }
        } catch (err) {
            return next(new ApplicationError(400, err))
        }
    }

    async addDietRecord(req, res, next) {
        try {
            const query = await DietRecord.addDietRecord(req.session.passport.user, req.body.date, req.body.category, req.body.recipe, req.body.amount);
            if (query.affectedRows) {
                await updateUserExp(1, req.session.passport.user);
                return res.status(200).json({ 
                    success: true,
                    message: "Data uploaded successfully.",
                    data : {
                        id: 2
                    } 
                });
            } else{
                return next(new ApplicationError(404))
            }
            
        } catch (err) {
            return next(new ApplicationError(400, err))
        }
    }

    async deleteDietRecord(req, res, next) {
        try {
            const query = await DietRecord.deleteDietRecord(req.params.id);            
            if (query.changedRows) {
                return res.status(200).json({
                    success: true,
                    message: "The data with the specified object ID has been successfully deleted.",
                    data: "OK"
                });
            } else{
                return next(new ApplicationError(404))
            }
        } catch (error) {
            return next(new ApplicationError(400, err))
        }
    }

}

module.exports = DietRecordController;