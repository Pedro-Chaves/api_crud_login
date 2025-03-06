const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const AdminAuth = require("../middlewares/AdminAuth");

router.route("/user")
    .get(AdminAuth, UserController.getUsers)
    .put(AdminAuth, UserController.update);

router.route("/user/:id")
    .get(AdminAuth, UserController.getUserById)
    .delete(AdminAuth, UserController.delete);

router.post("/user/validate_admin", AdminAuth, UserController.validateAdmin);

router.post("/user/create", UserController.create);
router.post("/user/login", UserController.login);
router.post("/user/password_recover", UserController.passwordRecover);
router.post("/user/change_password", UserController.changePassword);

module.exports = router;