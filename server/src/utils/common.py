import datetime
import subprocess


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


def run_subprocess(command: str) -> str:
    """
    Run a subprocess command and return the output
    :param command: Command to run
    :return: Output of the command
    """
    stdout, stderr = subprocess.Popen(
        command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    ).communicate()

    if stderr:
        raise RuntimeError(f"Command failed with error: {stderr.decode('utf-8')}")

    return stdout.decode("utf-8")
