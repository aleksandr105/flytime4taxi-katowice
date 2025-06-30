import { getFlyData, getTimeForRequest, sortData } from './healpers/index.js';

const createMurkup = async () => {
  const requestPromises = getTimeForRequest().map(data => getFlyData(data));

  const data = await Promise.all(requestPromises)
    .then(responses => responses.flat())
    .catch(err => {
      console.error('Ошибка при загрузке данных:', err);
    });

  if (!data) return;

  const [{ data: prevData = [] }, { data: nextData = [] }] = data;
  const allData = [...prevData, ...nextData];

  const sortedData = sortData(allData);

  const murkup = sortedData
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
