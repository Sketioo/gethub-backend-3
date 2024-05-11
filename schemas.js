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
  theme_hub: Joi.number().integer().optional(),
});

exports.userLoginSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  full_name: Joi.string(),
  username: Joi.string(),
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
  is_premium: Joi.boolean().optional(),
  theme_hub: Joi.number().integer().optional(),
});

//*Product

exports.productSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  user_id: Joi.string().guid({ version: "uuidv4" }).required(),
  name: Joi.string().required(),
  price: Joi.string().required(),
  description: Joi.string().required(),
  image_url: Joi.string().uri().required(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
});

//* Link

exports.linkSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  user_id: Joi.string().guid({ version: "uuidv4" }).allow(null).optional(),
  category: Joi.string().required(),
  link: Joi.string().uri().required(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
});

//* History Upload

exports.historyUploadSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  user_id: Joi.string().guid({ version: "uuidv4" }).required(),
  link: Joi.string().optional(),
  extension: Joi.string().optional(),
  date: Joi.date().optional(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
});

//* Sponsor

exports.sponsorSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  name: Joi.string().required(),
  image_url: Joi.string().uri().required(),
  link: Joi.string().uri().required(),
  is_active: Joi.boolean().required(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
})

//* Information
exports.informationSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  is_active: Joi.boolean().required()
});