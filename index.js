import { getFlyData, getTime } from './healpers/index.js';

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
