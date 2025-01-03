import base64
import logging
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import (
    Mail,
    Attachment,
    FileContent,
    FileName,
    FileType,
    Disposition,
)


class EmailClient:
    def __init__(self):
        self._sendgrid_api_key = os.environ["SENDGRID_API_KEY"]
        self._sender_email = os.environ["SENDER_EMAIL"]
        self._dev_email_receiver = os.getenv("DEV_EMAIL_RECEIVER")
        self._sg = SendGridAPIClient(self._sendgrid_api_key)
        self._logger = logging.getLogger(__name__)

    def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        attachment_path: str = None,
    ) -> None:
        """
        Sends an email with an optional attachment.

        :param to_email: The recipient's email address
        :param subject: The email subject
        :param html_content: The email content
        :param attachment_path: Optional path to a file to attach
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

        if attachment_path:
            if not os.path.isfile(attachment_path):
                raise FileNotFoundError(f"Attachment file not found: {attachment_path}")

            with open(attachment_path, "rb") as f:
                encoded_content = base64.b64encode(f.read()).decode()

            attachment = Attachment(
                FileContent(encoded_content),
                FileName(os.path.basename(attachment_path)),
                FileType("application/zip"),  # Adjust the MIME type if needed
                Disposition("attachment"),
            )
            message.attachment = attachment

        try:
            response = self._sg.send(message)
            return response
        except Exception as e:
            self._logger.exception(f"Failed to send an email to {to_email}: {e}")
            raise e
