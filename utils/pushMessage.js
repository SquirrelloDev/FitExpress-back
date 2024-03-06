import webpush from "web-push";
import Webpush from "../models/webpushModel.js";

export const hCardPayload = JSON.stringify({
    title: 'Nawodniony?',
    options: {
        body: 'Pochwal się, ile wody wypiłeś w tym dniu'
    }
})
export const mealSelectionPayload = JSON.stringify({
    title: 'Sprawdź posiłki',
    options: {
        body: 'Sprawdź posiłki na następny dzień'
    }
})
export const morningReminder = JSON.stringify({
    title: 'Czas na śniadanie!',
    options: {
        body: 'Śniadanie to podstawa każdego dnia'
    }
})
export const lunchReminder = JSON.stringify({
    title: 'Czas na lunch!',
    options: {
        body: 'Zrób sobie przerwę na lunch'
    }
})
export const dinnerReminder = JSON.stringify({
    title: 'Czas na obiad!',
    options: {
        body: 'Największy i najbardziej wartościowy posiłek'
    }
})
export const teatimeReminder = JSON.stringify({
    title: 'Pora na podwieczorek!',
    options: {
        body: 'Czas na przekąskę'
    }
})
export const supperReminder = JSON.stringify({
    title: 'Czas na kolację!',
    options: {
        body: 'To już ostatni posiłek na dzisiaj'
    }
})


export const sendNotification = async (payloadData) => {
    const allSubs = await Webpush.find({});
    const options = {
        vapidDetails: {
            subject: 'mailto:push@fitexpress.com',
            publicKey: process.env.VAPID_PUB,
            privateKey: process.env.VAPID_SEC
        }
    }
    allSubs.forEach(sub => {
        webpush.sendNotification(sub, payloadData, options);
    });
}