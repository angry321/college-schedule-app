import os
import sys
import pandas as pd
import datetime

OFFICE = 31
GROUP_COL = 30
TIME_COL = 3
DAY_COL = 1
NUMBER_COL = 2


days = {
    0: "ПОНЕДЕЛЬНИК",
    1: "ВТОРНИК",
    2: "СРЕДА",
    3: "ЧЕТВЕРГ",
    4: "ПЯТНИЦА",
    5: "СУББОТА"
}


def is_valid_lesson(number, time, lesson):
    if pd.isna(number) or pd.isna(time) or pd.isna(lesson):
        return False

    try:
        number = int(number)
    except:
        return False

    if number < 1 or number > 8:
        return False

    lesson = str(lesson).lower()

    if "уб" in lesson or "столовая" in lesson or "соловая" in lesson:
        return False

    return True


def parse_lesson(number, time, lesson, office):
    if pd.isna(time) or pd.isna(lesson):
        return None

    return {
        "number": None if pd.isna(number) else int(number),
        "time": str(time),
        "subject": str(lesson),
        "room": "-" if pd.isna(office) else str(office)
    }

def load_df():
    path = "uploads/active.xlsx"
    if not os.path.exists(path):
        return None
    return pd.read_excel(path, header=None)

def get_today_schedule():
    df = load_df()

    if df is None or df.empty:
        return {
            "day": None,
            "lessons": [],
            "info": []
        }

    weekday_num = datetime.datetime.now().weekday()
    today_name = f"{days.get(weekday_num)}"

    if today_name is None:
        return {
            "day": None,
            "lessons": [],
            "info": []
        }

    lessons = []
    info = []
    collect = False

    for i in range(len(df)):
        row = df.iloc[i]

        cell = "" if pd.isna(row[DAY_COL]) else str(row[DAY_COL])

        # ищем день (без даты, чтобы совпало)
        if days.get(weekday_num) in cell:
            collect = True

        elif collect and cell != "":
            break

        if not collect:
            continue

        number = row[NUMBER_COL]
        time = row[TIME_COL]
        lesson = row[GROUP_COL]
        office = row[OFFICE]

        if pd.isna(time) or pd.isna(lesson):
            continue

        lesson_str = str(lesson).lower()

        # 🧹 INFO
        if "соловая" in lesson_str or "столовая" in lesson_str:
            info.append({
                "type": "lunch",
                "text": "Столовая",
                "time": "11:25-12:05"
            })
            continue

        if "уб" in lesson_str:
            info.append({
                "type": "cleaning",
                "text": str(lesson),
                "time": None
            })
            continue

        # 📚 LESSON
        if is_valid_lesson(number, time, lesson):
            parsed = parse_lesson(number, time, lesson, office)
            if parsed:
                lessons.append(parsed)

    return {
        "day": today_name,
        "lessons": lessons,
        "info": info
    }