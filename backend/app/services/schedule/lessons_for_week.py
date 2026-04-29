import os
import sys
import pandas as pd

OFFICE = 31
GROUP_COL = 30
TIME_COL = 3
DAY_COL = 1
NUMBER_COL = 2


WEEK_DAYS = [
    "ПОНЕДЕЛЬНИК",
    "ВТОРНИК",
    "СРЕДА",
    "ЧЕТВЕРГ",
    "ПЯТНИЦА",
    "СУББОТА"
]


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

def get_week_schedule():
    df = load_df()

    if df is None or df.empty:
        return {
            "week": []
        }

    week = []
    current_day = None

    for i in range(len(df)):
        row = df.iloc[i]

        cell = row[DAY_COL]
        cell = "" if pd.isna(cell) else str(cell)

        # 📅 новый день
        if any(day in cell for day in WEEK_DAYS):
            current_day = cell

            week.append({
                "day": current_day.strip(),
                "lessons": [],
                "info": []
            })

        if current_day is None:
            continue

        day_block = week[-1]

        number = row[NUMBER_COL]
        time = row[TIME_COL]
        lesson = row[GROUP_COL]
        office = row[OFFICE]

        if pd.isna(time) or pd.isna(lesson):
            continue

        lesson_str = str(lesson).lower()

        # 🧹 INFO (нормализуем)
        if "соловая" in lesson_str or "столовая" in lesson_str:
            day_block["info"].append({
                "type": "lunch",
                "text": "Столовая",
                "time": "11:25-12:05"
            })
            continue

        if "уб" in lesson_str:
            day_block["info"].append({
                "type": "cleaning",
                "text": str(lesson),
                "time": None
            })
            continue

        # 📚 LESSON (ВОТ ТУТ ФИКС)
        if is_valid_lesson(number, time, lesson):
            parsed = parse_lesson(number, time, lesson, office)
            if parsed:
                day_block["lessons"].append(parsed)

    return {
        "week": week
    }