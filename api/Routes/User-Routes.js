const express= require('express')
const userControllers=require('../Controllers/User-Controllers')

const router = express.Router();

router.post("/register",userControllers.Register)
router.post("/login",userControllers.Login)
router.post("/logout",userControllers.Logout)
router.get('/users',userControllers.Users)
router.get("/:userId",userControllers.Messages)
router.get("/",userControllers.Profile)



module.exports = router