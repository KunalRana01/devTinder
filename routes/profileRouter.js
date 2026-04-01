const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/auth");

router.get("/profile", authenticateUser, async (req, res) => {

    try {
        const user = req.user;
        return res.send(user);
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }

})


module.exports = router;
