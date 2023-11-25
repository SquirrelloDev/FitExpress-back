export const isWeekend = (date) => {
  const dateObj = new Date(date);
  const weekDay= dateObj.getDay();
  return (weekDay === 0 || weekDay === 6);
}