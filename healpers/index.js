export const getFlyData = async ({ date, time_from, time_to }) => {
  return await fetch(
    `https://www.katowice-airport.com/pl/api/flight-board/list?direction=2&date=${date}&time_from=${time_from}&time_to=${time_to}`
  )
    .then(data => data.json())
    .then(data => {
      data.data.map(el => {
        el.date = date;
        return el;
      });
      return data;
    })
    .catch(err => {
      console.error('Ошибка при загрузке данных:', err);
    });
};

export const getDate = (sing, toTime) => {
  const now = new Date();

  const nowDate =
    sing && toTime
      ? new Date(
          sing === '+'
            ? now.getTime() + toTime * 60 * 60 * 1000
            : now.getTime() - toTime * 60 * 60 * 1000
        )
      : now;

  const year = nowDate.getFullYear();
  const month = (nowDate.getMonth() + 1).toString().padStart(2, '0');
  const day = nowDate.getDate().toString().padStart(2, '0');
  const hours = nowDate.getHours().toString().padStart(2, '0');
  const minutes = nowDate.getMinutes().toString().padStart(2, '0');

  const date = `${year}-${month}-${day}`;
  const time = `${hours}:${minutes}`;
  return { date, time };
};

export const getTimeForRequest = () => {
  const minusSixHours = getDate('-', 6);
  const plusTwelveHours = getDate('+', 15);

  if (plusTwelveHours.date === minusSixHours.date) {
    return [
      {
        date: minusSixHours.date,
        time_from: minusSixHours.time,
        time_to: plusTwelveHours.time,
      },
    ];
  } else {
    return [
      {
        date: minusSixHours.date,
        time_from: minusSixHours.time,
        time_to: '23:59',
      },
      {
        date: plusTwelveHours.date,
        time_from: '00:00',
        time_to: plusTwelveHours.time,
      },
    ];
  }
};

export const sortData = (data, HoursAgo) => {
  return data
    .map(flight => {
      if (
        flight.status === 'OPÓŹNIONY' ||
        flight.status === 'odwołany'.toUpperCase() ||
        flight.status.includes('PRZEKIEROWANY')
      )
        flight.status =
          (flight.status.includes('PRZEKIEROWANY') ? flight.status.split('/')[1] : flight.status) +
          ' ' +
          flight.scheduled_time;

      const timeMatch = flight.status.match(/\b(\d{2}):(\d{2})\b/);

      if (!timeMatch || flight.status === '') return null;

      const [_, hours, minutes] = timeMatch;

      const [year, month, day] = flight.date.split('-').map(Number);

      const arrivalDate = new Date(year, month - 1, day, parseInt(hours), parseInt(minutes));

      return {
        ...flight,
        arrivalTime: arrivalDate.getTime(),
        arrivalDate,
      };
    })
    .filter(Boolean)
    .filter(flight => {
      if (flight.status.includes('OPÓŹNIONY') || flight.status.includes('PRZEKIEROWANY'))
        return true;

      return flight.arrivalTime >= HoursAgo;
    })
    .sort((a, b) => a.arrivalTime - b.arrivalTime);
};

export const getLandingsPerHour = sortedData => {
  const mapDataLandingsPerHour = new Map();

  sortedData.forEach(({ status, arrivalDate }) => {
    if (
      status.includes('ODWOŁANY') ||
      status.includes('OPÓŹNIONY') ||
      status.includes('PRZEKIEROWANY')
    )
      return;

    const flightHour = Number(arrivalDate.getHours().toString().padStart(2, '0'));

    if (mapDataLandingsPerHour.has(flightHour)) {
      let el = mapDataLandingsPerHour.get(flightHour);

      if (status.includes('WYLĄDOWAŁ')) el.landed += 1;
      el.count += 1;
    } else {
      const isLanden = status.includes('WYLĄDOWAŁ') ? 1 : 0;

      mapDataLandingsPerHour.set(flightHour, { count: 1, landed: isLanden });
    }
  });

  return [...mapDataLandingsPerHour.entries()];
};

export const getStartOfPreviousHour = () => {
  const now = new Date();
  now.setMinutes(0, 0, 0); // обнуляем минуты и секунды
  now.setHours(now.getHours() - 1); // минус один час
  return now.getTime();
};
