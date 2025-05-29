# import smtplib
# from email.mime.multipart import MIMEMultipart
# from email.mime.text import MIMEText

# SMTP_SERVER = "localhost"
# SMTP_PORT = 1025
# SENDER_EMAIL = "quizmasteradmin@example"
# SENDER_PASSWORD = ""

# def send_email(to, subject, content):
#     msg = MIMEMultipart()
#     msg['To'] = to
#     msg['Subject'] = subject
#     msg['From'] = SENDER_EMAIL

#     msg.attach(MIMEText(content, 'html'))

#     with smtplib.SMTP(host=SMTP_SERVER, port=SMTP_PORT) as client:
#         client.send_message(msg)
#         client.quit()

# send_email('user01@example', 'Test Email', '<h1>Welcome to AppDev</h1>')

import os
import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from email.mime.text import MIMEText

def send_email_function(recipient_email, subject, body):
    smtp_server = 'smtp.gmail.com'
    smtp_port = 465
    sender_email = "sayan.bhowmick23@gmail.com"
    password = "euuwyhmbosedxnhj"
    context = ssl.create_default_context()

    # Construct the email message
    msg = MIMEMultipart()
    display_name = 'QuizMaster'
    msg['From'] = f"{display_name} <{sender_email}>"
    msg['To'] = recipient_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'html'))
    # context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context) as server:
            server.login(sender_email, password)
            # server.send_message(sender_email, recipient_email, msg.as_string())
            server.send_message(msg, to_addrs=[recipient_email])
        print(f"Email sent to {recipient_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")



# import os
# import smtplib, ssl
# from email.mime.multipart import MIMEMultipart
# from email.mime.text import MIMEText

# smtp_server = 'smtp.gmail.com'
# smtp_port = 465

# sender_email = 'sayan.bhowmick23@gmail.com'
# password = 'euuwyhmbosedxnhj'

# def send_email_function(recipient_email, subject, body, is_html=False):
#     try:
#         context = ssl.create_default_context()

#         # Create the email message
#         msg = MIMEMultipart()
#         msg['From'] = sender_email
#         msg['To'] = recipient_email
#         msg['Subject'] = subject

#         # Add plain text or HTML body
#         if is_html:
#             msg.attach(MIMEText(body, 'html'))
#         else:
#             msg.attach(MIMEText(body, 'plain'))

#         # Send the email via SMTP server
#         with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context) as server:
#             server.login(sender_email, password)
#             server.send_message(msg)

#         print(f"Email sent to {recipient_email}")

#     except Exception as e:
#         print(f"Failed to send email to {recipient_email}: {e}")


# import os
# import smtplib, ssl
# from email.mime.multipart import MIMEMultipart
# from email.mime.base import MIMEBase
# from email import encoders
# from email.mime.text import MIMEText

# smtp_server = 'smtp.gmail.com'
# smtp_port = 465
# sender_email = ''
# password = 'euuwyhmbosedxnhj'

# context = ssl.create_default_context()

# recipient_email = ''

# msg = MIMEMultipart()
# display_name = 'QuizMaster'
# msg['From'] = f'{display_name}'
# msg['To'] = recipient_email
# msg['Subject'] = 'Reminder: Dummy testing'

# reply_to_email = ''
# msg.add_header('Reply-To', reply_to_email)

# body = f"""
#             <html>
#             <body>
#                 <p>Dear name</p>
#                 <p><b>Please find attached your recently attempted exam performance:</b></p>
#                 <table style="width:100%">
#                     <tr>
#                         <td>Test ID</td>
#                         <td>Chapter Name</td>
#                         <td>Submission Time</td>
#                         <td>Score</td>
#                     </tr>
#                     <td>1</td>
#                     <td>dummy</td>
#                         <td>00-00-0000 00.00.00</td>
#                         <td>50%</td>
#                 </table>
#             </body>
#             </html>
#         """
# msg.attach(MIMEText(body, 'html'))

# try:
#   with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context) as server:
#     server.login(sender_email, password)
#     server.send_message(msg, to_addrs=[recipient_email])

#     print(f'Email sent to {recipient_email}')

# except Exception as e:
#   print(f'Failed to send email: {e}')

