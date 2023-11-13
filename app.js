import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import logger from 'morgan'
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors'
import multer from 'multer'
import { usersRouter } from './routes/users.js'
import {promocodesRouter} from "./routes/promocodes.js";
import {addressesRouter} from "./routes/addresses.js";
import {exclusionsRouter} from "./routes/exclusions.js";
import {mealTagsRouter} from "./routes/mealTags.js";
import {mealsRouter} from "./routes/meals.js";
import {dietsRouter} from "./routes/diets.js";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express();
app.use(logger('dev'));
app.use(cors())
app.use(bodyParser.json())
mongoose.connect('mongodb+srv://fit-express_admin:bo7OfYFhDuH6vR1I@mycluster.tw0suos.mongodb.net/fit_express' ).then(con => {
    console.log('Conncted to the db')
})

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    //przesyłamy te headery dalej
    next();
})
app.use('/public/images',express.static(path.join(__dirname, '/public/images')));

app.use('/users', usersRouter);
app.use('/address', addressesRouter);
app.use('/promocode', promocodesRouter);
app.use('/exclusions', exclusionsRouter);
app.use('/tags', mealTagsRouter);
app.use('/meals', mealsRouter);
app.use('/diets', dietsRouter);
app.listen(3001)
