import express from "express";

const router = express.Router();

router.post("/signup", (req, res) => {
  try {
    const { name, email, password } = req.body;
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  }
});
router.post("/signin", (req, res) => {});
router.get("/courses", (req, res) => {

});
export default router;
