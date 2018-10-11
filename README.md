![Project Logo](https://github.com/mxmknnv/shri-2018-entrance-task-3/blob/master/screenshots/logo.png)
# Приложение для создания и редактирования информации о встречах сотрудников (front-end)

## Решение

### Функция getRecommendation

#### Алгоритм

----- Подготовка данных -----

1. Составляется список встреч для каждой переговороки `mapRoomsEvents`.
2. Массив переговорок фильтруется по параметру вместимости, отбираются комнаты способные вместить всех участников *новой встречи*.
3. Массив переговорок сортируется по параметру `distanceQuality`. Параметр `distanceQuality` вычисляется отдельно и представляет собой общее количество этажей, которое необходимо пройти всем участникам *новой встречи* до конкретной переговорки.

----- Вычисление массива рекомендаций -----

4. Для каждой переговорки проверяется возможность добавить *новую встречу*. Проверяется пересечение временного отрезка *новой встречи* с временными отрезками *запланированных встреч*. В случае пересечения временных отрезков *запланированная встреча* сохраняется в отдельный массив `intersections`. Прошедшие проверку переговорки добавляются в массив `recomendations`. 
5. Если `recomendations` содержит переговорки, то происходит выход из функции. Результатом работы функции будет массив `recomendations`. В противном случае, происходит переход к следующему пункту алгоритма.

----- Перемещение существующих встреч -----

6. Для каждой встречи из массива `intersections` проверяется возможность перемещения в другие переговорки. Для проверки функция `getRec` вызывается рекурсивно, в качестве параметров *новой встречи* используются параметры *перемещаемой встречи*. В случае, если перемещение возможно параметры перемещения сохраняются в массив `swap`. Для предотвращения повторных проверок возможных перемещений используется техника мемоизации, проверенные комбинации сохраняются в массив `badSwaps`. В случае, если для рассматриваемой переговорки удается переместить все встречи из массива `intersections`, то переговорка добавляется в массив `recomendations`.
7. Если `recomendations` содержит переговорки, то происходит выход из функции. Массив `recomendations` будет результатом работы функции. В противном случае, происходит переход к следующему пункту алгоритма.

----- Изменение времени новой встречи -----

7. Временные параметры *новой встречи* сдвигаются на 15 минут, выполняется вычисление `getRec` с новыми параметрами. В случае, если в результате такого сдвига новые временные параметры встречи пересекают установленную границу (согласно условиям, встречи должны заканчиваться к 23:00), то происходит выход из функции. Результатом работы функции будет пустой массив `recomendations`.

#### Примеры

##### Пример 1 [link](https://github.com/mxmknnv/shri-2018-entrance-task-3/blob/41feff200c4dbbb4d15024618c5355400b89bae4/tests/getRecommendation.test.js#L190)

![Example3](https://github.com/mxmknnv/shri-2018-entrance-task-3/blob/master/screenshots/example1.png)

----- Дано: -----

Новая встреча:
0. Время: 12:00-13:00, Сотрудники: 1, 2, 3

Сотрудники:
1. login: User 1, floor: 1
2. login: User 2, floor: 2
3. login: User 3, floor: 3

Переговорки:
1. title: Room 1, capacity: 1, floor: 1
2. title: Room 2, capacity: 2, floor: 2
3. title: Room 3, capacity: 3, floor: 3

Запланированные встречи:
1. Время: 11:00-11:45, Переговорка: 2, Сотрудники: 1, 2
2. Время: 13:00-13:30, Переговорка: 2, Сотрудники: 1
3. Время: 13:15-13:45, Переговорка: 3, Сотрудники: 2, 3
4. Время: 11:45-12:45, Переговорка: 3, Сотрудники: 1, 3

----- Ответ: -----

Рекомендация: Переговорка: 3, Перенос: Встреча 4 из Переговорка 3 в Переговорка 2

##### Пример 2 [link](https://github.com/mxmknnv/shri-2018-entrance-task-3/blob/41feff200c4dbbb4d15024618c5355400b89bae4/tests/getRecommendation.test.js#L260)

![Example3](https://github.com/mxmknnv/shri-2018-entrance-task-3/blob/master/screenshots/example2.png)

----- Дано: -----

Новая встреча:
0. Время: 12:00-13:00, Сотрудники: 1, 2, 3, 4, 5, 6

Сотрудники:
1. login: User 1, floor: 1
2. login: User 2, floor: 2
3. login: User 3, floor: 3
4. login: User 4, floor: 1
5. login: User 5, floor: 2
6. login: User 6, floor: 3

Переговорки:
1. title: Room 1, capacity: 2, floor: 1
2. title: Room 2, capacity: 4, floor: 2
3. title: Room 3, capacity: 6, floor: 3

Запланированные встречи:
1. Время: 11:45-12:15, Переговорка: 3, Сотрудники: 2, 5
2. Время: 12:15-12:30, Переговорка: 3, Сотрудники: 1, 2, 3, 4
3. Время: 12:30-13:15, Переговорка: 3, Сотрудники: 3, 4, 5, 6
4. Время: 12:45-13:30, Переговорка: 2, Сотрудники: 1, 6
5. Время: 12:15-12:30, Переговорка: 2, Сотрудники: 3, 4

----- Ответ: -----

Рекомендация:  
  Переговорка: 1,<br/>
  Переносы:<br/>
    1. Встреча 1 из Переговорка 3 в Переговорка 2<br/>
    2. Встреча 2 из Переговорка 3 в Переговорка 2<br/>
    3. Встреча 3 из Переговорка 3 в Переговорка 2<br/>
    4. Встреча 4 из Переговорка 2 в Переговорка 1<br/>
    5. Встреча 5 из Переговорка 2 в Переговорка 1<br/>

##### Пример 3 [link](https://github.com/mxmknnv/shri-2018-entrance-task-3/blob/41feff200c4dbbb4d15024618c5355400b89bae4/tests/getRecommendation.test.js#L362)

![Example3](https://github.com/mxmknnv/shri-2018-entrance-task-3/blob/master/screenshots/example3.png)

----- Дано: -----

Новая встреча:
0. Время: 12:00-13:00, Сотрудники: 1, 3

Сотрудники:
1. login: User 1, floor: 1
2. login: User 2, floor: 2
3. login: User 3, floor: 3

Переговорки:
1. title: Room 1, capacity: 2, floor: 1
2. title: Room 2, capacity: 2, floor: 2
3. title: Room 3, capacity: 2, floor: 3

Запланированные встречи:
1. Время: 12:00-12:30, Переговорка: 1, Сотрудники: 1, 2
2. Время: 12:00-12:45, Переговорка: 2, Сотрудники: 2, 3
3. Время: 12:45-13:00, Переговорка: 3, Сотрудники: 2, 3

----- Ответ: -----

Рекомендация #1: Переговорка: 1, Перенос: Встреча 1 из Переговорка 1 в Переговорка 3<br/>
Рекомендация #2: Переговорка: 2, Перенос: Встреча 2 из Переговорка 2 в Переговорка 3<br/>
Рекомендация #3: Переговорка: 3, Перенос: Встреча 3 из Переговорка 3 в Переговорка 2<br/>