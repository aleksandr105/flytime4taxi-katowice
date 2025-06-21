const getFlyData = async (date, time_from, time_to) => {
  return await fetch(
    `https://www.katowice-airport.com/pl/api/flight-board/list?direction=2&date=${date}&time_from=${time_from}&time_to=${time_to}`
  )
    .then(data => data.json())
    .then(data => data)
    .catch(err => {
      console.error('Ошибка при загрузке данных:', err);
    });
};

const getTime = () => {
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

const createMurkup = async () => {
  const { data } = await getFlyData(...getTime());
  console.log(data);
  if (!data) return;

  const murkup = data
    .map(({ airline_name, airline_logo, airport, status }) => {
      if (status === '') return '';

      let backgroundStatus = 'tr-flight';

      switch (status.includes('WYLĄDOWAŁ') ? 'WYLĄDOWAŁ' : status) {
        case 'WYLĄDOWAŁ':
          backgroundStatus = 'plane-landed';
          break;
        case 'OPÓŹNIONY':
          backgroundStatus = 'delayed-landed';
          break;
        default:
          backgroundStatus = 'tr-flight';
      }

      return `
    <tr class=${backgroundStatus}>
      <td class="td-flight-status">${status}</td>
      <td><img class="td-flight-logo" src="${airline_logo}" alt="${airline_name} logo"></td>
      <td class="td-flight-airport">${airport}</td>
    </tr>`;
    })
    .join('');
  const listRef = document.querySelector('.table-tbody');
  listRef.innerHTML = murkup;
};
createMurkup();

setInterval(() => {
  createMurkup();
}, 1 * 60 * 1000);
