<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>FinCalc</title>

<script src="https://telegram.org/js/telegram-web-app.js"></script>
<script defer src="script.js"></script>

<style>
:root {
    --bg: #0f1115;
    --card: #1a1d23;
    --accent: #4da3ff;
    --text: #e6e6e6;
    --muted: #7d8796;
    --border: #262b33;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: var(--bg);
    color: var(--text);
    padding: 24px;
}

.container {
    max-width: 420px;
    margin: auto;
}

h1 {
    font-weight: 500;
    font-size: 20px;
    margin-bottom: 24px;
}

.card {
    background: var(--card);
    padding: 18px;
    border-radius: 14px;
    margin-bottom: 16px;
    border: 1px solid var(--border);
}

label {
    font-size: 13px;
    color: var(--muted);
    display: block;
    margin-bottom: 6px;
}

input, select {
    width: 100%;
    padding: 10px;
    background: #14171c;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-size: 14px;
    margin-bottom: 14px;
}

input:focus, select:focus {
    outline: none;
    border-color: var(--accent);
}

button {
    width: 100%;
    padding: 12px;
    background: var(--accent);
    border: none;
    border-radius: 10px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: 0.2s;
}

button:hover {
    opacity: 0.85;
}

.result {
    margin-top: 12px;
    font-size: 14px;
    line-height: 1.6;
}

.highlight {
    font-size: 18px;
    font-weight: 500;
}
</style>
</head>

<body>
<div class="container">

<h1>Калькулятор вклада</h1>

<div class="card">

<label>Дата размещения</label>
<input type="date" id="dateStart">

<label>Срок (в днях)</label>
<input type="number" id="durationDays" placeholder="Например: 180">

<label>Сумма вклада</label>
<input type="number" id="deposit" placeholder="100000">

<label>Процентная ставка (%)</label>
<input type="number" id="interest" placeholder="10">

<label>Период начисления</label>
<select id="period">
    <option value="0">В конце срока</option>
    <option value="1">Ежемесячно</option>
    <option value="2">Ежеквартально</option>
</select>

<label>Капитализация</label>
<select id="capitalization">
    <option value="0">Нет</option>
    <option value="1">Да</option>
</select>

<button onclick="calculate()">Рассчитать</button>

<div class="result" id="result"></div>

</div>

</div>
</body>
</html>
