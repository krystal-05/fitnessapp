from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()

# Table to keep track of users' friends
friends = db.Table('friends',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('friend_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    #ensures no duplicate friendships 
    db.UniqueConstraint('user_id', 'friend_id', name='unique_friendship')
)

class User(db.Model):
    id = db.Column("id", db.Integer, primary_key=True)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    image_file = db.Column(db.String(50), nullable=False, default='default.png')
    timezone = db.Column(db.String(50), nullable=True)

    workouts = db.relationship('Workout', backref='user', lazy=True)

    friends = db.relationship('User',
        secondary=friends,
        primaryjoin=(friends.c.user_id == id),
        secondaryjoin=(friends.c.friend_id == id),
        backref=db.backref('friend_of', lazy='dynamic'),
        lazy='dynamic'
    )

class FriendRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    status = db.Column(db.String(20), default='none')

    requester = db.relationship('User', foreign_keys=[requester_id], backref='sent_friend_requests')
    receiver = db.relationship('User', foreign_keys=[receiver_id], backref='received_friend_requests')

class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    points = db.Column(db.Integer, nullable=False)

    @staticmethod
    def preload_defaults():
        default_exercises = [
            {"name": "baseball", "points": 6},
            {"name": "basketball", "points": 10},
            {"name": "biking", "points": 8},
            {"name": "boxing", "points": 12},
            {"name": "climbing", "points": 12},
            {"name": "dance", "points": 7},
            {"name": "disc-sports", "points": 6},
            {"name": "elliptical", "points": 7},
            {"name": "football", "points": 10},
            {"name": "golf", "points": 4},
            {"name": "gymnastics", "points": 10},
            {"name": "hiking", "points": 9},
            {"name": "hiit", "points": 12},
            {"name": "hockey", "points": 11},
            {"name": "lacrosse", "points": 10},
            {"name": "pilates", "points": 6},
            {"name": "rowing", "points": 9},
            {"name": "rugby", "points": 11},
            {"name": "running", "points": 12},
            {"name": "skating", "points": 8},
            {"name": "skiing", "points": 9},
            {"name": "snowboarding", "points": 8},
            {"name": "soccer", "points": 10},
            {"name": "softball", "points": 6},
            {"name": "stair-stepper", "points": 8},
            {"name": "strength-training", "points": 9},
            {"name": "surfing", "points": 8},
            {"name": "swimming", "points": 11},
            {"name": "tennis", "points": 9},
            {"name": "volleyball", "points": 7},
            {"name": "walking", "points": 5},
            {"name": "weight-lifting", "points": 9},
            {"name": "wrestling", "points": 10},
        ]

        for data in default_exercises:
            if not Exercise.query.filter_by(name=data["name"]).first():
                db.session.add(Exercise(name=data["name"], points=data["points"]))

        db.session.commit()


class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercise.id'))
    exercise = db.relationship('Exercise')
    duration_minutes = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))
    workout_title = db.Column(db.Text)

class Award(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255))
    icon = db.Column(db.String(100))

class UserAward(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    award_id = db.Column(db.Integer, db.ForeignKey('award.id'), nullable=False)
    date_awarded = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))

    user = db.relationship('User', backref='user_awards')
    award = db.relationship('Award', backref='user_awards')

class Challenges(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(50), nullable=False)
    exercises = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='not_started')
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Integer, nullable=False)

#one to many relationship 
class ChallengeInvite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    challenge_id = db.Column(db.Integer, db.ForeignKey('challenges.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending / accepted / rejected

    challenge = db.relationship('Challenges', backref='challenge_invites')
    user = db.relationship('User', backref='challenge_invites')

    #ensures no duplicate invites 
    __table_args__ = (
        db.UniqueConstraint('challenge_id', 'user_id', name='unique_challenge_invite'),
    )

class ChallengeProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    challenge_id = db.Column(db.Integer, db.ForeignKey('challenges.id'), nullable=False)
    points_earned = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='not_started')  # optional: not_started, in_progress, completed

    user = db.relationship('User', backref='challenge_progress')
    challenge = db.relationship('Challenges', backref='challenge_progress')

    __table_args__ = (
        db.UniqueConstraint('user_id', 'challenge_id', name='unique_user_challenge_progress'),
    )