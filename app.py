from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_required, current_user, auth_required
from flask_security.utils import hash_password, verify_password
from flask_security import roles_required, roles_accepted, http_auth_required, auth_token_required, login_user, logout_user
from backend.config import LocalDevelopmentConfig
from backend.models import *
from backend.resources import api
from flask_cors import CORS
from flask_caching import Cache
from backend.celery.celery_factory import celery_init_app
import  flask_excel as excel
from celery.schedules import crontab

app = None
cache = None

# Create Flask app
def create_app():
    app = Flask(__name__, template_folder='frontend', static_folder='frontend', static_url_path='/static')
    CORS(app)
    
    app.config.from_object(LocalDevelopmentConfig)

    # model init
    db.init_app(app)

    # cache init
    cache = Cache(app)

    # flask-restful init
    api.init_app(app)

    # flask security init
    datastore = SQLAlchemyUserDatastore(db, User, Role)

    app.cache = cache

    app.security = Security(app, datastore=datastore, register_blueprint=False)
    app.app_context().push()

    return app

app = create_app()
celery_app = celery_init_app(app)

import backend.celery.celery_schedule

import backend.create_initial_data

# Import routes
from backend.routes import *

# flask-excel
excel.init_excel(app)

if __name__ == '__main__':
    app.run()