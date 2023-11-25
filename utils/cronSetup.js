import cron from "node-cron";
import {initDay} from "./daysSetup.js";
import {lockAddingOrders} from "../controllers/dailyOrdersController.js";
const setupCronJobs = () => {
  cron.schedule("*/2 * * * *", () => {
      lockAddingOrders();
      initDay();
      console.log('Day initialized!')
  })
}
export default setupCronJobs