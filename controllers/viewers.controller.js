const { getUserIdByUsername, getUserId } = require("../helpers/utility");
const models = require("../models");


const createCardView = async (req, res) => {
    try {
        const {user_id} = getUserId(req);
        const view_user_id = user_id;
        const profile_user_id = await getUserIdByUsername(req.body.username);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingView = await models.Card_Viewers.findOne({
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
        
        const cardViewers = await models.Card_Viewers.create({
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

const createWebView = async (req, res) => {
    try {
        const { profile_user_id } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingView = await models.Web_Viewers.findOne({
            where: {
                profile_user_id,
                ip,
                date: today
            }
        });

        if (!profile_user_id) {
            return res.status(400).json({
              success: false,
              message: 'profile_user_id diperlukan',
              error_code: 400
            });
          }

        if (existingView) {
            return res.status(200).json({
                success: true,
                data: existingView,
                message: 'Web viewers sudah melihat hari ini',
                error_code: 0
            });
        }
        
        const webViewers = await models.Web_Viewers.create({
            profile_user_id,
            ip,
            date: today
        });

        return res.status(201).json({
            success: true,
            data: webViewers,
            message: 'Data web viewers berhasil disimpan',
            error_code: 0
        });

    } catch(error){
        console.error('Error membuat web view:', error);
        return res.status(500).json({
            success: false,
            message: 'Kesalahan internal server',
            error_code: 500
        });
    }
}


const getTotalAnalytics = async (req, res) => {
    try {
        const { user_id } = getUserId(req);
        const total_card_viewers = 0;
        const total_web_viewers = 10;
        const total_partner = 1;

        return res.status(200).json({
            success: true,
            data: {
                total_card_viewers,
                total_web_viewers,
                total_partner
            },
            message: 'Berhasil mengambil total analytics',
            error_code: 0
        });


    } catch(error){
        console.error('Error mengambil total analytics:', error);
        return res.status(500).json({
            success: false,
            message: 'Kesalahan internal server',
            error_code: 500
        });
    }
}

const getCardViewers = async (req,res) => {
    try{
        const { user_id } = getUserId(req);

        if (!user_id) {
            return res.status(400).json({
              success: false,
              message: 'Kredential tidak valid',
              error_code: 400
            });
        }

        const cardViewers = await models.Card_Viewers.findAll({
            where: { profile_user_id: user_id },
            include: [
                { 
                    model : models.User, 
                    as:'viewUser', 
                    foreignKey: 'viewers_user_id', // Join dengan tabel User berdasarkan 'viewers_user_id'
                    attributes: ['full_name', 'photo', 'profession', 'username','email'] // Hanya menampilkan kolom ini di tabel User
                }
            ],
            attributes: ['view_user_id'] // Hanya menampilkan kolom ini di tabel Card_Viewers
        });

        const formattedData = cardViewers.map(viewer => {
            return {
                viewUserId: viewer.view_user_id,
                fullName: viewer.viewUser.full_name,
                photo: viewer.viewUser.photo,
                profession: viewer.viewUser.profession,
                username: viewer.viewUser.username,
                email: viewer.viewUser.email
            };
        });
        

        return res.status(200).json({
            success: true,
            data: formattedData,
            message: 'Berhasil mengambil card viewers',
            error_code: 0
        });

    } catch (error){
        console.error('Error mengambil card viewers:', error);
        return res.status(500).json({
            success: false,
            message: 'Kesalahan internal server',
            error_code: 500
        });
    }
}


module.exports = { 
    createCardView, 
    createWebView, 
    getTotalAnalytics,
    getCardViewers };