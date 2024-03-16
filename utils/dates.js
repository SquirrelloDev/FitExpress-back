export const isWeekend = (date) => {
  const dateObj = new Date(date);
  const weekDay= dateObj.getDay();
  return (weekDay === 0 || weekDay === 6);
}
export const getNextDayMidnight = (date) => {
  const currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() + 1)
  // currentDate.setHours(1,0,0, 0);
  return currentDate
}
export const parseIntoMidnightISO = (date) => {
  const dateObj = new Date(date);
  const midnight = dateObj.setHours(1,0,0,0);
  return new Date(midnight).toISOString();
}