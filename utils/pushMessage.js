import webpush from "web-push";


export const sendNotification = (subscriptions, payloadData) => {
    const options = {
        vapidDetails: {
            subject: 'mailto:push@fitexpress.com',
            publicKey: process.env.VAPID_PUB,
            privateKey: process.env.VAPID_SEC
        }
    }
    subscriptions.forEach(sub => {
        webpush.sendNotification(sub, payloadData, options);
    });
}