# from flask import current_app as app
# from backend.models import db
# from flask_security import SQLAlchemyUserDatastore, hash_password

# with app.app_context():
#     db.create_all()

#     userdatastore : SQLAlchemyUserDatastore = app.security.datastore

#     userdatastore.find_or_create_role(name = 'admin', description = 'superuser')
#     userdatastore.find_or_create_role(name = 'user', description = 'general user')

#     if (not userdatastore.find_user(email = 'admin@study.iitm.ac.in')):
#         userdatastore.create_user(email = 'admin@study.iitm.ac.in', password = hash_password('pass'), roles = ['admin'] )
#     if (not userdatastore.find_user(email = 'user01@study.iitm.ac.in')):
#         userdatastore.create_user(email = 'user01@study.iitm.ac.in', password = hash_password('pass'), roles = ['user'] ) # for testing

#     db.session.commit()

from datetime import datetime
from flask import current_app as app
from backend.models import db
from flask_security import SQLAlchemyUserDatastore, hash_password
from werkzeug.security import generate_password_hash, check_password_hash

with app.app_context():
    db.create_all()

    # Initialize the user datastore
    userdatastore: SQLAlchemyUserDatastore = app.security.datastore

    # Create roles
    admin_role = userdatastore.find_or_create_role(name='admin', description='superuser')
    user_role = userdatastore.find_or_create_role(name='user', description='general user')

    # Create users
    if not userdatastore.find_user(email='sayan.bhowmick23@gmail.com'):
        admin_user = userdatastore.create_user(
            email='sayan.bhowmick23@gmail.com',
            username='admin',
            password=generate_password_hash('pass'),
            full_name='Admin User',
            qualification='PhD',
            dob=datetime.strptime('1980-01-01', "%Y-%m-%d").date()
        )
        userdatastore.add_role_to_user(admin_user, admin_role)

    if not userdatastore.find_user(email='connect.sayanbhowmick@gmail.com'):
        test_user = userdatastore.create_user(
            email='connect.sayanbhowmick@gmail.com',
            username='user01',
            password=generate_password_hash('pass'),
            full_name='Test User',
            qualification='B.Tech',
            dob=datetime.strptime('1990-01-01', "%Y-%m-%d").date()
        )
        userdatastore.add_role_to_user(test_user, user_role)

    # Commit changes to the database
    db.session.commit()
