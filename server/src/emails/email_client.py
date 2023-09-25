"""
This module contains the EmailClient class, which is used to send emails.
"""
import logging
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


class EmailClient:
    def __init__(self):
        self._sendgrid_api_key = os.environ["SENDGRID_API_KEY"]
        self._sender_email = os.environ["SENDER_EMAIL"]
        self._dev_email_receiver = os.getenv("DEV_EMAIL_RECEIVER")
        self._sg = SendGridAPIClient(self._sendgrid_api_key)
        self._logger = logging.getLogger(__name__)

    def send_email(self, to_email: str, subject: str, html_content: str) -> None:
        """
        Send an email
        :param to_email: The recipient's email address
        :param subject: The email subject
        :param html_content: The email content
        :return: None
        """
        if self._dev_email_receiver:
            self._logger.warning(
                f"Sending email to {self._dev_email_receiver} instead of {to_email} because DEV_EMAIL_RECEIVER is set"
            )
            to_email = self._dev_email_receiver
            subject = f"DEV: {subject}"

        message = Mail(
            from_email=self._sender_email,
            to_emails=to_email,
            subject=subject,
            html_content=html_content,
        )
        try:
            response = self._sg.send(message)
            return response
        except Exception as e:
            self._logger.exception(f"Failed to send an email to {to_email}: {e}")
            raise e
