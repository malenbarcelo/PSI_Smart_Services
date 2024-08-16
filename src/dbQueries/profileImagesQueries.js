const db = require('../../database/models')
const { Op } = require('sequelize')
const model = db.Profile_images

const profileImagesQueries = {
    findImage: async(dni) => {
        const findImage = await model.findOne({
            where:{
                dni:dni,
            }
        })
        return findImage
    }
}

module.exports = profileImagesQueries