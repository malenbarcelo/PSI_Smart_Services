const {addFormsData} = require('../functions/addFormsData')

const cronController = {
    getFormsData: async(req,res) => {
        try {

            //ADD GOOGLE SHEETS DATA
            await addFormsData()

        }catch (error) {
             console.log(error)
        }
    }
}

module.exports = cronController

