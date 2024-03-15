import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import logger from 'morgan'
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors'
import {config} from "dotenv";
import { usersRouter } from './routes/users.js'
import {promocodesRouter} from "./routes/promocodes.js";
import {addressesRouter} from "./routes/addresses.js";
import {exclusionsRouter} from "./routes/exclusions.js";
import {mealTagsRouter} from "./routes/mealTags.js";
import {mealsRouter} from "./routes/meals.js";
import {dietsRouter} from "./routes/diets.js";
import {dietDaysRouter} from "./routes/dietDays.js";
import {ordersRouter} from "./routes/orders.js";
import {reportsRouter} from "./routes/reports.js";
import {entriesRouter} from "./routes/progressEntries.js";
import {deliveryRouter} from "./routes/deliverPoints.js";
import {dailyRouter} from "./routes/dailyOrders.js";
import {errorMiddleware} from "./middleware/errorMiddleware.js";
import {paymentsRouter} from "./routes/payments.js";
import {fulfill} from "./controllers/paymentController.js";
import {webpushRouter} from "./routes/webpush.js";
import setupCronJobs from './utils/cronSetup.js'
import {ensureDirectoryExists} from "./utils/directory.js";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
config({ path: './config/.env'});
const app = express();
app.use(logger('dev'));
app.use(cors())
app.post('/webhook', bodyParser.raw({type: 'application/json'}) ,fulfill)
app.use(bodyParser.json())
mongoose.connect(process.env.MONGO_ATLAS).then(con => {
    console.log('Conncted to the db')
})

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    //przesyłamy te headery dalej
    next();
})
ensureDirectoryExists('./public')
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/address', addressesRouter);
app.use('/promocode', promocodesRouter);
app.use('/exclusions', exclusionsRouter);
app.use('/tags', mealTagsRouter);
app.use('/meals', mealsRouter);
app.use('/diets', dietsRouter);
app.use('/days', dietDaysRouter);
app.use('/orders', ordersRouter);
app.use('/reports', reportsRouter);
app.use('/entries', entriesRouter);
app.use('/delivery', deliveryRouter);
app.use('/daily', dailyRouter);
app.use('/payments', paymentsRouter);
app.use('/push', webpushRouter)
setupCronJobs();
//error middleware
app.use(errorMiddleware)
app.listen(process.env.PORT || 3001)
