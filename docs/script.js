
function isLeapYear(year) {
    if (year % 4 !== 0) return false;
    if (year % 100 !== 0) return true;
    return year % 400 === 0;
}

function daysInYear(date) {
    return isLeapYear(date.getFullYear()) ? 366 : 365;
}

function addMonths(date, months) {
    let d = new Date(date);
    let day = d.getDate();
    d.setMonth(d.getMonth() + months);

    // защита от переполнения месяца
    if (d.getDate() < day) {
        d.setDate(0);
    }
    return d;
}

/* ===== ОСНОВНАЯ ФУНКЦИЯ РАСЧЁТА ===== */

function calculateDeposit({
    startDate,
    days,
    deposit,
    interest,
    capitalization,
    period
}) {
    let currentDate = new Date(startDate);
    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);

    let balance = deposit;
    let totalInterest = 0;

    // период начисления в месяцах
    let periodMonths = 0;
    if (period === 1) periodMonths = 1;
    if (period === 2) periodMonths = 3;

    /* ===== НАЧИСЛЕНИЕ В КОНЦЕ СРОКА ===== */
    if (period === 0) {
        let daysLeft = days;

        while (daysLeft > 0) {
            let yearDays = daysInYear(currentDate);
            let endOfYear = new Date(currentDate.getFullYear(), 11, 31);

            let chunk = Math.min(
                Math.floor((endOfYear - currentDate) / 86400000) + 1,
                daysLeft
            );

            let interestPart =
                balance * (interest / 100) * chunk / yearDays;

            totalInterest += interestPart;
            daysLeft -= chunk;

            currentDate = new Date(endOfYear);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return {
            income: totalInterest,
            finalAmount: balance + totalInterest,
            endDate
        };
    }

    /* ===== ПЕРИОДИЧЕСКОЕ НАЧИСЛЕНИЕ ===== */
    while (currentDate < endDate) {
        let nextDate = addMonths(currentDate, periodMonths);
        if (nextDate > endDate) nextDate = endDate;

        let periodDays =
            Math.floor((nextDate - currentDate) / 86400000);

        let yearDays = daysInYear(currentDate);

        let interestPart =
            balance * (interest / 100) * periodDays / yearDays;

        if (capitalization) {
            balance += interestPart;
        } else {
            totalInterest += interestPart;
        }

        currentDate = nextDate;
    }

    return {
        income: capitalization ? balance - deposit : totalInterest,
        finalAmount: capitalization ? balance : deposit + totalInterest,
        endDate
    };
}

/* ===== ФУНКЦИЯ, КОТОРУЮ ВЫЗЫВАЕТ КНОПКА ===== */

function calculate() {
    const dateStart = document.getElementById("dateStart").value;
    const days = Number(document.getElementById("durationDays").value);
    const deposit = Number(document.getElementById("deposit").value);
    const interest = Number(document.getElementById("interest").value);
    const period = Number(document.getElementById("period").value);
    const capitalization = Boolean(
        Number(document.getElementById("capitalization").value)
    );

    if (!dateStart || days <= 0 || deposit <= 0 || interest <= 0) {
        document.getElementById("result").innerText =
            "Пожалуйста, заполните все поля корректно.";
        return;
    }

    const result = calculateDeposit({
        startDate: dateStart,
        days,
        deposit,
        interest,
        capitalization,
        period
    });

    document.getElementById("result").innerText =
        `Доход: ${result.income.toFixed(2)} ₽
Итоговая сумма: ${result.finalAmount.toFixed(2)} ₽
Дата возврата: ${result.endDate.toLocaleDateString()}`;
}
