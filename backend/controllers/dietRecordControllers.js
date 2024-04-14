const DietRecord = require('../models/dietRecordModel.js');
const Recipe = require('../models/recipeModel.js');
const User = require('../models/userModel');

const UserInfoController = require('./userinfoControllers');
const userInfoController = new UserInfoController();
const updateUserExp = userInfoController.updateUserExp;

class DietRecordController {
    async addDietRecord(req, res) {
        try {
            const CREATOR = req.session.passport.user;
            const query = await DietRecord.addDietRecord(CREATOR, req.body.date, req.body.category, req.body.recipe, req.body.amount);
            if (query.affectedRows) {
                await updateUserExp(1, CREATOR);
                return res.status(200).json({ 
                    success: true,
                    message: "Data uploaded successfully.",
                    data : {
                        id: 2
                    } 
                });
            } else{
                return res.status(404).json({
                    success: false,
                    message: "The requested resource to delete was not found.",
                    data: "Not Found"
                })
            }
            
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
                data: "Bad Request"
            });
        }
    }
    
    async getDietRecord(req, res) {
        try {
            const CREATOR = req.session.passport.user;
            const [ userinfo ] = await User.getUserById(CREATOR);
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
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
                data: "Bad Request"
            });
        }
    }

    async deleteDietRecord(req, res) {
        try {
            const query = await DietRecord.deleteDietRecord(req.params.id);            
            if (query.changedRows) {
                return res.status(200).json({
                    success: true,
                    message: "The data with the specified object ID has been successfully deleted.",
                    data: "OK"
                });
            } else{
                return res.status(404).json({
                    success: false,
                    message: "The requested resource to delete was not found.",
                    data: "Not Found"
                })
            }
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Bad Request: The request to delete the data was invalid.",
                data: "Bad Request"
            });
        }
    }

}

module.exports = DietRecordController;