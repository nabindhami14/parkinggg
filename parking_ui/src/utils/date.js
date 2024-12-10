export const toLocalISOString = (date) => {
  const tzoffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = new Date(date.getTime() - tzoffset).toISOString();

  return localISOTime;
};
