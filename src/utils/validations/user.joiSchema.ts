import Joi from 'joi'

const userJoiSchema = Joi.object({
  username: Joi.string().min(6).max(30).required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .regex(/[a-zA-Z0-9]{3,30}/)
    .required(),
  email: Joi.string().email().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  created: Joi.date(),
})

export default userJoiSchema
