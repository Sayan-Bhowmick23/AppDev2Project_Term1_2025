from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    qualification = db.Column(db.String(100))
    dob = db.Column(db.Date)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    active = db.Column(db.Boolean, default=True)
    roles = db.relationship('Role', secondary='user_roles', backref='bearers', cascade='all, delete')
    scores = db.relationship('Score', backref='user', cascade='all, delete', lazy=True)

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=False)

class UserRoles(db.Model):
    __tablename__ = 'user_roles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)

class Subject(db.Model):
    __tablename__ = 'subject'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    chapters = db.relationship('Chapter', backref='subject', cascade='all, delete-orphan')

class Chapter(db.Model):
    __tablename__ = 'chapter'
    id = db.Column(db.Integer, primary_key=True)
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    quizzes = db.relationship('Quiz', backref='chapter', cascade='all, delete-orphan')

class Quiz(db.Model):
    __tablename__ = 'quiz'
    id = db.Column(db.Integer, primary_key=True)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapter.id', ondelete='CASCADE'), nullable=False)
    date_of_quiz = db.Column(db.Date)
    time_duration = db.Column(db.Time)
    remarks = db.Column(db.Text)
    questions = db.relationship('Question', backref='quiz', cascade='all, delete-orphan')
    scores = db.relationship('Score', backref='quiz', cascade='all, delete-orphan')

class Question(db.Model):
    __tablename__ = 'question'
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id', ondelete='CASCADE'), nullable=False)
    question_statement = db.Column(db.Text, nullable=False)
    option1 = db.Column(db.String(255))
    option2 = db.Column(db.String(255))
    option3 = db.Column(db.String(255))
    option4 = db.Column(db.String(255))
    correct_option = db.Column(db.String(255))

class Score(db.Model):
    __tablename__ = 'score'
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    time_stamp = db.Column(db.DateTime, default=datetime.utcnow)
    total_scored = db.Column(db.Integer)
























# from flask_sqlalchemy import SQLAlchemy
# from datetime import datetime
# from flask_security import UserMixin, RoleMixin

# # Initialize the SQLAlchemy object
# db = SQLAlchemy()

# # User model
# class User(db.Model, UserMixin):  # UserMixin is a class that provides default implementations for the methods that Flask-Security relies on.
#     __tablename__ = 'user'
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(100), unique=True, nullable=False)
#     username = db.Column(db.String(50), unique=True, nullable=False)
#     password = db.Column(db.String(255), nullable=False)
#     full_name = db.Column(db.String(100), nullable=False)
#     qualification = db.Column(db.String(100))
#     dob = db.Column(db.Date)

#     # flask security specific
#     fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
#     active = db.Column(db.Boolean, default=True)
#     roles = db.relationship('Role', secondary='user_roles', backref='bearers', cascade='all, delete')

#     # Relationship to scores with cascade
#     scores = db.relationship('Score', backref='user', cascade='all, delete', lazy=True)

# # Role model
# class Role(db.Model, RoleMixin):  # RoleMixin is a class that provides default implementations for the methods that Flask-Security relies on.
#     __tablename__ = 'role'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(50), unique=True, nullable=False)
#     description = db.Column(db.String(255), nullable=False)

# # UserRole model
# class UserRoles(db.Model):
#     __tablename__ = 'user_roles'
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
#     role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)

# # Subject model
# class Subject(db.Model):
#     __tablename__ = 'subject'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), unique=True, nullable=False)
#     description = db.Column(db.Text)

# # Chapter model
# class Chapter(db.Model):
#     __tablename__ = 'chapter'
#     id = db.Column(db.Integer, primary_key=True)
#     subject_id = db.Column(db.Integer, db.ForeignKey('subject.id', ondelete='CASCADE'), nullable=False)
#     name = db.Column(db.String(100), nullable=False)
#     description = db.Column(db.Text)

# # Quiz model
# class Quiz(db.Model):
#     __tablename__ = 'quiz'
#     id = db.Column(db.Integer, primary_key=True)
#     chapter_id = db.Column(db.Integer, db.ForeignKey('chapter.id', ondelete='CASCADE'), nullable=False)
#     date_of_quiz = db.Column(db.Date)
#     time_duration = db.Column(db.Time)
#     remarks = db.Column(db.Text)

# # Question model
# class Question(db.Model):
#     __tablename__ = 'question'
#     id = db.Column(db.Integer, primary_key=True)
#     quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id', ondelete='CASCADE'), nullable=False)
#     question_statement = db.Column(db.Text, nullable=False)
#     option1 = db.Column(db.String(255))
#     option2 = db.Column(db.String(255))
#     option3 = db.Column(db.String(255))
#     option4 = db.Column(db.String(255))
#     correct_option = db.Column(db.String(255))

# # Score model
# class Score(db.Model):
#     __tablename__ = 'score'
#     id = db.Column(db.Integer, primary_key=True)
#     quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
#     time_stamp = db.Column(db.DateTime, default=datetime.utcnow)
#     total_scored = db.Column(db.Integer)






















# # from flask_sqlalchemy import SQLAlchemy
# # from datetime import datetime
# # from flask_security import UserMixin, RoleMixin

# # # Initialize the SQLAlchemy object
# # db = SQLAlchemy()

# # # # Admin model
# # # class Admin(db.Model):
# # #     __tablename__ = 'admin'
# # #     id = db.Column(db.Integer, primary_key=True)
# # #     username = db.Column(db.String(50), unique=True, nullable=False)
# # #     password = db.Column(db.String(255), nullable=False)
# # #     full_name = db.Column(db.String(100), nullable=False)

# # # User model
# # class User(db.Model, UserMixin): # UserMixin is a class that provides default implementations for the methods that Flask-Security relies on.
# #     __tablename__ = 'user'
# #     id = db.Column(db.Integer, primary_key=True)
# #     email = db.Column(db.String(100), unique=True, nullable=False)
# #     username = db.Column(db.String(50), unique=True, nullable=False)
# #     password = db.Column(db.String(255), nullable=False)
# #     full_name = db.Column(db.String(100), nullable=False)
# #     qualification = db.Column(db.String(100))
# #     dob = db.Column(db.Date)

# #     # flask security specific
# #     fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
# #     active = db.Column(db.Boolean, default=True)
# #     roles = db.relationship('Role', secondary='user_roles', backref='bearers')

# # # Role model
# # class Role(db.Model, RoleMixin): # RoleMixin is a class that provides default implementations for the methods that Flask-Security relies on.
# #     __tablename__ = 'role'
# #     id = db.Column(db.Integer, primary_key=True)
# #     name = db.Column(db.String(50), unique=True, nullable=False)
# #     description = db.Column(db.String(255), nullable=False)
    
# # # UserRole model
# # class UserRoles(db.Model):
# #     __tablename__ = 'user_roles'
# #     id = db.Column(db.Integer, primary_key=True)
# #     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
# #     role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)


# # # Subject model
# # class Subject(db.Model):
# #     __tablename__ = 'subject'
# #     id = db.Column(db.Integer, primary_key=True)
# #     name = db.Column(db.String(100), unique=True, nullable=False)
# #     description = db.Column(db.Text)

# # # Chapter model
# # class Chapter(db.Model):
# #     __tablename__ = 'chapter'
# #     id = db.Column(db.Integer, primary_key=True)
# #     subject_id = db.Column(db.Integer, db.ForeignKey('subject.id'), nullable=False)
# #     name = db.Column(db.String(100), nullable=False)
# #     description = db.Column(db.Text)

# # # Quiz model
# # class Quiz(db.Model):
# #     __tablename__ = 'quiz'
# #     id = db.Column(db.Integer, primary_key=True)
# #     chapter_id = db.Column(db.Integer, db.ForeignKey('chapter.id'), nullable=False)
# #     date_of_quiz = db.Column(db.Date)
# #     time_duration = db.Column(db.Time)
# #     remarks = db.Column(db.Text)

# # # Question model
# # class Question(db.Model):
# #     __tablename__ = 'question'
# #     id = db.Column(db.Integer, primary_key=True)
# #     quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
# #     question_statement = db.Column(db.Text, nullable=False)
# #     option1 = db.Column(db.String(255))
# #     option2 = db.Column(db.String(255))
# #     option3 = db.Column(db.String(255))
# #     option4 = db.Column(db.String(255))
# #     correct_option = db.Column(db.String(255))

# # # Score model
# # class Score(db.Model):
# #     __tablename__ = 'score'
# #     id = db.Column(db.Integer, primary_key=True)
# #     quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
# #     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
# #     time_stamp = db.Column(db.DateTime, default=datetime.utcnow)
# #     total_scored = db.Column(db.Integer)
