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

const ref = document.querySelector('.main>div.root');

// theme code
const theme = JSON.parse(localStorage.getItem('dark'));

const toggle = document.getElementById('theme-toggle');

if (theme) {
  document.querySelector('body').classList.add('dark-theme');
  document.querySelector('.title').classList.add('title-dark-thime');
  document.querySelector('.checkbox-img').classList.add('checkbox-img-cheked');
  toggle.checked = 'true';
}

toggle.addEventListener('change', () => {
  document.querySelector('.title').classList.toggle('title-dark-thime', toggle.checked);

  if (document.querySelector('.landed-wrapper').classList.contains('.landed-wrapper-landed')) {
    document
      .querySelector('.landed-wrapper.landed-wrapper-landed')
      .classList.toggle('dark-status', toggle.checked);
  }

  document
    .querySelector('.flightsLandedLastHour>span')
    .classList.toggle('dark-status', toggle.checked);

  document
    .querySelectorAll('.currentHour>.landed-count')
    .forEach(el => el.classList.toggle('landed-count-dark', toggle.checked));

  document.body.classList.toggle('dark-theme', toggle.checked);
  document.querySelector('.checkbox-img').classList.toggle('checkbox-img-cheked', toggle.checked);
  document.querySelector('.flights-chart').classList.toggle('dark', toggle.checked);
  localStorage.setItem('dark', JSON.stringify(toggle.checked));
});

document.querySelector('.checkbox-wrapper').style.display = 'flex';
/////////////////

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
