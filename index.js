import {
  getFlyData,
  getTimeForRequest,
  sortData,
  getStartOfPreviousHour,
} from './healpers/index.js';
import {
  getCurrentArrivalsMarkup,
  arrivalsByHourMarkup,
  getScheduledFlightsMarkup,
} from './markup.js';

const ref = document.querySelector('.main>div');

let oldMarkup = '';

const createMarkup = async () => {
  const requestPromises = getTimeForRequest().map(data => getFlyData(data));

  const data = await Promise.all(requestPromises)
    .then(responses => responses.flat())
    .catch(err => {
      console.error('Ошибка при загрузке данных:', err);
    });

  if (!data) return;

  const allData = data.flatMap(item => item?.data || []);

  const sortedData = sortData(allData, Date.now() - 60 * 60 * 1000);

  const landedOneHourAgo = [...sortedData].reduce((acc, { status }) => {
    if (status.includes('WYLĄDOWAŁ')) return (acc += 1);
    return acc;
  }, 0);

  const sortedDataForArrivalsByHour = sortData(allData, getStartOfPreviousHour());

  const newMarkup =
    arrivalsByHourMarkup(sortedDataForArrivalsByHour, landedOneHourAgo) +
    getCurrentArrivalsMarkup(sortedData);

  if (oldMarkup === newMarkup) return;

  oldMarkup = newMarkup;

  const markup = getScheduledFlightsMarkup(allData);

  ref.innerHTML = newMarkup + markup;
};
createMarkup();

setInterval(() => {
  createMarkup();
}, 1 * 60 * 1000);
