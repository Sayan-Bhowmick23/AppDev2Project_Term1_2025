from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from backend.models import *
from werkzeug.security import generate_password_hash, check_password_hash
from flask_bcrypt import Bcrypt

from flask import current_app as app, jsonify, render_template,  request, send_file
from flask_security import auth_required, verify_password, hash_password, current_user, auth_token_required, current_user
from flask_security import roles_accepted, roles_required
from datetime import datetime

from backend.celery.tasks import add, create_csv, generate_csv
# from backend.celery.tasks import add, create_csv
from celery.result import AsyncResult

datastore = app.security.datastore

cache = app.cache

# cache testing route
@app.get("/cache_test")
@cache.cached(timeout = 5)
def cache_test():
    return jsonify({"date": datetime.now()})

# celery testing route
@app.get("/celery")
def celery():
    task = add.delay(10,20)
    return {"task_id" : task.id}, 200

# celery test async job with task_id
@app.get("/getData/<id>")
def getData(id):
    result = AsyncResult(id)
    if result.ready():
        return {"result": result.result}, 200
    else:
        return {"message": "Task not ready yet"}, 405

# CSV generation route
@app.route("/generate_CSV", methods=["GET"])
# @auth_required("token")
# @roles_required("user")
def generate_CSV():
    user_id = current_user.id
    task = generate_csv.delay(user_id)
    return jsonify({"task_id": task.id}), 202

# Generated CSV to the client for viewing & downloading
@app.get("/get_CSV/<id>")
# @auth_required("token")`
# @roles_required("user")`
def get_CSV(id):
    result = AsyncResult(id)
    print(result.status)
    if result.ready():
        if result.successful():
            file_path = f"./backend/celery/user_downloads/{result.result}"
            return send_file(
                file_path,
                as_attachment=True,
                mimetype="text/csv",
                max_age=0
            ), 200
        else:
            return {"message": "Task failed", "error": str(result.info)}, 500
    else:
        return {"message": "Task not ready yet"}, 202

# home route
@app.get("/")
def home():
    return render_template("index.html") 
    # return "Hello From Home"

# test route to check token based authentication
@app.get("/test_route")
@auth_required('token')
@roles_accepted("admin", "user")
def test_route():
    # return render_template('test.html')  
    return jsonify({
        "message": "You are authorised to be here",
        "email": current_user.email,
        "role": current_user.roles[0].name,
        "id": current_user.id,    
        "username": current_user.username,
        "full_name": current_user.full_name,
        "qualification": current_user.qualification,
        "dob": current_user.dob    
        }), 200

# login route
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "invalid inputs"}), 400
    
    user = datastore.find_user(email=email)
    
    if not user:
        return jsonify({"message": "user not found"}), 404
    
    if not check_password_hash(user.password, password):
        return jsonify({"message": "invalid password"}), 400
    login_user(user)
    return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name, "id": user.id}), 200

# logout route
@app.route("/logout", methods=["POST"])
@login_required
@auth_required('token')
@roles_accepted("admin", "user")
def logout():
    logout_user()
    return jsonify({
        "message": "Logged out successfully"
    }) ,200
# register route
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    username = data.get("username")
    full_name = data.get("full_name")
    qualification = data.get("qualification")
    dob = data.get("dob")
    role = data.get("role")

    dob = datetime.strptime(dob, "%Y-%m-%d").date()

    if not email or not password or not username or role not in ["user"]:
        return jsonify({"message": "invalid inputs"}), 400

    user = datastore.find_user(email=email)

    if user:
        return jsonify({"message": "user already exists"}), 400
    
    try:
        user = datastore.create_user(email=email, password=generate_password_hash(password), username=username, 
                                     full_name=full_name, qualification=qualification, dob=dob, roles=[role])
        datastore.add_role_to_user(user, role)
        db.session.commit()
        return jsonify({"message": "user created"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "error creating user"}), 500

# admin dashboard route
@app.route("/admin_dashboard", methods=["GET"])
@auth_required('token')
@roles_required('admin')
def admin_dashboard():
    if request.method == 'GET':
        response_body = {'message': 'Hello admin!'}
        return jsonify(response_body)
    elif request.method == 'POST':
        # Extract JSON data from the request body
        data = request.get_json()
        response_object = {'status': 'success', 'data': data}
        return jsonify(response_object), 201
    # return "<h1>Admin Dashboard</h1>"

# user dashboard route
@app.route("/user_dashboard", methods=["GET"])
@auth_required('token')
@roles_required('user')
def user_dashboard():
    return 200

# subject route
@app.route("/create_subject", methods=["POST"])
@auth_required('token')
@roles_required('admin')
def create_subject():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")
    if not name or not description:
        return jsonify({"message": "invalid inputs"}), 400
    try:
        subject = Subject(name=name, description=description)
        db.session.add(subject)
        db.session.commit()
        return jsonify({"message": "subject created"}), 201
    except Exception as e:
        db.session.rollback()
        print("Error creating subject:", e)  # Log the error
        return jsonify({"message": "error creating subject"}), 500

# delete subject route
@app.route("/delete_subject/<int:subject_id>", methods=["DELETE"])
@auth_required('token')
@roles_required('admin')
def delete_subject(subject_id):
    # print(current_user.roles[0].name)
    subject = Subject.query.get(subject_id)
    # print(subject)
    if subject:
        db.session.delete(subject)
        db.session.commit()
        return "", 200
    else:
        return "", 404

# update subject route
@app.route("/update_subject/<int:subject_id>", methods=["PUT"])
@auth_required('token')
@roles_required('admin')
def update_subject(subject_id):
    data = request.get_json()
    subject = Subject.query.get(subject_id)
    if subject:
        if data.get("name"):
            subject.name = data.get("name", subject.name)
        if data.get("description"):
            subject.description = data.get("description", subject.description)
        db.session.commit()
        return jsonify({"message": "subject updated"}), 200
    else:
        return jsonify({"message": "subject not found"}), 404        

# get subject based on a subject id
@app.route("/get_subject/<int:subject_id>", methods=["GET"])
def get_subject(subject_id):
    subject = Subject.query.get(subject_id)
    if subject:
        return jsonify({"name": subject.name, "description": subject.description}), 200
    else:
        return jsonify({"message": "subject not found"}), 404

# chapter adding route
@app.route("/create_chapter/<int:subject_id>", methods=["POST"])
@auth_required('token')
@roles_required('admin')
def create_chapter(subject_id):
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")

    if not subject_id or not name or not description:
        return jsonify({"message": "invalid inputs"}), 400
    else:
        try:
            chapter = Chapter(subject_id=subject_id, name=name, description=description)
            db.session.add(chapter)
            db.session.commit()
            return jsonify({"message": "chapter created"}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "error creating chapter"}), 500        

# get a chapter by id
@app.route("/get_chapter/<int:chapter_id>", methods=["GET"])
def get_chapter(chapter_id):
    chapter = Chapter.query.get(chapter_id)
    if chapter:
        subject = Subject.query.filter_by(id=chapter.subject_id).first()
        # print(chapter.name)
        return jsonify({"id": chapter.id, "subjectId": chapter.subject_id, 
                        "name": chapter.name, "description": chapter.description}), 200
    else:
        return jsonify({"message": "chapter not found"}), 404

# chapter updating route
@app.route("/update_chapter/<int:chapter_id>", methods=["PUT"])
@auth_required('token')
@roles_required('admin')
def update_chapter(chapter_id):
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")
    
    # Query chapter filtering by both chapter_id and subject_id
    chapter = Chapter.query.filter_by(id=chapter_id).first()
    
    if not chapter:
        return jsonify({"message": "Chapter not found for the given subject"}), 404

    try:
        if name:
            chapter.name = name
        if description:
            chapter.description = description
        db.session.commit()
        return jsonify({"message": "Chapter updated"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating chapter", "error": str(e)}), 500

# chapter delete route
@app.route("/delete_chapter/<int:chapter_id>", methods=["DELETE"])
@auth_required('token')
@roles_required('admin')
def delete_chapter(chapter_id):
    chapter = Chapter.query.get(chapter_id)
    if chapter:
        db.session.delete(chapter)
        db.session.commit()
        return "", 200
    else:
        return "", 404

# getting chapters using subject ids
@app.route("/get_chapters/<int:subject_id>", methods=["GET"])
def get_chapters(subject_id):
    chapters = Chapter.query.filter_by(subject_id=subject_id).all()
    if chapters:
        response = []
        for chapter in chapters:
            response.append({
                "id": chapter.id,
                "subject_id": chapter.subject_id,
                "name": chapter.name,
                "description": chapter.description
            })
        return jsonify(response), 200
    else:
        return jsonify({"message": "No chapters found for the given subject"}
                       ), 404

# getting quizzes using chapter ids
@app.route("/get_quizzes/<int:chapter_id>", methods=["GET"])
def get_quizzes(chapter_id):
    quizzes = Quiz.query.filter_by(chapter_id=chapter_id).all()
    if quizzes:
        response = []
        for quiz in quizzes:
            response.append({
                "id": quiz.id,
                "chapter_id": quiz.chapter_id,
                "date_of_quiz": quiz.date_of_quiz.strftime("%Y-%m-%d"),
                "time_duration": str(quiz.time_duration),
                "remarks": quiz.remarks
            })
        return jsonify(response), 200
    else:
        return jsonify({"message": "No quizzes found for the given chapter"}), 404

# quiz adding route
@app.route("/create_quiz/<int:chapter_id>", methods=["POST"])
@auth_required('token')
@roles_required('admin')
def create_quiz(chapter_id):
    data = request.get_json()

    date_of_quiz = data.get("date_of_quiz")
    time_duration = data.get("time_duration")
    remarks = data.get("remarks")

    if date_of_quiz:
        date_of_quiz = datetime.strptime(date_of_quiz, "%Y-%m-%d").date()
    else:
        date_of_quiz = None

    if time_duration:
        time_duration = datetime.strptime(time_duration, "%H:%M:%S").time()
    else:
        time_duration = None

    if not remarks:
        remarks = None    

    if not chapter_id:
        return jsonify({"message": "invalid inputs"}), 400

    try:
        quiz = Quiz(chapter_id=chapter_id, date_of_quiz=date_of_quiz, time_duration=time_duration, remarks=remarks)
        db.session.add(quiz)
        db.session.commit()
        return jsonify({"message": "quiz created"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "error creating quiz"}), 500

# delete quiz route
@app.route("/delete_quiz/<int:quiz_id>", methods=["DELETE"])
@auth_required('token')
@roles_required('admin')
def delete_quiz(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if quiz:
        db.session.delete(quiz)
        db.session.commit()
        return "", 200
    else:
        return "", 404

# get quiz route
@app.route("/get_quiz/<int:quiz_id>", methods=["GET"])
def get_quiz(quiz_id):
    try:
        quiz = Quiz.query.get_or_404(quiz_id)
        return jsonify({
            "id": quiz.id,
            "chapter_id": quiz.chapter_id,
            "date_of_quiz": quiz.date_of_quiz.strftime("%Y-%m-%d"),
            "time_duration": str(quiz.time_duration),
            "remarks": quiz.remarks
        }), 200
    except Exception as e:
        return jsonify({
            "error": "Database error",
            "message": str(e)
        }), 500


# update quiz route
@app.route("/update_quiz/<int:quiz_id>", methods=["PUT"])
@auth_required('token')
@roles_required('admin')
def update_quiz(quiz_id):
    data = request.get_json()
    date_of_quiz = data.get("date_of_quiz")
    time_duration = data.get("time_duration")
    remarks = data.get("remarks") or None
    # Query quiz filtering by both quiz_id and chapter_id
    quiz = Quiz.query.filter_by(id=quiz_id).first()
    if not quiz:
        return jsonify({"message": "Quiz not found for the given chapter"}), 404
    try:
        if date_of_quiz:
            quiz.date_of_quiz = datetime.strptime(date_of_quiz, "%Y-%m-%d").date()
        if time_duration:
            quiz.time_duration = datetime.strptime(time_duration, "%H:%M:%S").time()
        quiz.remarks = remarks
        db.session.commit()
        return jsonify({"message": "Quiz updated"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating quiz", "error": str(e)}), 500

# Question adding route
@app.route("/create_question/<int:quiz_id>", methods=["POST"])
@auth_required('token')
@roles_required('admin')
def create_question(quiz_id):
    data = request.get_json()

    question_statement = data.get("question_statement")
    option1 = data.get("option1")
    option2 = data.get("option2")
    option3 = data.get("option3")
    option4 = data.get("option4")
    correct_option = data.get("correct_option")

    if not quiz_id or not question_statement or not option1 or not option2 or not option3 or not option4 or not correct_option:
        return jsonify({"message": "invalid inputs"}), 400
    
    try:
        question = Question(quiz_id=quiz_id, question_statement=question_statement, 
                            option1=option1, option2=option2, option3=option3, 
                            option4=option4, correct_option=correct_option)
        db.session.add(question)
        db.session.commit()
        return jsonify({"message": "question created"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "error creating question"}), 500

# get question route
@app.route("/get_question/<int:question_id>", methods=["GET"])
def get_question(question_id):
    try:
        question = Question.query.get_or_404(question_id)
        return jsonify({
            "id": question.id,
            "quiz_id": question.quiz_id,  
            "question_statement": question.question_statement,
            "option1": question.option1,
            "option2": question.option2,
            "option3": question.option3,
            "option4": question.option4,
            "correct_option": question.correct_option
        }), 200
    except Exception as e:
        return jsonify({
            "error": "Database error",
            "message": str(e)  
        }), 500

# update question route
@app.route("/update_question/<int:question_id>", methods=["PUT"])
@auth_required('token')
@roles_required('admin')
def update_question(question_id):
    data = request.get_json()
    question_statement = data.get("question_statement") or None
    option1 = data.get("option1") or None
    option2 = data.get("option2") or None
    option3 = data.get("option3") or None
    option4 = data.get("option4") or None
    correct_option = data.get("correct_option") or None

    # Query question
    question = Question.query.get(question_id)
    if not question:
        return jsonify({"message": "Question not found"}), 404
    try:
        if question_statement:
            question.question_statement = question_statement
        if option1:
            question.option1 = option1
        if option2:
            question.option2 = option2
        if option3:
            question.option3 = option3
        if option4:
            question.option4 = option4
        if correct_option:
            question.correct_option = correct_option
        db.session.commit()
        return jsonify({"message": "Question updated"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating question"}), 500

# delete question route
@app.route("/delete_question/<int:question_id>", methods=["DELETE"])
@auth_required('token')
@roles_required('admin')
def delete_question(question_id):
    try:
        question = Question.query.get_or_404(question_id)
        db.session.delete(question)
        db.session.commit()
        return jsonify({"message": "Question deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting question"}), 500

# getting questions using quiz id
@app.route("/get_questions/<int:quiz_id>", methods=["GET"])
def get_questions(quiz_id):
    questions = Question.query.filter_by(quiz_id=quiz_id).all()
    if questions:
        response = []
        for question in questions:
            response.append({
                "id": question.id,
                "quiz_id": question.quiz_id,
                "question_statement": question.question_statement,
                "option1": question.option1,
                "option2": question.option2,
                "option3": question.option3,
                "option4": question.option4,
                "correct_option": question.correct_option
            })
        return jsonify(response), 200
    else:
        return jsonify({"message": "No questions found for the given quiz"}), 404

# get all detals of a quiz for any user
@auth_required('token')
@roles_required('user')
@app.get("/get_quiz_all_details/<int:quiz_id>")
def get_quiz_all_details(quiz_id):
    try:
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return jsonify({"message": "Quiz not found"}), 404
        chapter = Chapter.query.filter_by(id=quiz.chapter_id).first()
        if not chapter:
            return jsonify({"message": "Chapter not found for quiz"}), 404
        subject = Subject.query.filter_by(id=chapter.subject_id).first()
        if not subject:
            return jsonify({"message": "Subject not found for chapter"}), 404
        questions = Question.query.filter_by(quiz_id=quiz_id).all()
        if not questions:
            return jsonify({"message": "No questions found for the quiz"}), 404
        number_of_questions = len(questions)
        # print(number_of_questions)
        # print(questions)
        return jsonify([{
            "id": quiz.id,
            "date_of_quiz": quiz.date_of_quiz.isoformat() if isinstance(quiz.date_of_quiz, datetime) else str(quiz.date_of_quiz),
            "time_duration": str(quiz.time_duration),
            "remarks": quiz.remarks,
            "chapter_id": chapter.id,
            "chapter_name": chapter.name,
            "subject_id": subject.id,
            "subject_name": subject.name,
            "number_of_questions": number_of_questions,
        }]), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching quiz details: {str(e)}"}), 500

# Get all quizzes for any user
@auth_required('token')
@roles_required('user')
@app.get("/get_all_quizzes")
def get_all_quizzes():
    try:
        quizzes = Quiz.query.all()
        response = []
        user = User.query.get(current_user.id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        attempted_quiz_ids = {score.quiz_id for score in Score.query.filter_by(user_id=user.id).all()}

        for quiz in quizzes:
            if quiz.id in attempted_quiz_ids:
                continue
            chapter = Chapter.query.filter_by(id=quiz.chapter_id).first()
            if not chapter:
                return jsonify({"message": f"Chapter not found for quiz {quiz.id}"}), 404
            subject = Subject.query.filter_by(id=chapter.subject_id).first()
            if not subject:
                return jsonify({"message": f"Subject not found for chapter {chapter.id}"}), 404
            response.append({
                "id": quiz.id,
                "subject_name": subject.name,
                "chapter_name": chapter.name,
                "date_of_quiz": quiz.date_of_quiz.isoformat() if isinstance(quiz.date_of_quiz, datetime) else str(quiz.date_of_quiz),
                "time_duration": str(quiz.time_duration),
                "remarks": quiz.remarks
            })
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"message": f"Error fetching quizzes: {str(e)}"}), 500


# get questions for a particular quiz (for user)
@auth_required('token')
@roles_required('user')
@app.get("/get_questions/<int:quiz_id>")
def get_questions_for_quiz(quiz_id):
    try:
        questions = Question.query.filter_by(quiz_id=quiz_id).all()
        if not questions:
            return jsonify({"message": "No questions found for the given quiz"}), 404
        response = []
        for question in questions:
            response.append({
                "id": question.id,
                "quiz_id": question.quiz_id,
                "question_statement": question.question_statement,
                "option1": question.option1,
                "option2": question.option2,
                "option3": question.option3,
                "option4": question.option4,
                "correct_option": question.correct_option
            })
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching questions: {str(e)}"}), 500

# get_time_duration for a specific quiz
@auth_required('token')
@roles_required('user')
@app.route("/get_time_duration/<int:quiz_id>", methods=["GET"])
def get_time_duration(quiz_id):
    try:
        quiz = Quiz.query.get(quiz_id)
        # print(quiz.time_duration)
        # print(type(quiz.time_duration))
        if not quiz:
            return jsonify({"message": "Quiz not found"}), 404
        time_obj = quiz.time_duration
        total_seconds = (time_obj.hour * 3600) + (time_obj.minute * 60) + time_obj.second
        return jsonify({"time_duration": total_seconds}), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching time duration: {str(e)}"}), 500


# Endpoint to handle quiz submission
@app.route('/submit_quiz', methods=['POST'])
@auth_required('token')
@roles_required('user')
def submit_quiz():
    data = request.get_json()
    quiz_id = data.get('quizId')
    user_answers = data.get('userAnswers', [])

    user_id = current_user.id
    # print(user_id)

    questions = Question.query.filter_by(quiz_id=quiz_id).all()

    score = 0

    for i, question in enumerate(questions):
        if i < len(user_answers):
            answer_index = user_answers[i]
            # print(answer_index)
            selected_answer = None
            if answer_index == 0:
                selected_answer = question.option1
            elif answer_index == 1:
                selected_answer = question.option2
            elif answer_index == 2:
                selected_answer = question.option3
            elif answer_index == 3:
                selected_answer = question.option4
            print(question.correct_option)
            if selected_answer == question.correct_option:
                score += 1
                # print(score)

    new_score = Score(quiz_id=quiz_id, user_id=user_id, total_scored=score)
    db.session.add(new_score)
    db.session.commit()

    # Return the result to the frontend
    return jsonify({"score": score}), 200

# get scores for a specific quiz for a specific user
@auth_required('token')
@roles_required('user')
@app.route("/get_scores/<int:quiz_id>", methods=["GET"])
def get_scores(quiz_id):
    try:
        scores = Score.query.filter_by(quiz_id=quiz_id, user_id=current_user.id).all()
        if not scores:
            return jsonify({"message": "No scores found for the given quiz"}), 404
        response = []
        for score in scores:
            response.append({
                "id": score.id,
                "quiz_id": score.quiz_id,
                "user_id": score.user_id,
                "total_scored": score.total_scored,
                "time_stamp": score.time_stamp.isoformat() if isinstance(score.time_stamp, datetime) else str(score.time_stamp)
            })
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching scores: {str(e)}"}), 500

# search for a specific user
@auth_required('token')
@roles_required('admin')
@app.route("/search", methods=["POST"])
def search():
    data = request.get_json()
    key = data.get("searchTerm")
    if not key:
        return jsonify({"message": "invalid inputs"}), 400
    try:
        users = User.query.filter(User.email.contains(key) | User.username.contains(key) | User.full_name.contains(key)).all()
        if not users:
            return jsonify({"message": "No users found"}), 404
        response = []
        for user in users:
            response.append({
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "full_name": user.full_name,
                "qualification": user.qualification,
                "dob": user.dob.isoformat() if isinstance(user.dob, datetime) else str(user.dob)
            })
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching users: {str(e)}"}), 500
    
# search for quizzes for a specific user
@auth_required('token')
@roles_required('user')
@app.route("/search_subject", methods=["POST"])
def search_quiz():
    data = request.get_json()
    key = data.get("searchTerm")
    if not key:
        return jsonify({"message": "invalid inputs"}), 400
    try:
        subjects = Subject.query.filter(Subject.name.contains(key)).all()
        if not subjects:
            return jsonify({"message": "No quizzes found"}), 404
        response = []
        for subject in subjects:
            response.append({
                "id": subject.id,
                "name": subject.name,
                "description": subject.description,
            })
        return jsonify(response), 200
    except Exception as e:
            return jsonify({"message": f"Error fetching quizzes: {str(e)}"}), 500

# previousAttempts for any specific user
@auth_required('token')
@roles_required('user')
@app.route("/previousAttempts", methods=["GET"])
def previous_attempts():
    try:
        scores = Score.query.filter_by(user_id=current_user.id).all()
        user = User.query.get(current_user.id)
        if not scores:
            return jsonify({"message": "No scores found for the user"}), 404
        response = []
        for score in scores:
            quizzes = Quiz.query.filter_by(id=score.quiz_id).first()
            if not quizzes:
                return jsonify({"message": "No quizzes found for the user"}), 404
            chapters = Chapter.query.filter_by(id=quizzes.chapter_id).first()
            if not chapters:
                return jsonify({"message": "No chapters found for the user"}), 404
            subjects = Subject.query.filter_by(id=chapters.subject_id).first()
            if not subjects:
                return jsonify({"message": "No subjects found for the user"}), 404
            questions = Question.query.filter_by(quiz_id=score.quiz_id).all()
            if not questions:
                return jsonify({"message": "No questions found for the user"}), 404
            number_of_questions = len(questions)
            # print(number_of_questions)
            response.append({
                "id": score.id,
                "user_id": score.user_id,
                "quiz_id": score.quiz_id,
                "user_name": user.full_name,
                "subject_name": subjects.name,
                "chapter_name": chapters.name,
                "date_of_quiz": quizzes.date_of_quiz.isoformat() if isinstance(quizzes.date_of_quiz, datetime) else str(quizzes.date_of_quiz),
                "time_duration": str(quizzes.time_duration),
                "total_scored": score.total_scored,
                "time_stamp": score.time_stamp.isoformat() if isinstance(score.time_stamp, datetime) else str(score.time_stamp),
                "number_of_questions": number_of_questions,
            })
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching scores: {str(e)}"}), 500

# get user performance for chart viewing in the front end
@auth_required('token')
@roles_required('user')
@app.route('/user_performance', methods=['GET'])
def get_user_performance():
    user = User.query.get(current_user.id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    scores = Score.query.filter_by(user_id=current_user.id).all()
    performance_data = []

    for score in scores:
        quiz = Quiz.query.get(score.quiz_id)
        if quiz:
            performance_data.append({
                "quiz_name": f"Quiz {quiz.id}",
                "total_scored": score.total_scored,
                "date_of_quiz": quiz.date_of_quiz.isoformat() if quiz.date_of_quiz else None
            })

    return jsonify(performance_data), 200

# admin dashboard summary page (caching applied)
@auth_required('token')
@roles_required('admin')
@app.get('/admin_dashboard_data')
@cache.cached(timeout = 60)
def get_admin_dashboard_data():
    try:
        total_users = User.query.count()
        users_attempting_quizzes = db.session.query(Score.user_id).distinct().count()
        dashboard_data = {
            "total_users": total_users,
            "users_attempting_quizzes": users_attempting_quizzes
        }
        return jsonify(dashboard_data), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
