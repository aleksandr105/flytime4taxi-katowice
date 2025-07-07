import { getTranslate } from './translation.js';
import { getLandingsPerHour, getDate } from './healpers/index.js';

export const getCurrentArrivalsMarkup = sortedData => {
  const tableBodyMarcup = sortedData
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

  return `<section class="fly">
          <div class="container">
            <div class="fly-container">
              <table class="flight-table">
                <thead class="table-head">
                  <tr>
                    <th class="table-head-status">${getTranslate('status')}</th>
                    <th class="th-awialine">${getTranslate('airline_name')}</th>
                    <th class="table-head-airport">${getTranslate('airport')}</th>
                  </tr>
                </thead>
                <tbody class="table-tbody">${tableBodyMarcup}</tbody>
              </table>
            </div>
          </div>
        </section>`;
};

export const arrivalsByHourMarkup = sortedData => {
  const landingsPerHour = getLandingsPerHour(sortedData);

  const tbodyMarkup = Object.keys(landingsPerHour)
    .map(el => {
      if (Number.isNaN(Number(el))) return null;

      const currentHourPlusOne =
        Number(el) === 23 ? '00' : (Number(el) + 1).toString().padStart(2, '0');

      const getClass = getDate().time.split(':')[0] === el ? 'currentHour' : '#';

      return `<tr class=${getClass}>
   <td class="landed-count">${Number(el)
     .toString()
     .padStart(2, '0')}:00 - ${currentHourPlusOne}:00</td>
   <td class ="landed-count">${Number(landingsPerHour[el])}</td>
 </tr>`;
    })
    .filter(Boolean)
    .join('');

  return `
  <section class="landed-info">
          <div class="container">
            <div class="#">
            <p class ="flightsLandedLastHour">${getTranslate(
              'flightsLandedLastHour'
            )} <span class ="flightsLandedCount">${landingsPerHour.landed}</span></p>
              <table class="#">
                <thead class="#">
                  <tr>
                    <th class="#">${getTranslate('tableHour')}</th>
                    <th class="#">${getTranslate('tableArrivals')}</th> 
                  </tr>
                </thead>
                <tbody class="#">${tbodyMarkup}</tbody>
              </table>
            </div>
          </div>
        </section>
  `;
};
