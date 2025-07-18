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
    .sort((a, b) => Number(a) - Number(b))
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

export const getScheduledFlightsMarkup = data => {
  const flightsMap = new Map();

  data.forEach(({ scheduled_time, status, date }) => {
    if (
      status.includes('WYLĄDOWAŁ') ||
      status.includes('OPÓŹNIONY') ||
      status.includes('PRZEKIEROWANY') ||
      status.includes('ODWOŁANY') ||
      status.includes('PRZYLOT')
    )
      return;

    if (!scheduled_time?.length || !date?.length) return;

    const [hour, minutes] = scheduled_time.split(':').map(Number);
    const [year, month, day] = date.split('-').map(Number);

    const arrivalDate = new Date(year, month - 1, day, hour, minutes).getTime();

    const key = `${hour}`.padStart(2, '0');

    if (flightsMap.has(key)) {
      const obj = flightsMap.get(key);
      obj.count += 1;
    } else {
      flightsMap.set(key, { count: 1, arrivalDate });
    }
  });

  const sortedArray = [...flightsMap.entries()]
    .map(([hour, { count, arrivalDate }]) => ({
      hour,
      count,
      arrivalDate,
    }))
    .sort((a, b) => a.arrivalDate - b.arrivalDate);

  const chartMarkup = sortedArray
    .map(({ hour, count }) => {
      return `
      <div class="bar-container">
          <div>${count}</div>
          <div class="bar" style="height: ${count * 10}px" title="${count} рейсов"></div>
          <div class="bar-label">${hour}:00</div>
        </div>
      `;
    })
    .join('');

  return `<section class="scheduled-flights-section">
   <div class="container">
   <h2 class="scheduled-flights-title">${getTranslate('scheduled_flights')}</h2>
  <div class="flights-chart">
  ${chartMarkup}
</div>
</div>
</section>`;
};
