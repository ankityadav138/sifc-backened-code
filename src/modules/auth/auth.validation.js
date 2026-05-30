const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(3),

  email: z.string().email(),

  phone: z.string().min(10),

  password: z.string().min(6),

  role: z.enum([
    "SUPER_ADMIN",
    "MANAGER",
    "TELECALLER",
    "HR"
  ])
});

module.exports = {
  registerSchema
};