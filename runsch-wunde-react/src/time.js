export const msToHMS = (ms) => {
  const totalS = Math.round(ms / 1000);
  const s = (totalS % 60).toString().padStart(2, '0');
  const totalM = Math.floor(totalS / 60);
  const intM = totalM % 60;
  const intH = Math.floor(totalM / 60);
  return intH === 0
    ? `${intM}:${s}`
    : `${intH}:${intM.toString().padStart(2, '0')}:${s}`;
};
