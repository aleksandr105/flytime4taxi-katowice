export const getFlyData = async (date, time_from, time_to) => {
  return await fetch(
    `https://www.katowice-airport.com/pl/api/flight-board/list?direction=2&date=${date}&time_from=${time_from}&time_to=${time_to}`
  )
    .then(data => data.json())
    .then(data => data)
    .catch(err => {
      console.error('Ошибка при загрузке данных:', err);
    });
};

export const getTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const hours = date.getHours() === 0 ? '23' : (date.getHours() - 1).toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const dateFiltered = `${year}-${month}-${day}`;
  const time_from = `${hours}:${minutes}`;
  const timeTo = `23:59`;
  return [dateFiltered, time_from, timeTo];
};
