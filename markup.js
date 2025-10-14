import { getTranslate } from './translation.js';
import { getLandingsPerHour, getDate } from './healpers/index.js';

export const getCurrentArrivalsMarkup = sortedData => {
  const tableBodyMarcup = sortedData
    .map(({ airline_name, airline_logo, airport, status, terminal }) => {
      if (status === '') return '';

      let backgroundStatus = 'tr-flight';

      if (status.toUpperCase().includes('WYLĄDOWAŁ')) {
        backgroundStatus = 'plane-landed';
      } else if (status.toUpperCase().includes('OPÓŹNIONY')) {
        backgroundStatus = 'delayed-landed';
      } else if (status.toUpperCase().includes('PRZEKIEROWANY')) {
        backgroundStatus = 'redirected-flight';
      } else if (status.toUpperCase().includes('ODWOŁANY')) {
        backgroundStatus = 'canceled-flight';
      } else {
        backgroundStatus = 'tr-flight';
      }

      return `
 <tr class=${backgroundStatus}>
   <td class="td-flight-status"><p>${status}</p><p class="terminal-Info">${terminal}</p></td>
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

export const arrivalsByHourMarkup = (sortedData, countLanded) => {
  const landingsPerHour = getLandingsPerHour(sortedData);

  const tbodyMarkup = landingsPerHour
    .map(([key, { count, landed }]) => {
      const currentHourPlusOne = key === 23 ? '00' : (key + 1).toString().padStart(2, '0');

      const getClass = Number(getDate().time.split(':')[0]) === key ? 'currentHour' : '#';
      const backgroundColor = landed !== 0 ? 'landed-wrapper-landed' : '';

      return `<tr class=${getClass}>
     <td class="landed-count">${key.toString().padStart(2, '0')}:00 - ${currentHourPlusOne}:00</td>
     <td class ="landed-count">${count}</td>
     <td class ="landed-count"><p class="landed-wrapper ${backgroundColor}">${landed}</p></td>
   </tr>`;
    })
    .join('');

  return `
  <section class="landed-info">
          <div class="container">
            <div class="#">
            <p class ="flightsLandedLastHour">${getTranslate(
              'flightsLandedLastHour'
            )} <span class ="flightsLandedCount">${countLanded}</span></p>
              <table class="#">
                <thead class="#">
                  <tr>
                    <th class="#">${getTranslate('tableHour')}</th>
                    <th class="#">${getTranslate('tableArrivals')}</th>
                    <th class="#">${getTranslate('landed')}</th>
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

  const currentDate = getDate();

  const [hour] = currentDate.time.split(':').map(Number);
  const [year, month, day] = currentDate.date.split('-').map(Number);

  const currentSeconds = new Date(year, month - 1, day, hour, 0).getTime();

  data.forEach(({ scheduled_time, status, date }) => {
    if (
      status.toUpperCase().includes('OPÓŹNIONY') ||
      status.toUpperCase().includes('PRZEKIEROWANY') ||
      status.toUpperCase().includes('ODWOŁANY')
    )
      return;

    if (!scheduled_time?.length || !date?.length) return;

    const getFlightTime = () => {
      if (status.toUpperCase().includes('PRZYLOT') || status.toUpperCase().includes('WYLĄDOWAŁ')) {
        let hours;
        let minutes;

        const timeMatch = status.match(/\b(\d{2}):(\d{2})\b/);

        if (timeMatch) {
          [, hours, minutes] = timeMatch;
        } else if (scheduled_time) {
          [hours, minutes] = scheduled_time.split(':');
        }

        return `${hours}:${minutes}`;
      }

      return scheduled_time;
    };

    const [hour, minutes] = getFlightTime().split(':').map(Number);
    const [year, month, day] = date.split('-').map(Number);

    const arrivalDate = new Date(year, month - 1, day, hour, minutes).getTime();

    if (currentSeconds > arrivalDate) return;

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

  const theme = JSON.parse(localStorage.getItem('dark')) ? 'dark' : '';

  return `<section class="scheduled-flights-section">
   <div class="container">
   <h2 class="scheduled-flights-title">${getTranslate('scheduled_flights')}</h2>
  <div class="flights-chart ${theme}">
  ${chartMarkup}
</div>
</div>
</section>`;
};
