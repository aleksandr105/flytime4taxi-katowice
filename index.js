import { getFlyData, getTimeForRequest, sortData, getLandingsPerHour } from './healpers/index.js';

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

  const landingsPerHour = getLandingsPerHour(sortedData);
  console.log(landingsPerHour);

  const murkup = sortedData
    .map(({ airline_name, airline_logo, airport, status }, idx) => {
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

      //   if (idx === 0) {
      //     const timeMatch = status.match(/\b(\d{2}):(\d{2})\b/)[1];

      //     return `
      //   <tr>
      //   <td>От ${timeMatch}:00</td>
      //   <td>до ${(Number(timeMatch) + 1).toString().padStart(2, '0')}:00</td>
      //   <td>${landingsPerHour[timeMatch]} прилет</td>
      //   </tr>
      // <tr class=${backgroundStatus}>
      //   <td class="td-flight-status">${status}</td>
      //   <td><img class="td-flight-logo" src="${airline_logo}" alt="${airline_name} logo"></td>
      //   <td class="td-flight-airport">${airport}</td>
      // </tr>`;
      //   }

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
