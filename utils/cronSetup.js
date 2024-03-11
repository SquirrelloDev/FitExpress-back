import cron from "node-cron";
import {initDay} from "./daysSetup.js";
import {lockAddingOrders} from "../controllers/dailyOrdersController.js";
import {deactivateOrders} from "../controllers/ordersController.js";
import {
    dinnerReminder,
    hCardPayload,
    lunchReminder,
    mealSelectionPayload,
    morningReminder,
    sendNotification, supperReminder, teatimeReminder
} from "./pushMessage.js";
const setupCronJobs = () => {
  cron.schedule("58 23 * * *", () => {
      lockAddingOrders();
      initDay();
  });
  cron.schedule("55 23 * * *", () => {
      deactivateOrders()
  });
//   WEBPUSH
    cron.schedule("0 15 * * *", () => {
        sendNotification(hCardPayload)
    })
    cron.schedule("0 22 * * *", () => {
        sendNotification(mealSelectionPayload)
    })
//     WBPUSH-MEALS
    cron.schedule("0 8 * * *", ()=>{
        sendNotification(morningReminder)
    })
    cron.schedule("0 11 * * *", ()=>{
        sendNotification(lunchReminder)
    })
    cron.schedule("0 14 * * *", ()=>{
        sendNotification(dinnerReminder)
    })
    cron.schedule("0 17 * * *", ()=>{
        sendNotification(teatimeReminder)
    })
    cron.schedule("0 20 * * *", ()=>{
        sendNotification(supperReminder)
    })
}
export default setupCronJobs