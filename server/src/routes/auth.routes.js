import { Router } from "express"; 
import passport from "passport";
import jwt from "jsonwebtoken";
import {verifyJwt} from "../middlewares/verifyJwt.js"
import { onboardingAuth } from "../controller/auth.controller.js";

const router = Router();

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}))

router.get("/google/callback", passport.authenticate("google", {session: false}),
  (req, res) => {
    const token = jwt.sign(
      {id: req.user.id},
      process.env.JWT_SECRET,
      { expiresIn: "7d"},
    )
    res.cookie("accessToken", token,{httpOnly: true})
    // res.redirect("http://localhost:5173")
    res.json({sucess: true, user: req.user})
  },
)

router.put("/onboarding", verifyJwt, onboardingAuth)

export default router;