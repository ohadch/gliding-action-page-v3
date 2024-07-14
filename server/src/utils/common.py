import datetime


def stringify_duration(
    total_duration: datetime.timedelta,
) -> str:
    """
    Format the duration as HH:MM:SS
    :param total_duration: duration as timedelta
    :return: duration as HH:MM:SS
    """
    duration = total_duration
    hours, remainder = divmod(duration.seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    duration_str = f"{hours:02}:{minutes:02}:{seconds:02}"
    return duration_str
