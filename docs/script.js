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
    if (d.getDate() < day) d.setDate(0);
    return d;
}

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

    let periodMonths = 0;
    if (period === 1) periodMonths = 1;
    if (period === 2) periodMonths = 3;
    if (!capitalization) {
        let daysLeft = days;

        while (daysLeft > 0) {
            let yearDays = daysInYear(currentDate);
            let endOfYear = new Date(currentDate.getFullYear(), 11, 31);

            let chunk = Math.min(
                Math.floor((endOfYear - currentDate) / 86400000) + 1,
                daysLeft
            );

            let interestPart =
                deposit * (interest / 100) * chunk / yearDays;

            totalInterest += interestPart;
            daysLeft -= chunk;

            currentDate = new Date(endOfYear);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return {
            income: totalInterest,
            finalAmount: deposit + totalInterest,
            endDate
        };
    }

    if (period === 0) {
        let yearDays = daysInYear(currentDate);
        totalInterest = balance * (interest / 100) * days / yearDays;

        return {
            income: totalInterest,
            finalAmount: balance + totalInterest,
            endDate
        };
    }

    while (currentDate < endDate) {
        let nextDate = addMonths(currentDate, periodMonths);
        if (nextDate > endDate) nextDate = endDate;

        let periodDays =
            Math.floor((nextDate - currentDate) / 86400000) + 1; // ✅ фикс

        let yearDays = daysInYear(currentDate);

        let interestPart =
            balance * (interest / 100) * periodDays / yearDays;

        balance += interestPart;

        currentDate = nextDate;
    }

    return {
        income: balance - deposit,
        finalAmount: balance,
        endDate
    };
}

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

let banksData = [];

async function loadBanks() {
    const response = await fetch("banks.json");
    const data = await response.json();
    banksData = data.banks;
    displayBanks(banksData);
}

function periodText(p) {
    if (p === 1) return "Ежемесячно";
    if (p === 3) return "Ежеквартально";
    return "В конце срока";
}

function displayBanks(banks) {
    const container = document.getElementById("banksContainer");
    container.innerHTML = "";

    const dateStart = document.getElementById("dateStart").value;
    const days = Number(document.getElementById("durationDays").value);
    const deposit = Number(document.getElementById("deposit").value);

    banks.forEach(bank => {
        const card = document.createElement("div");
        card.className = "bank-card";

        let profitText = "";

        if (dateStart && days > 0 && deposit > 0) {
            const result = calculateDeposit({
                startDate: dateStart,
                days,
                deposit,
                interest: bank.interestRate,
                capitalization: bank.capitalization,
                period: bank.interestPeriod === 1 ? 1 :
                        bank.interestPeriod === 3 ? 2 : 0
            });

            profitText = `<br><b>Доход: ${result.income.toFixed(2)} ₽</b>`;
        }

        card.innerHTML = `
            <strong>${bank.bankName}</strong><br>
            ${bank.depositName}<br>
            Ставка: <b>${bank.interestRate}%</b><br>
            Срок: ${bank.minDays}-${bank.maxDays} дней<br>
            Период начисления: ${periodText(bank.interestPeriod)}<br>
            Капитализация: ${bank.capitalization ? "Да" : "Нет"}
            ${profitText}
            <br>
            <button class="small-btn" onclick="selectBank(${bank.id})">Выбрать</button>
        `;

        container.appendChild(card);
    });
}

function selectBank(id) {
    const bank = banksData.find(b => b.id === id);

    document.getElementById("interest").value = bank.interestRate;
    document.getElementById("capitalization").value = bank.capitalization ? 1 : 0;

    if (bank.interestPeriod === 1)
        document.getElementById("period").value = 1;
    else if (bank.interestPeriod === 3)
        document.getElementById("period").value = 2;
    else
        document.getElementById("period").value = 0;
}

function sortBanksByRate() {
    const sorted = [...banksData].sort((a, b) => b.interestRate - a.interestRate);
    displayBanks(sorted);
}

function sortBanksByProfit() {
    const dateStart = document.getElementById("dateStart").value;
    const days = Number(document.getElementById("durationDays").value);
    const deposit = Number(document.getElementById("deposit").value);

    if (!dateStart || days <= 0 || deposit <= 0) {
        alert("Введите дату, срок и сумму.");
        return;
    }

    const sorted = [...banksData].sort((a, b) => {
        const resA = calculateDeposit({
            startDate: dateStart,
            days,
            deposit,
            interest: a.interestRate,
            capitalization: a.capitalization,
            period: a.interestPeriod === 1 ? 1 :
                    a.interestPeriod === 3 ? 2 : 0
        });

        const resB = calculateDeposit({
            startDate: dateStart,
            days,
            deposit,
            interest: b.interestRate,
            capitalization: b.capitalization,
            period: b.interestPeriod === 1 ? 1 :
                    b.interestPeriod === 3 ? 2 : 0
        });

        return resB.income - resA.income;
    });

    displayBanks(sorted);
}

window.onload = function() {
    loadBanks();
};
