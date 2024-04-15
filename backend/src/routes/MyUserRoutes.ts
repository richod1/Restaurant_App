import express from "express";
import UserController from "../controllers/UserController"
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();

// /api/my/user
router.get("/", jwtCheck, jwtParse, UserController.getCurrentUser);
router.post("/", jwtCheck, UserController.createCurrentUser);
router.put(
    "/",
    jwtCheck,
    jwtParse,
    validateMyUserRequest,
    UserController.udateCurrentUser
);

export default router;