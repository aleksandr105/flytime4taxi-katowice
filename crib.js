/*
=======================================
🧠 ШПАРГАЛКА: Map в JavaScript
=======================================

📌 Что такое Map:
Map — коллекция пар "ключ → значение", где:
- Ключи могут быть любого типа (объекты, функции, числа и т.д.)
- Порядок вставки сохраняется
- Предоставляет удобные методы для работы

=======================================
✅ Основные методы

const map = new Map();

map.set(key, value);      // Добавляет или обновляет элемент
map.get(key);             // Получает значение по ключу
map.has(key);             // Проверяет наличие ключа
map.delete(key);          // Удаляет элемент по ключу
map.clear();              // Удаляет все элементы
map.size;                 // Кол-во элементов

map.entries();            // Итератор пар [ключ, значение]
map.keys();               // Итератор по ключам
map.values();             // Итератор по значениям
map.forEach((v, k) => {});// Перебор элементов

=======================================
🧪 Пример использования:

const map = new Map();

map.set('name', 'Alice');
map.set(123, 'ID');
map.set(true, 'Active');

console.log(map.get('name')); // Alice
console.log(map.has(123));    // true
map.delete(true);
console.log(map.size);        // 2

=======================================
🔁 Итерация по Map:

for (const [key, value] of map) {
  console.log(key, value);
}

map.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

for (const key of map.keys()) console.log(key);
for (const value of map.values()) console.log(value);
for (const [key, value] of map.entries()) console.log(key, value);

=======================================
🔄 Преобразование:

// Map → Object
const obj = Object.fromEntries(map);

// Object → Map
const map2 = new Map(Object.entries(obj));

=======================================
🚀 Отличие от объекта {}:

| Возможность            | Map | {} объект |
|------------------------|-----|-----------|
| Ключи любого типа      | ✅  | ❌ строки/символы |
| Порядок вставки        | ✅  | 🚫 не гарантирован |
| Быстрая итерируемость  | ✅  | 🚫 сложнее |
| Методы для работы      | ✅  | 🚫 Object.keys и т.п. |

=======================================
📍 Пример с объектами в качестве ключей:

const user = { id: 1 };
const map = new Map();

map.set(user, 'logged in');
console.log(map.get(user)); // 'logged in'

=======================================
⚠️ Особенности:

- Не сериализуется в JSON напрямую:
  JSON.stringify(new Map()); // "{}"
- Ключи чувствительны к типу:
  map.set('1', 'a') !== map.set(1, 'b')
- Полезен при работе с кэшем, индексами, графами и т.п.*/
