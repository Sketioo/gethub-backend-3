const { verifyAccessToken, getUserId } = require("../helpers/utility");
const models = require('../models')

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      error_code: 401,
      message: "Kredential tidak sah!",
    });
  }

  const result = await verifyAccessToken(token);

  if (!result.success) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Kredential tidak sah!",
        error_code: 401,
      });
  }

  req.data = result.token;
  next();
};


const checkPortfolio = async (req, res, next) => {
  try {

    const {user_id} = getUserId(req);

    const project_id = req.body.project_id;
    const project = await models.Project.findByPk(project_id);
    console.log(project.category_id)
    const project_category_id = project.category_id;

    const hasMatchingProduct = await models.Product.findOne({
      where: {
        user_id,
        category_id: project_category_id
      }
    });

    const hasMatchingCertification = await models.Certification.findOne({
      where: {
        user_id,
        category_id: project_category_id
      }
    });

    if (!hasMatchingProduct && !hasMatchingCertification) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki portofolio yang sesuai dengan kategori proyek ini",
        error_code: 403,
      });
    }

    next();
  } catch (error) {
    console.error("Kesalahan dalam pemeriksaan portofolio:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

module.exports = checkPortfolio;


const verifyUserMiddleware = async (req, res, next) => {
  try {
    const { user_id } = getUserId(req);
    const user = await models.User.findByPk(user_id);
    
    if (!user || !user.is_verify || !user.is_complete_profile) {
      return res.status(403).json({
        success: false,
        message: "Pengguna belum diverifikasi atau profil pengguna belum lengkap",
        error_code: 403,
      });
    }
    
    next();
  } catch (error) {
    console.error("Terjadi kesalahan saat memverifikasi pengguna:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal memverifikasi pengguna",
      error_code: 500,
    });
  }
};


module.exports = {
  authenticateToken,
  verifyUserMiddleware,
  checkPortfolio
};
