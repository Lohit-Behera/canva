import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerMiddleware";
import { resizeImage } from "../middlewares/resizeMiddleware";
import {
  createForm,
  getForm,
  getAllForms,
  deleteForm,
} from "../controllers/formController";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  upload.single("thumbnail"),
  resizeImage,
  createForm
);

router.get("/get/:formId", authMiddleware, getForm);

router.get("/all", authMiddleware, getAllForms);

router.delete("/delete/:formId", authMiddleware, deleteForm);

export default router;
