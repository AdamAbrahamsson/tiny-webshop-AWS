import { Router } from 'express';
import { registerUser, loginUser, deleteUser } from '../controllers/authController';
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// Register a new user
router.post('/register', registerUser);

// Login an existing user
router.post('/login', loginUser);

// delete a user
router.delete("/me",authMiddleware, deleteUser);

export default router;
