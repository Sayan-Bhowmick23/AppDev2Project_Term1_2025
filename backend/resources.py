from flask import request, jsonify
from flask_caching import Cache
from flask_restful import Resource, abort, fields, marshal_with, Api
from backend.models import *
from flask_security import hash_password
from datetime import datetime
from flask_security import auth_required, roles_accepted, roles_required
from flask import current_app as app

api = Api(prefix="/api")

user_fields = {
    'id': fields.Integer,
    'email': fields.String,
    'username': fields.String,
    'full_name': fields.String,
    'qualification': fields.String,
    'dob': fields.String,
    'role': fields.List(fields.String)
}
subject_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
}
chapter_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'subject_id': fields.Integer,
    'description': fields.String,
}
quiz_fields = {
    'id': fields.Integer,
    'date_of_quiz': fields.String,
    'time_duration': fields.String,
    'chapter_id': fields.Integer,
    'remarks': fields.String,
}
question_fields = {
    'id': fields.Integer,
    'question_statement': fields.String,
    'option1': fields.String,
    'option2': fields.String,
    'option3': fields.String,
    'option4': fields.String,
    'correct_option': fields.String,
    'quiz_id': fields.Integer,
}

class UserResource(Resource):
    @auth_required("token")
    @roles_required("admin")
    @marshal_with(user_fields)
    def get(self):
        users = User.query.all()
        if not users:
            abort(404, description="No users found")
        return users
    
    @auth_required("token")
    @roles_required("admin")
    @marshal_with(user_fields)
    def put(self, user_id):
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        email = data.get('email')
        username = data.get('username')
        full_name = data.get('full_name')
        qualification = data.get('qualification')
        dob = data.get('dob')
        if email: 
            user.email = email
        if username:
            user.username = username
        if full_name:
            user.full_name = full_name
        if qualification:
            user.qualification = qualification
        if dob:
            user.dob = dob                    
        # user.email = request.json.get('email', user.email)
        # user.username = request.json.get('username', user.username)
        # user.full_name = request.json.get('full_name', user.full_name)
        # user.qualification = request.json.get('qualification', user.qualification)
        # user.dob = request.json.get('dob', user.dob)
        db.session.commit()
        return user, 200

class SubjectListResource(Resource):  
    @auth_required("token")
    @roles_required("admin")  
    @marshal_with(subject_fields)
    def get(self):
        subjects = Subject.query.all()
        if not subjects:
            abort(404, description="No subjects found")
        return subjects, 200   

class ChapterListResource(Resource):
    @auth_required("token")
    @roles_required("admin")
    @marshal_with(chapter_fields)   
    def get(self):
        chapters = Chapter.query.all()
        if not chapters:
            abort(404, description="No chapters found")
        return chapters, 200

class QuizListResource(Resource):
    @auth_required("token")
    @roles_accepted("admin", "user")
    @marshal_with(quiz_fields)
    def get(self):
        quizzes = Quiz.query.all()
        if not quizzes:
            abort(404, description="No quizzes found")
        return quizzes, 200

class QuestionsListResource(Resource):
    @auth_required("token")
    @roles_required("admin")
    @marshal_with(question_fields)
    def get(self):
        questions = Question.query.all()
        if not questions:
            abort(404, description="No questions found")
        return questions, 200

# Register the resource for both collection and individual endpoints.
# GET and POST will work with /users and GET, PUT, DELETE will work with /users/<int:user_id>
api.add_resource(UserResource, "/users", "/users/<int:user_id>")
api.add_resource(SubjectListResource, "/subjects", "/subjects/<int:subject_id>")
api.add_resource(ChapterListResource, "/chapters", "/chapters/<int:chapter_id>")
api.add_resource(QuizListResource, "/quizzes", "/quizzes/<int:quiz_id>")
api.add_resource(QuestionsListResource, "/questions" , "/questions/<int:quiz_id>")