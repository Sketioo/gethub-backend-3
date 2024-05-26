// bikin variable untuk image nya 
// 3 image 

const models = require("../models")

const getPublicUser = async (req, res) => {
    console.log('triggered')
    try {
    // mendapatkan username dari query
      const username = req.query.username;
    // mencari user berdasarkan username
      const user = await models.User.findOne({
        where: { username: username },
        include: [
          { model: models.Link, as: "Links" },
          { model: models.Product, as: "Products" },
        ],
      });

    // jika tidak ditemukan user
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Pengguna tidak ditemukan",
          error_code: 404,
        });
      }
    // setelah mendapatkan usernamenya, mencari data user berdasarkan id
      const publicUserData = await models.User.findByPk(user.id, {
        include: [models.Product, models.Link]
      })
  
    // menghilangkan data yang tidak perlu
      const { Products, Links, password, role_id, updatedAt, createdAt, ...otherData } = publicUserData.dataValues;
  
      const userData = {
        ...otherData,
        products: Products,
        links: Links
      }
  
      return res.status(200).json({
        success: true,
        data: userData,
        message: "Data publik pengguna berhasil diambil",
      });
    } catch (error) {
  
      console.error("Error mengambil data pengguna:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan!",
        error_code: 500,
      });
    }
  };

  module.exports = { 
    getPublicUser
  } 