const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} tidak boleh memasukan HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

//* User
exports.userRegisterSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  full_name: Joi.string().required(),
  username: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(20),
  profession: Joi.string().allow("").optional(),
  phone: Joi.string()
    .allow("")
    .pattern(/^\d{10,15}$/)
    .optional(),
  web: Joi.string().allow("").optional(),
  address: Joi.string().allow("").optional(),
  photo: Joi.string().allow("").optional(),
  about: Joi.string().allow("").optional(),
  qr_code: Joi.string().allow("").optional(),
  is_verify: Joi.boolean().optional(),
  is_complete_profile: Joi.boolean().optional(),
  is_premium: Joi.boolean().optional(),
  is_verif_ktp: Joi.boolean().optional(),
  is_verif_ktp_url: Joi.string().allow("").optional(),
  theme_hub: Joi.number().integer().optional(),
  role_id: Joi.string().guid({ version: "uuidv4" }).optional(),
  sentiment_owner_analisis: Joi.string().allow("").optional(),
  sentiment_owner_score: Joi.number().optional(),
  sentiment_freelance_analisis: Joi.string().allow("").optional(),
  sentiment_freelance_score: Joi.number().optional(),
});

exports.userLoginSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  full_name: Joi.string().optional(),
  username: Joi.string().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  profession: Joi.string().allow("").optional(),
  phone: Joi.string()
    .allow("")
    .pattern(/^\d{10,15}$/)
    .optional(),
  web: Joi.string().allow("").optional(),
  address: Joi.string().allow("").optional(),
  photo: Joi.string().allow("").optional(),
  about: Joi.string().allow("").optional(),
  qr_code: Joi.string().allow("").optional(),
  is_verify: Joi.boolean().optional(),
  is_complete_profile: Joi.boolean().optional(),
  is_verif_ktp: Joi.boolean().optional(),
  is_verif_ktp_url: Joi.string().allow("").optional(),
  is_premium: Joi.boolean().optional(),
  theme_hub: Joi.number().integer().optional(),
});

//* Complete Profile
exports.userUpdateSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  full_name: Joi.string().optional(),
  profession: Joi.string().allow("").required(),
  phone: Joi.string()
    .allow("")
    .pattern(/^\d{10,15}$/)
    .required(),
  email: Joi.string().email().optional(),
  web: Joi.string().uri().allow("").optional(),
  address: Joi.string().allow("").required(),
  photo: Joi.string().allow("").required(),
  about: Joi.string().allow("").optional(),
  theme_hub: Joi.number().integer().optional(),
})

//*Product

exports.productSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  user_id: Joi.string().guid({ version: "uuidv4" }).optional(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  category_id: Joi.string().required(),
  image_url: Joi.string().uri().required(),

});

//* Link

exports.linkSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  user_id: Joi.string().guid({ version: "uuidv4" }).allow(null).optional(),
  category: Joi.string().required(),
  link: Joi.string().uri().required(),

});

//* History Upload

exports.historyUploadSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  user_id: Joi.string().guid({ version: "uuidv4" }).required(),
  link: Joi.string().optional(),
  extension: Joi.string().optional(),
});

//* Sponsor

exports.sponsorSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  name: Joi.string().required(),
  image_url: Joi.string().uri().required(),
  link: Joi.string().uri().required(),
  is_active: Joi.boolean().required(),
})

//* Information
exports.informationSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  image_url: Joi.string().required(),
  category: Joi.string().required(),
  is_active: Joi.boolean().required()
});

//* Partner

exports.partnerSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  user_id: Joi.string().guid({ version: "uuidv4" }).optional(),
  ref_user_id: Joi.string().optional(),
  full_name: Joi.string().optional(),
  qr_code: Joi.string().optional(),
  profession: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  photo: Joi.string().optional(),
  address: Joi.string().optional(),
  website: Joi.string().allow("").uri().optional(),
  image: Joi.string().optional(),
});

//* Certification

exports.certificationSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  title: Joi.string().required(),
  category_id: Joi.string().required(),
  image: Joi.string().required(),
})

//* Category

exports.categorySchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  name: Joi.string().required(),
})

//* Project

exports.projectSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  owner_id: Joi.string().guid({ version: "uuidv4" }).optional(),
  title: Joi.string().required(),
  category_id: Joi.string().guid({ version: "uuidv4" }).required(),
  description: Joi.string().allow(null).optional(),
  min_budget: Joi.number().required(),
  max_budget: Joi.number().required(),
  min_deadline: Joi.date().required(),
  max_deadline: Joi.date().required(),
  created_date: Joi.date().allow(null).optional(),
  chatroom_id: Joi.string().optional(),
  is_active: Joi.boolean().optional(),
  banned_message: Joi.string().allow(null).optional(),
  status_project: Joi.string().valid('OPEN', 'BID', 'CLOSE', 'FINISHED').optional(),
  status_freelance_task: Joi.string().valid('OPEN', 'CLOSE').optional(),
  status_payment: Joi.string().valid('WAITING', 'SETTLEMENT').optional(),
  fee_owner_transaction_persen: Joi.number().allow(null).optional(),
  fee_owner_transaction_value: Joi.number().allow(null).optional(),
  fee_freelance_transaction_persen: Joi.number().allow(null).optional(),
  fee_freelance_transaction_value: Joi.number().allow(null).optional(),
});

//* Project Task
exports.projectTaskSchema = Joi.object({
  id: Joi.string().uuid({ version: 'uuidv4' }).optional(),
  project_id: Joi.string().uuid({ version: 'uuidv4' }).optional(),
  task_number: Joi.number().integer().required(),
  task_description: Joi.string().required(),
  task_status: Joi.string().valid('ON-PROGRESS', 'REVIEW', 'REVISION', 'DONE').optional(),
  task_feedback: Joi.string().allow('').optional(),
}).options({ stripUnknown: true });

//* Project User Bid

exports.projectUserBidSchema = Joi.object({
  id: Joi.string().uuid({ version: 'uuidv4' }).optional(),
  project_id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  budget_bid: Joi.number().required(),
  message: Joi.string().allow('').optional(),
}).options({ stripUnknown: true });

//* Project Review
exports.projectReviewSchema = Joi.object({
  id: Joi.string().uuid({ version: 'uuidv4' }).optional(),
  project_id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  owner_id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  freelance_id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  message: Joi.string().required(),
  sentiment: Joi.string().required(),
  sentiment_score: Joi.number().required(),
}).options({ stripUnknown: true });

//* Project Review Freelance 

exports.projectReviewFreelanceSchema = Joi.object({
  id: Joi.string().uuid({ version: 'uuidv4' }).optional(),
  project_id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  owner_id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  freelance_id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  message: Joi.string().required(),
  sentiment: Joi.string().required(),
  sentiment_score: Joi.number().required(),
}).options({ stripUnknown: true });