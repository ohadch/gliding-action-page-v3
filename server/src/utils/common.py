import datetime


def stringify_duration(
    start_time: datetime.datetime, end_time: datetime.datetime
) -> str:
    """
    Format the duration as HH:MM:SS
    :param start_time: start time
    :param end_time: end time
    :return: duration as HH:MM:SS
    """
    duration = end_time - start_time
    hours, remainder = divmod(duration.seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    duration_str = f"{hours:02}:{minutes:02}:{seconds:02}"
    return duration_str
