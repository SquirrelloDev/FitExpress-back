const degToRadians = (degAngle) => {
    return degAngle * (Math.PI / 180);
}
const getDistanceFromCoords = (userLat, userLng, deliveryLat, deliveryLng) => {
    const R = 6371;
    const dLat = degToRadians(deliveryLat - userLat);
    const dLng = degToRadians(deliveryLng - userLng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(degToRadians(userLat)) * Math.cos(degToRadians(deliveryLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
}
export default getDistanceFromCoords