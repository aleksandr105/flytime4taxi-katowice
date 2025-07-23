// Object.defineProperty(navigator, 'language', { get: () => 'uk-UA' });

const userLang = navigator.language.split('-')[0];

export const translations = {
  en: {
    status: 'Status',
    airline_name: 'Airline',
    airport: 'From',
    flightsLandedLastHour: 'Flights landed in the last hour',
    tableHour: 'Hour',
    tableArrivals: 'Expected flights',
    scheduled_flights: 'Scheduled flights',
    landed: 'Landed',
  },
  pl: {
    status: 'Status',
    airline_name: 'Linia lotnicza',
    airport: 'Skąd',
    flightsLandedLastHour: 'Lotów wylądowało w ciągu ostatniej godziny',
    tableHour: 'Godzina',
    tableArrivals: 'Oczekiwane loty',
    scheduled_flights: 'Zaplanowane loty',
    landed: 'Wylądował',
  },
  uk: {
    status: 'Статус',
    airline_name: 'Авіакомпанія',
    airport: 'Звідки',
    flightsLandedLastHour: 'Рейсів прилетіло за останню годину',
    tableHour: 'Година',
    tableArrivals: 'Очікувані рейси',
    scheduled_flights: 'Заплановані рейси',
    landed: 'Приземлився',
  },
  ru: {
    status: 'Статус',
    airline_name: 'Авиакомпания',
    airport: 'Откуда',
    flightsLandedLastHour: 'Рейсов прилетело за последний час',
    tableHour: 'Час',
    tableArrivals: 'Ожидаемые рейсы',
    scheduled_flights: 'Планируемые рейсы',
    landed: 'Приземлился',
  },
  ka: {
    status: 'სტატუსი',
    airline_name: 'ავიაკომპანია',
    airport: 'საიდან',
    flightsLandedLastHour: 'ბოლო საათში ჩამოფრინდა რეისი',
    tableHour: 'საათი',
    tableArrivals: 'მოსალოდნელი რეისები',
    scheduled_flights: 'დაგეგმილი რეისები',
    landed: 'დაჯდა',
  },
};

export const getTranslate = el => {
  return (
    (translations && translations[userLang] && translations[userLang][el]) || translations.en[el]
  );
};
