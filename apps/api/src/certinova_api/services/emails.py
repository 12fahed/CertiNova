from email.message import EmailMessage
from html import escape


def _message(sender: str, to: str, subject: str, text: str, html: str) -> EmailMessage:
    message = EmailMessage()
    message["From"] = sender
    message["To"] = to
    message["Subject"] = subject
    message.set_content(text)
    message.add_alternative(html, subtype="html")
    return message


def certificate_email(
    *,
    sender: str,
    to: str,
    recipient_name: str,
    event_name: str,
    organisation_name: str,
    verify_url: str,
    png: bytes,
    file_name: str,
) -> EmailMessage:
    text = (
        f"Hello {recipient_name},\n\n"
        f"{organisation_name} has issued your certificate for {event_name}. It is attached.\n\n"
        f"Anyone can check it here: {verify_url}\n"
    )
    html = (
        f"<p>Hello {escape(recipient_name)},</p>"
        f"<p>{escape(organisation_name)} has issued your certificate for "
        f"<strong>{escape(event_name)}</strong>. It is attached.</p>"
        f'<p>Anyone can check it here: <a href="{escape(verify_url)}">{escape(verify_url)}</a></p>'
    )
    message = _message(sender, to, f"Your {event_name} certificate", text, html)
    message.add_attachment(png, maintype="image", subtype="png", filename=file_name)
    return message


def invite_email(
    *, sender: str, to: str, organisation_name: str, inviter_name: str, accept_url: str
) -> EmailMessage:
    text = (
        f"{inviter_name} invited you to join {organisation_name} on CertiNova.\n\n"
        f"Accept the invite: {accept_url}\n\nThe link expires in 7 days.\n"
    )
    html = (
        f"<p>{escape(inviter_name)} invited you to join "
        f"<strong>{escape(organisation_name)}</strong> on CertiNova.</p>"
        f'<p><a href="{escape(accept_url)}">Accept the invite</a></p>'
        f"<p>The link expires in 7 days.</p>"
    )
    return _message(sender, to, f"Join {organisation_name} on CertiNova", text, html)
