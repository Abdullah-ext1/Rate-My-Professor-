import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { verifyJwt } from "../middlewares/verifyJwt.js"
import { verifyAdmin } from "../middlewares/verifyAdmin.js"
import { verifyModerator } from "../middlewares/verifyModerator.js"
import { bannedUser, changeAccountDetails, getCurrentUser, logOutUser, onboardingAuth, suspendUser, checkUsernameAvailability, approvePendingUser, rejectPendingUser, getPendingUsers, revokeModerator, getAllModerators } from "../controller/auth.controller.js";

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
    res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    res.redirect("https://campus-three-black.vercel.app/")
  },
)

router.get("/me", verifyJwt, getCurrentUser)
router.get("/check-username", checkUsernameAvailability)
router.put("/onboarding", verifyJwt, onboardingAuth)
router.put("/profile", verifyJwt, changeAccountDetails)
router.post("/logout", verifyJwt, logOutUser)
router.post("/ban/:id", verifyJwt, verifyAdmin, bannedUser)
router.post("/suspend/:id", verifyJwt, verifyModerator, suspendUser)
router.put("/approve/:userId", verifyJwt, verifyModerator, approvePendingUser)
router.put("/reject/:userId", verifyJwt, verifyModerator, rejectPendingUser)
router.get("/pending-users", verifyJwt, verifyModerator, getPendingUsers)
router.get("/moderators", verifyJwt, verifyAdmin, getAllModerators)
router.put("/revoke-moderator/:userId", verifyJwt, verifyAdmin, revokeModerator)

export default router;