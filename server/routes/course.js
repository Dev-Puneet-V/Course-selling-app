import express from "express";
import { auth, isAdmin } from "../utils/middleware.js";
const router = express.Router();
router.post("/", auth, isAdmin, (req, res) => {});
router.delete("/:courseId", auth, isAdmin, (req, res) => {});
router.put("/:courseId", auth, isAdmin, (req, res) => {});

router.put(
  "/:courseId/remove-content/:contentId",
  auth,
  isAdmin,
  (req, res) => {}
);
router.put(
  "/:courseId/update-content/:contentId",
  auth,
  isAdmin,
  (req, res) => {}
);

router.get("/:courseId/content", auth, (req, res) => {});
export default router;
