// Object.defineProperty(navigator, 'language', { get: () => 'uk-UA' });

const userLang = navigator.language.split('-')[0];

export const translations = {
  en: {
    status: 'Status',
    airline_name: 'Airline',
    airport: 'From',
  },
  pl: {
    status: 'Status',
    airline_name: 'Linia lotnicza',
    airport: 'Skąd',
  },
  uk: {
    status: 'Статус',
    airline_name: 'Авіакомпанія',
    airport: 'Звідки',
  },
  ru: {
    status: 'Статус',
    airline_name: 'Авиакомпания',
    airport: 'Откуда',
  },
  ka: {
    status: 'სტატუსი',
    airline_name: 'ავიაკომპანია',
    airport: 'საიდან',
  },
};

const getTranslate = el => {
  return (
    (translations && translations[userLang] && translations[userLang][el]) || translations.en[el]
  );
};

document.querySelector('.table-head-status').textContent = getTranslate('status');
document.querySelector('.th-awialine').textContent = getTranslate('airline_name');
document.querySelector('.table-head-airport').textContent = getTranslate('airport');
