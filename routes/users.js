import express from "express";
// const express = require('express');
import {
    getAllUsers,
    addNewUser,
    logInUser,
    updateUserData,
    updateUserHealthcard, deleteUser
} from "../controllers/userController.js";
const router = express.Router();
/* GET users listing. */
router.get('/', getAllUsers);
router.post('/', addNewUser);
router.post('/login', logInUser);
router.put("/:id", updateUserData);
router.patch('/hcard', updateUserHealthcard);
router.delete('/:id', deleteUser);

export {router as usersRouter}
