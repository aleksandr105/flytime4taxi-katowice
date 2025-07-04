import { getFlyData, getTimeForRequest, sortData } from './healpers/index.js';

const createMurkup = async () => {
  const requestPromises = getTimeForRequest().map(data => getFlyData(data));

  const data = await Promise.all(requestPromises)
    .then(responses => responses.flat())
    .catch(err => {
      console.error('Ошибка при загрузке данных:', err);
    });

  if (!data) return;

  const allData = data.flatMap(item => item?.data || []);

  const sortedData = sortData(allData);

  const murkup = sortedData
    .map(({ airline_name, airline_logo, airport, status }) => {
      if (status === '') return '';

      let backgroundStatus = 'tr-flight';

      if (status.includes('WYLĄDOWAŁ')) {
        backgroundStatus = 'plane-landed';
      } else if (status.includes('OPÓŹNIONY')) {
        backgroundStatus = 'delayed-landed';
      } else if (status.includes('PRZEKIEROWANY')) {
        backgroundStatus = 'redirected-flight';
      } else if (status.includes('ODWOŁANY')) {
        backgroundStatus = 'canceled-flight';
      } else {
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
