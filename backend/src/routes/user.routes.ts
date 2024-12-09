import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerMiddleware";
import { resizeImage } from "../middlewares/resizeMiddleware";
import {
  userRegister,
  userLogin,
  userLogout,
  userDetails,
  googleAuth,
} from "../controllers/userController";

const router = Router();

// Public routes
router.post("/register", upload.single("avatar"), resizeImage, userRegister);
router.post("/login", userLogin);
router.post("/auth/google", googleAuth);

// Protected routes
router.get("/logout", authMiddleware, userLogout);
router.get("/details", authMiddleware, userDetails);

export default router;
