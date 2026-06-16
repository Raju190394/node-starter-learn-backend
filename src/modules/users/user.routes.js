import express from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from './user.controller.js';
import { validateBody, createUserSchema, updateUserSchema } from './user.validation.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', validateBody(createUserSchema), createUser);
router.put('/:id', validateBody(updateUserSchema), updateUser);
router.patch('/delete/:id', deleteUser);

export default router;