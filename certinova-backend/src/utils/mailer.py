import sys
import json
import smtplib
import base64
from email.message import EmailMessage
import traceback

def send_emails(payload):
    smtp_host = payload.get("smtpHost")
    smtp_port = payload.get("smtpPort")
    smtp_email = payload.get("smtpEmail")
    smtp_pass = payload.get("smtpPass")
    from_address = payload.get("fromAddress")
    recipients = payload.get("recipients", [])

    if not all([smtp_host, smtp_port, smtp_email, smtp_pass, from_address]):
        return {"success": False, "error": "Missing SMTP configuration"}

    results = []

    try:
        # Connect to SMTP server
        server = smtplib.SMTP(smtp_host, int(smtp_port))
        server.starttls()
        server.login(smtp_email, smtp_pass)

        for recipient in recipients:
            email_addr = recipient.get("email")
            if not email_addr:
                results.append({"email": None, "status": "failed", "error": "No email address provided"})
                continue

            try:
                msg = EmailMessage()
                msg['Subject'] = recipient.get("subject", "Your Certificate")
                msg['From'] = from_address
                msg['To'] = email_addr

                # Set HTML body
                html_body = recipient.get("htmlBody", "Please find your certificate attached.")
                msg.add_alternative(html_body, subtype='html')

                # Add Attachment
                base64_image = recipient.get("base64Image")
                file_name = recipient.get("fileName", "certificate.png")

                if base64_image:
                    # Remove data URL scheme if present (e.g. data:image/png;base64,...)
                    if "," in base64_image:
                        base64_image = base64_image.split(",")[1]
                    
                    image_data = base64.b64decode(base64_image)
                    msg.add_attachment(image_data, maintype='image', subtype='png', filename=file_name)

                # Send email
                server.send_message(msg)
                results.append({"email": email_addr, "status": "sent"})

            except Exception as e:
                results.append({"email": email_addr, "status": "failed", "error": str(e)})

        server.quit()
        return {"success": True, "results": results}

    except Exception as e:
        return {"success": False, "error": f"SMTP Connection Error: {str(e)}", "trace": traceback.format_exc()}

if __name__ == "__main__":
    try:
        # Read JSON payload from stdin
        input_data = sys.stdin.read()
        payload = json.loads(input_data)
        
        result = send_emails(payload)
        
        # Output result as JSON to stdout
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e), "trace": traceback.format_exc()}))
