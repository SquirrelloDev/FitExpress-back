import express from "express";
// const express = require('express');
import {
    getAllUsers,
    addNewUser,
    logInUser,
    updateUserData,
    updateUserHealthcard, deleteUser
} from "../controllers/userController.js";
import isAuth from "../middleware/isAuth.js";
const router = express.Router();
/* GET users listing. */
router.get('/', isAuth, getAllUsers);
router.post('/', addNewUser);
router.post('/login', logInUser);
router.put("/:id", isAuth, updateUserData);
router.patch('/hcard', isAuth, updateUserHealthcard);
router.delete('/:id', isAuth, deleteUser);

export {router as usersRouter}
