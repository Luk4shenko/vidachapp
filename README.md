# Репозиторий "Система выдачи и учета возвратов оборудования"

## Описание
Этот репозиторий содержит веб-приложение для учета выдачи и возврата оборудования с использованием базы данных SQLite. Основной функционал включает управление оборудованием, администрирование пользователей и администраторов, а также поиск по данным.

## Используемые технологии
- HTML
- CSS (без стилей в рамках текущего задания)
- JavaScript (Node.js)
- Express.js
- EJS (шаблонизатор для создания представлений)
- SQLite (база данных для хранения данных)

## Структура проекта
- /views: Папка с EJS шаблонами для представлений.
- /public: Папка со стилями или иными файлами для front-end.
- app.js: Основной файл сервера Express и логики приложения.
- package.json: Файл с зависимостями Node.js.

## Запуск проекта
Для запуска проекта выполните следующие шаги:

1. Установка зависимостей:
npm install

2. Запуск сервера:
node app.js

Приложение будет доступно по адресу http://localhost:9999.

## Основные страницы и функционал
### Главная страница:
Содержит кнопки "Выдача оборудования" и "Панель администратора".

### Страница Выдача оборудования:
Форма для заполнения данных о выдаче оборудования:
- Наименование оборудования
- ФИО получившего оборудование.
- ФИО выдавшего оборудование.
- Номер выдачи (генерируется автоматически).
- Выбор типа оборудования из предложенного списка.
- Дополнительные сведения (например, помещение или номер оборудования) в свободной форме.

### Панель администратора:
Страница доступна только администратору после аутентификации:
- Название страницы и кнопка "Выйти".
- Кнопка "Создать нового администратора".
- Кнопка "Изменить пароль".
- Кнопка "Справочник типов оборудования".
- Поле для поиска по таблице оборудования.
- Таблица со столбцами: Получил, Выдал, Дата выдачи, Тип оборудования, Наименование оборудования, Номер выдачи, Дополнительные сведения, Дата возврата, Возврат подтвердил.
- Кнопка "Подтвердить возврат" для отметки возврата и записи данных.

## Бизнес-логика
### Выдача оборудования:
- Автоматическое присвоение номера выдачи в формате АЛYY-NNNN.
- Запись данных о выдаче в базу данных.

### Справочник типов оборудования:
Данная страница позволяет управлять типами оборудования. Страница доступна только администраторам.

### Панель администратора:
- Просмотр всех выданных единиц оборудования.
- Поиск по таблице по различным параметрам.
- Подтверждение возврата оборудования с записью информации о возврате.