# Test1 Расчет ставки и суммы полученых процентов по условиям банковского депозита

import os
from datetime import date, timedelta
from re import A

# общие функции
def is_float(element: str) -> bool:
    try:
        float(element)
        return True
    except ValueError:
        return False

def is_leap_year(year: int) -> bool:
    if year % 4 != 0:
        return False
    elif year % 100 != 0:
        return True
    else:
        return year % 400 == 0

def input_date(date_name: str) -> date:
    while (True):
        date_str=input(f"Введите дату {date_name} (ДД.ММ.ГГГГ) или Ж - для выхода: ")
        if date_str in ("Ж", "Q"):
            exit(1)
        try:
            day, month, year = [int(item) for item in date_str.split(".")]
            return date (year, month, day)    
        except ValueError:
            print(f"Строка {date_str} не соотвествует формату ввода ДД.ММ.ГГГГ")

def input_duration() -> int:
    while(True):
        duration_str=input("Введите срок размещения в месяцах(м) или днях(д) [60д] или Ж - для выхода: ").upper()
        if duration_str  in ("Ж", "Q"):
            exit(1)
        elif duration_str.endswith("М"):
            return [int(duration_str.replace("М","")),0]
        elif duration_str.endswith("Д"):
            return [0,int(duration_str.replace("Д",""))]
        else:
            print(f"Строка {duration_str} не соотвествует формату ввода ##м или ##д ") 

def input_decimal(decimal_name: str, controlmin=0, controlmax=0) ->float:
    while(True):
        dec_str = input (f"Введите {decimal_name} или Ж - для выхода: ")
        if dec_str in ("Ж", "Q"):
            exit(1)
        elif is_float(dec_str):
            dec_flt= float(dec_str)
            if not(controlmin==0) or not(controlmax==0):
                if dec_flt >= controlmin and dec_flt <= controlmax:
                    return dec_flt
                else:
                    print("Введите значение в диапазоне предоставленных опций.")
            else:
                return dec_flt

        else:
            print(f"Строка {dec_str} не соотвествует формату ввода") 

def add_month(a_date, months):
    next_day=a_date+timedelta(1)
    m_sum = next_day.month + months - 1
    y = next_day.year + m_sum // 12
    m = m_sum % 12 + 1
    try:
        return date(y, m, next_day.day)-timedelta(1)
    except ValueError:
        return date(y, m + 1, 1)-timedelta(1)

date_start:     date                   # Дата размещения
duration_days:  int     =0             # Срок в днях
duration_months: int    =0             # Срок в месяцах
deposit:    float       =0             # Сумма размещения
interest:   float   =0                 # Ставка (%)
period_p:   int     =0                 # Периодичность начисления процентов (0 - в конце срока; 1 - ежемесячно; 2 - ежеквартально)
cap_p:  bool        =False             # Капитализация процентов 

print("Калькулятор вкладов, v0.3.1 (pre-beta)\n")
print("Расчет ставки и суммы полученых процентов по условиям банковского депозита")
print("Необходимо ввести дату размещения, срок, сумму и ставку, а так же периодичность начисления и капитализацию процентов")
print("В результате расчета будет выведен график начисления процентов, общая сумма процентов и эффективная ставка размещения\n")

os.system("pause")
os.system("cls")

#Ввод данных 
date_start= input_date("размещения депозита")
duration_months, duration_days = [int(item) for item in input_duration()]
deposit = input_decimal("сумму размещения в рублях")
interest = input_decimal("ставку в %")
period_p = int(input_decimal("периодичность начисления процентов (0 - в конце срока; 1 - ежемесячно; 2 - ежеквартально)",0,2))
cap_p = bool(int(input_decimal("капитализация процентов (0 - если отсутствует; 1 - если присутствует)",0,1)))
#Расчет графика и доходности
date_start_calc = date_start
days_left=duration_days
year_procents=0

if duration_months>0:
    duration_days=(add_month(date_start,duration_months)-date_start).days
    date_end=add_month(date_start,duration_months)
    
if (cap_p == False or (cap_p == True and period_p == 0)):
    while days_left > 0:
        eoy_date=date(date_start_calc.year,12,31)

        days_in_year = min((eoy_date-date_start_calc).days,days_left)
        days_left=days_left-days_in_year
        date_end=date_start_calc+timedelta(days=days_in_year-1)
        daysofyear=365
        if is_leap_year(eoy_date.year):
            daysofyear=366
        interest_day=interest/daysofyear
        year_procents+=deposit*interest_day*days_in_year/100
        date_start_calc=eoy_date+timedelta(days=1)
elif (cap_p == True and (period_p == 1)) and duration_months == 0:
    date_end=date_start+timedelta(days=duration_days)
    monthsend=(date_end.month-date_start.month)
    if monthsend <= 0:
        monthsend+=12
    coaf=(interest/1200+1)**monthsend
    year_procents=deposit*coaf
else:
    print("Извините, у разработчиков не хватило рассудка для иных типов расчётов. В данный момент эта программа поддерживает только расчёты без капитализации.")
#TODO:  МНОГА, С МЕСЯЦАМИ ЕЩЁ ДУМАТЬ ЧТО-ТО

#Вывод результатов
os.system("pause")
os.system('cls')
if cap_p == True:
    cap_p=str("Да")
else:
    cap_p=str("Нет")
print ("Дата размещения депозита: ",date_start)
print ("Продолжительность депозита (в днях): ",duration_days)
print ("Продолжительность депозита (в месяцах): ",duration_months)
print ("Депозит: ",deposit)
print ("Ставка: ",interest)
print ("Периодичность начисления процентов:  ",period_p)
print ("Наличие капитализации: ",cap_p)
print ("Вот сколько вы заработаете: ",year_procents,"\nВот когда вам вернёт деньги банк/банкир: ",date_end)
