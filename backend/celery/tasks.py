import csv
from flask import Flask, jsonify, current_app
from celery import shared_task
import time, os
import flask_excel
from sqlalchemy import column
from backend.models import User, db, Quiz, Chapter, Score
from backend.models import *
from flask import render_template
# from backend.celery.send_mail import send_email
from backend.celery.send_mail import send_email_function

# test task to check celery
@shared_task(ignore_result=False)
def add(x, y):
    time.sleep(10)
    return x + y

# test csv generation task from admin side
@shared_task(bind=True, ignore_result=False)
def create_csv(self):
    try:
        resource = User.query.all()
        column_names = [column.name for column in User.__table__.columns]
        csv_out = flask_excel.make_response_from_query_sets(
            resource,
            column_names=column_names,
            file_type="csv"
        )

        csv_data = csv_out.get_data()
        file_path = "./backend/celery/user_downloads/users.csv"
        with open(file_path, "wb") as file:
            file.write(csv_data)

        return "users.csv"
    except Exception as e:
        self.update_state(state="FAILURE", meta={"error": str(e)})
        raise e

# CSV generation task
@shared_task(bind=True)
def generate_csv(self, user_id):
    try:
        time.sleep(10)
        resource = Score.query.filter_by(user_id=user_id).all()
        column_names = [column.name for column in Score.__table__.columns]
        csv_out = flask_excel.make_response_from_query_sets(
            resource, column_names=column_names, file_type="csv"
        )

        csv_data = csv_out.get_data()
        file_path = f"./backend/celery/user_downloads/your_record_{user_id}.csv"
        with open(file_path, "wb") as file:
            file.write(csv_data)
        return f"your_record_{user_id}.csv"
    except Exception as e:
        self.update_state(state="FAILURE", meta={"error": str(e)})
        raise e

# # MailHog for Celery Beat for Daily reminders
# @shared_task(ignore_result = True)
# def daily_reminder(to, subject, body):
#     send_email(to, subject, body)

# # MailHog for Celery Beat for Monthly reminders
# @shared_task(ignore_result = True)
# def monthly_reminder(to, subject, body):
#     send_email(to, subject, body)

# celery task for daily reminder
@shared_task(ignore_result = True)
def send_daily_reminders():
    try:
        count = 0
        users = User.query.filter(User.active == True).all()

        for user in users:
            # Exclude users with usernames "user01" and "admin"
            if user.username not in ["admin"]:
                count += 1
                print(f"Processing user: {user.email} ({user.username})")
                recent_quizzes = Score.query.filter_by(user_id=user.id).count()
                if recent_quizzes == 0:
                    subject = "Reminder: Attempt the new quiz!"
                    body = f"""
                    <html>
                    <body>
                        <p>Hi {user.full_name},</p>
                        <p>We noticed you haven't visited our platform recently. A new quiz might be waiting for you!</p>
                        <p>Please log in to check it out and improve your skills.</p>
                        <p>Regards,<br>QuizMaster Team</p>
                    </body>
                    </html>
                    """
                    send_email_function(user.email, subject, body)

        # return f"Sent daily reminders to {len(users)} users."
        return f"Sent daily reminders to {count} users."
    except Exception as e:
        return f"Failed to send daily reminders: {str(e)}"

# Task: Generate and send monthly activity reports
@shared_task(ignore_result = True)
def send_monthly_reports():
    try:
        count = 0
        users = User.query.filter(User.active == True).all()

        for user in users:
            if user.username not in ["admin"]:
                count += 1
                quizzes = Score.query.filter_by(user_id=user.id).all()
                total_quizzes = len(quizzes)
                average_score = (
                    sum(q.total_scored for q in quizzes) / total_quizzes if total_quizzes > 0 else 0
                )

                html_content = f"""
                    <html>
                    <body>
                        <h2>Monthly Activity Report</h2>
                        <p>Dear {user.full_name},</p>
                        <p>Here is your activity summary for this month:</p>
                        <table border="1">
                            <tr>
                                <th>Total Quizzes Taken</th>
                                <th>Average Score</th>
                            </tr>
                            <tr>
                                <td>{total_quizzes}</td>
                                <td>{average_score:.2f}%</td>
                            </tr>
                        </table>
                        <p>Keep up the great work!</p>
                    </body>
                    </html>
                """

                subject = "Your Monthly Activity Report"
                send_email_function(user.email, subject, html_content)

        # return f"Sent monthly reports to {len(users)} users."
        return f"Sent monthly reports to {count} users."
    except Exception as e:
        return f"Failed to send monthly reports: {str(e)}"



# # Task: Send daily reminder emails
# @shared_task
# def send_daily_reminders():
#     try:
#         users = User.query.filter(User.active == True).all()

#         for user in users:
#             if (user.username != "admin"):
#                 recent_quizzes = Score.query.filter_by(user_id=user.id).count()
#                 if recent_quizzes == 0:
#                     subject = "Reminder: Attempt the new quiz!"
#                     body = f"""
#                     Hi {user.full_name},

#                     We noticed you haven't visited our platform recently. A new quiz might be waiting for you!
#                     Please log in to check it out and improve your skills.

#                     Regards,
#                     QuizMaster Team
#                     """
#                     send_email_function(user.email, subject, body)
#             else:
#                 continue

#             return f"Sent daily reminders to {len(users)} users."
#     except Exception as e:
#         return f"Failed to send daily reminders: {str(e)}"








# # Task: Send daily reminder emails
# @shared_task
# def send_daily_reminders():
#     users = User.query.filter_by(has_visited=False).all()  # Users who haven't visited
#     for user in users:
#         subject = "Reminder: Attempt the new quiz!"
#         body = f"""
#         Hi {user.name},

#         We noticed you haven't visited our platform recently. A new quiz might be waiting for you!
#         Please log in to check it out and improve your skills.

#         Regards,
#         QuizMaster Team
#         """
#         send_email_function(user.email, subject, body)  # Use your email function

#     return f"Sent daily reminders to {len(users)} users."

# # Task: Generate and send monthly activity reports
# @shared_task
# def send_monthly_reports():
#     users = User.query.all()  # Fetch all users from the database
#     for user in users:
#         # Fetch user's quiz data
#         quizzes = Score.query.filter_by(user_id=user.id).all()
#         total_quizzes = len(quizzes)
#         average_score = (
#             sum(q.score for q in quizzes) / total_quizzes if total_quizzes > 0 else 0
#         )

#         # Generate HTML content for the report
#         html_content = f"""
#             <html>
#             <body>
#                 <h2>Monthly Activity Report</h2>
#                 <p>Dear {user.name},</p>
#                 <p>Here is your activity summary for this month:</p>
#                 <table border="1">
#                     <tr>
#                         <th>Total Quizzes Taken</th>
#                         <th>Average Score</th>
#                     </tr>
#                     <tr>
#                         <td>{total_quizzes}</td>
#                         <td>{average_score:.2f}%</td>
#                     </tr>
#                 </table>
#                 <p>Keep up the great work!</p>
#             </body>
#             </html>
#         """

#         # Send the report via email
#         subject = "Your Monthly Activity Report"
#         send_email_function(user.email, subject, html_content, is_html=True)

#     return f"Sent monthly reports to {len(users)} users."

# @shared_task(bind=True, ignore_result=False)
# def generate_csv(self, id):
#     try:
#         # Query to fetch all quizzes with their related chapter and scores
#         quizzes = Quiz.query.all()

#         quiz_details = []
#         for quiz in quizzes:
#             # Fetching chapter details
#             chapter = Chapter.query.filter_by(id=quiz.chapter_id).first()

#             # Fetching scores related to the quiz
#             scores = Score.query.filter_by(quiz_id=quiz.id).all()

#             # Preparing the response for each quiz
#             quiz_data = {
#                 "quiz_id": quiz.id,
#                 "chapter_id": quiz.chapter_id,
#                 "chapter_name": chapter.name if chapter else None,
#                 "date_of_quiz": quiz.date_of_quiz.strftime('%Y-%m-%d') if quiz.date_of_quiz else None,
#                 "time_duration": str(quiz.time_duration) if quiz.time_duration else None,
#                 "remarks": quiz.remarks,
#                 "scores": [
#                     {
#                         "user_id": score.user_id,
#                         "total_scored": score.total_scored,
#                         "time_stamp": score.time_stamp.strftime('%Y-%m-%d %H:%M:%S') if score.time_stamp else None
#                     }
#                     for score in scores
#                 ]
#             }
#             quiz_details.append(quiz_data)

#         resource = quiz_details
#         column_names = ["quiz_id", "chapter_id", "chapter_name", "date_of_quiz", "time_duration", "remarks", "scores"]
#         csv_out = flask_excel.make_response_from_query_sets(
#             resource,
#             column_names=column_names,
#             file_type="csv"
#         )

#         csv_data = csv_out.get_data()
#         file_path = f"./backend/celery/user_downloads/users_details_{id}.csv"
#         with open(file_path, "wb") as file:
#             file.write(csv_data)

#         return f"users_details_{id}.csv"

#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500