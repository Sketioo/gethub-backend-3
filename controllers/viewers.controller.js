const { getUserIdByUsername, getUserId } = require("../helpers/utility");
const models = require("../models");


const createCardView = async (req, res) => {
    try {
        const {user_id} = getUserId(req);
        const view_user_id = user_id;
        const profile_user_id = await getUserIdByUsername(req.body.username);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (view_user_id === profile_user_id) {
            return res.status(400).json({
                success: false,
                message: 'Anda melihat profil sendiri, analitik tidak dihitung',
                error_code: 0
            });
        }

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
        const profile_user_id = await getUserIdByUsername(req.body.username);
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
        
        if (formattedData.length === 0) {
            return res.status(200).json({
                success: true,
                data: formattedData,
                message: 'Tidak ada card viewers',
                error_code: 0
            });
        }

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

const getTotalAnalytics = async (req, res) => {
    try {
        const { user_id } = getUserId(req);

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'Kredential tidak valid',
                error_code: 400
            });
        }

        const total_card_viewers = await models.Card_Viewers.count({
            where: { profile_user_id: user_id },
            distinct: true,
            col: 'view_user_id'
        });

        const total_web_viewers = await models.Web_Viewers.count({
            where: { profile_user_id: user_id },
            distinct: true,
            col: 'ip'
        });

        const total_partner = await models.Partner.count({
            where: { user_id : user_id },
            distinct: true,
        });

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

const getGraphData = async (req, res) => {
    try {
        const { user_id } = getUserId(req);

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'Kredential tidak valid',
                error_code: 400
            });
        }

        const nowDate = new Date();
        // nowDate.setHours(0, 0, 0, 0);
        const backDate = new Date(nowDate);
        backDate.setDate(backDate.getDate() - 10);

        const cardViewers = await models.Card_Viewers.findAll({
            where: {
                profile_user_id: user_id,
                date: {
                    [models.Sequelize.Op.between]: [backDate, nowDate]
                }
            },
            attributes: [
                [models.Sequelize.fn('DATE', models.Sequelize.col('date')), 'date'],
                [models.Sequelize.fn('COUNT', models.Sequelize.col('view_user_id')), 'total_views']
            ],
            group: ['date']
        });

        const webViewers = await models.Web_Viewers.findAll({
            where: {
                profile_user_id: user_id,
                date: {
                    [models.Sequelize.Op.between]: [backDate, nowDate]
                }
            },
            attributes: [
                [models.Sequelize.fn('DATE', models.Sequelize.col('date')), 'date'],
                [models.Sequelize.fn('COUNT', models.Sequelize.col('ip')), 'total_views']
            ],
            group: ['date']
        });

        const totalViewsByDate = {};

        cardViewers.forEach(view => {
            const date = view.getDataValue('date');
            const totalViews = view.getDataValue('total_views');
            totalViewsByDate[date] = (totalViewsByDate[date] || 0) + parseInt(totalViews);
        });

        webViewers.forEach(view => {
            const date = view.getDataValue('date');
            const totalViews = view.getDataValue('total_views');
            totalViewsByDate[date] = (totalViewsByDate[date] || 0) + parseInt(totalViews);
        });

        const graphData = [];
        for (let i = 0; i <= 10; i++) {
            const date = new Date(backDate);
            date.setDate(backDate.getDate() + i);
            const formattedDate = date.toISOString().split('T')[0];
            graphData.push({
                date: formattedDate,
                total_views: totalViewsByDate[formattedDate] || 0
            });
        }

        return res.status(200).json({
            success: true,
            data: graphData,
            message: 'Berhasil mengambil data grafik',
            error_code: 0
        });
    } catch (error) {
        console.error('Error mengambil graph data:', error);
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
    getCardViewers,
    getGraphData};