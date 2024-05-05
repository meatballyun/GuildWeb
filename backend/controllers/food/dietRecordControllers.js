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

            // 命名 query 真的不好理解，可以改命名 dietRecords 之類的嗎？
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
                        // 建議可以裝一下 Code Spell Checker 的套件，userinfo 會被標上藍線，你就會注意到可能要改成 userInfo 了
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
            const [getRecipe] = await Recipe.getRecipesById(req.body.recipe);
            if (!getRecipe) return next(new ApplicationError(409));
            else if (getRecipe.CREATOR !== req.session.passport.user) return next(new ApplicationError(403));
            const query = await DietRecord.addDietRecord(req.session.passport.user, req.body.date, req.body.category, req.body.recipe, req.body.amount);
            if (query.affectedRows) {
                await updateUserExp(1, req.session.passport.user);
                return res.status(200).json({ 
                    success: true,
                    message: "Data uploaded successfully.",
                    data : "OK"
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