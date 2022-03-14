const { Router } = require("express")
const { signupGet, signupPost, loginGet, loginPost, logoutGet } = require("../controllers/authControllers")

const router = Router()

router.get("/signup", signupGet)
router.post("/signup", signupPost)
router.get("/login", loginGet)
router.post("/login", loginPost)
router.get("/logout", logoutGet)


module.exports = router