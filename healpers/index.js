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
  const plusTwelveHours = getDate('+', 12);

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

export const sortData = data => {
  const oneHourAgo = Date.now() - 75 * 60 * 1000;

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
      };
    })
    .filter(Boolean)
    .filter(flight => flight.arrivalTime >= oneHourAgo)
    .sort((a, b) => a.arrivalTime - b.arrivalTime);
};

export const getLandingsPerHour = sortedData => {
  return sortedData.reduce(
    (acc, flight) => {
      if (
        flight.status.includes('ODWOŁANY') ||
        flight.status.includes('OPÓŹNIONY') ||
        flight.status.includes('PRZEKIEROWANY')
      )
        return acc;

      if (flight.status.includes('WYLĄDOWAŁ')) acc.landed += 1;

      const timeMatch = flight.status.match(/\b(\d{2}):(\d{2})\b/)[1];

      if (!timeMatch) return acc;

      acc[timeMatch] = acc[timeMatch] ? acc[timeMatch] + 1 : (acc[timeMatch] = 1);

      return acc;
    },
    { landed: 0 }
  );
};
