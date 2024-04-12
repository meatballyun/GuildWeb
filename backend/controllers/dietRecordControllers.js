const DietRecord = require('../models/dietRecordModel.js');
const Recipe = require('../models/recipeModel.js');

const UserInfoController = require('./userinfoControllers');
const userInfoController = new UserInfoController();
const updateUserExp = userInfoController.updateUserExp;

class DietRecordController {
    async addDietRecord(req, res) {
        try {
            const CREATOR = req.session.passport.user;
            const query = await DietRecord.addDietRecord(CREATOR, req.body.date, req.body.category, req.body.recipe, req.body.amount);
            if (query?.length) {
                await updateUserExp(1, CREATOR);
                res.status(200).json({ 
                    success: true,
                    message: "Data uploaded successfully.",
                    data : {
                        id: 2
                    } 
                });
            } else{
                res.status(404).json({
                    success: false,
                    message: "The requested resource to delete was not found.",
                    data: "Not Found"
                })
            }
            
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
                data: "Bad Request"
            });
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
                        carbs: 320,
                        pro: 60,
                        fats: 55,
                        kcal: 2000,
                    },
                    foods: dietRecords,
                }

                res.status(200).json({ 
                    success: true,
                    message: "Data retrieval successful.",
                    data : data 
                });
                
            } else {
                const data = {
                    target: {
                      carbs: 320,
                      pro: 60,
                      fats: 55,
                      kcal: 2000,
                    },
                    foods: [],
                };

                res.status(200).json({ 
                    success: true,
                    message: "Data retrieval successful.",
                    data : data 
                });
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
                data: "Bad Request"
            });
        }
    }

    async deleteDietRecord(req, res) {
        try {
            const query = await DietRecord.deleteDietRecord(req.params.id);            
            if (query?.length) {
                res.status(200).json({
                    success: true,
                    message: "The data with the specified object ID has been successfully deleted.",
                    data: "OK"
                });
            } else{
                res.status(404).json({
                    success: false,
                    message: "The requested resource to delete was not found.",
                    data: "Not Found"
                })
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Bad Request: The request to delete the data was invalid.",
                data: "Bad Request"
            });
        }
    }

}

module.exports = DietRecordController;