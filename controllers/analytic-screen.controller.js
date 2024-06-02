const { getUserIdByUsername, getUserId } = require("../helpers/utility");
const models = require("../models");


const createCardView = async (req, res) => {
    try {
        const {user_id} = getUserId(req);
        const view_user_id = user_id;
        const profile_user_id = await getUserIdByUsername(req.body.username);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingView = await models.Analytic_Screen.findOne({
            where: {
                profile_user_id,
                view_user_id,
                date: today
            }
        });

        if (existingView) {
            return res.status(200).json({
                success: true,
                data: existingView,
                message: 'Card viewers sudah melihat hari ini',
                error_code: 0
            });
        }
        
        const cardViewers = await models.Analytic_Screen.create({
            profile_user_id,
            view_user_id,
            date: today
        });

        return res.status(201).json({
            success: true,
            data: cardViewers,
            message: 'Data card viewers berhasil disimpan',
            error_code: 0
        });

    } catch(error){
        console.error('Error membuat card view:', error);
        return res.status(500).json({
            success: false,
            message: 'Kesalahan internal server',
            error_code: 500
        });
    }
} 

module.exports = { createCardView };