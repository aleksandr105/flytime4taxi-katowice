// Object.defineProperty(navigator, 'language', { get: () => 'uk-UA' });

const userLang = navigator.language.split('-')[0];

export const translations = {
  en: {
    status: 'Status',
    airline_name: 'Airline',
    airport: 'From',
    flightsLandedLastHour: 'Flights landed in the last hour',
    tableHour: 'Hour',
    tableArrivals: 'Arrivals',
  },
  pl: {
    status: 'Status',
    airline_name: 'Linia lotnicza',
    airport: 'Skąd',
    flightsLandedLastHour: 'Lotów wylądowało w ciągu ostatniej godziny',
    tableHour: 'Godzina',
    tableArrivals: 'Przyloty',
  },
  uk: {
    status: 'Статус',
    airline_name: 'Авіакомпанія',
    airport: 'Звідки',
    flightsLandedLastHour: 'Рейсів прилетіло за останню годину',
    tableHour: 'Година',
    tableArrivals: 'Прильоти',
  },
  ru: {
    status: 'Статус',
    airline_name: 'Авиакомпания',
    airport: 'Откуда',
    flightsLandedLastHour: 'Рейсов прилетело за последний час',
    tableHour: 'Час',
    tableArrivals: 'Прилёты',
  },
  ka: {
    status: 'სტატუსი',
    airline_name: 'ავიაკომპანია',
    airport: 'საიდან',
    flightsLandedLastHour: 'ბოლო საათში ჩამოფრინდა რეისი',
    tableHour: 'საათი',
    tableArrivals: 'ჩამოსვლები',
  },
};

export const getTranslate = el => {
  return (
    (translations && translations[userLang] && translations[userLang][el]) || translations.en[el]
  );
};
