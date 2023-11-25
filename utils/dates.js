export const isWeekend = (date) => {
  const dateObj = new Date(date);
  const weekDay= dateObj.getDay();
  return (weekDay === 0 || weekDay === 6);
}
export const getNextDayMidnight = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1)
  currentDate.setHours(1,0,0, 0);
  return currentDate
}