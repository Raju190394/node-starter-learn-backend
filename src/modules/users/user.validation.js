import { z } from 'zod';

/**
 * Middleware that validates `req.body` against a Zod schema.
 * On validation failure it sends a consistent JSON payload:
 * {
 *   success: false,
 *   message: 'Invalid input',
 *   details: [{ path: ['field'], message: 'error text' }, ...]
 * }
 */
export const validateBody = (schema) => async (req, res, next) => {
  try {
    // `parseAsync` supports async refinements as well as sync ones.
    await schema.parseAsync(req.body);
    next();
  } catch (err) {
    const messages = err.errors?.map(e => e.message) ?? [err.message];
    const details = err.errors?.map(e => ({
      path: e.path,
      message: e.message,
    })) || [];
    // If no Zod errors, fallback to generic message
    if (messages.length === 0) {
      res.status(400).json({
        success: false,
        message: err.message || 'Invalid input',
        details: [],
      });
      return;
    }
    const combinedMessage = messages.join('; ');
    res.status(400).json({
      success: false,
      message: combinedMessage,
      details,
    });
  }
};

// ---------- Create User Schema ----------
export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name is required' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .trim()
    .min(6, { message: 'Password must be at least 6 characters' })
    .refine((val) => /[a-zA-Z]/.test(val) && /\d/.test(val), {
      message: 'Password must contain both letters and numbers',
    }),
  phone: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"])
}).strict();

// ---------- Update User Schema (all fields optional) ----------
export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name cannot be empty' })
    .optional(),
  email: z
    .string()
    .trim()
    .email({ message: 'Invalid email address' })
    .optional(),
  password: z
    .string()
    .trim()
    .min(6, { message: 'Password must be at least 6 characters' })
    .refine((val) => /[a-zA-Z]/.test(val) && /\d/.test(val), {
      message: 'Password must contain both letters and numbers',
    })
    .optional(),
  phone: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"])
}).strict();