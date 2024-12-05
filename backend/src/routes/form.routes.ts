import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerMiddleware";
import { resizeImage } from "../middlewares/resizeMiddleware";
import { createForm, getForm } from "../controllers/formController";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  upload.single("thumbnail"),
  resizeImage,
  createForm
);

router.get("/get/:formId", authMiddleware, getForm);

export default router;
