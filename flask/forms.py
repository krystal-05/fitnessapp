from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import SubmitField, StringField, PasswordField, SelectField, IntegerField
from wtforms.validators import DataRequired, Length, EqualTo, Optional, NumberRange
from wtforms.fields import DateTimeLocalField  

class UpdateProfileForm(FlaskForm):
    image_file = FileField('Update Profile Picture', validators=[FileAllowed(['jpg', 'png'])])
    first_name = StringField('First Name', validators=[DataRequired(), Length(min=1, max=30)])
    last_name = StringField('Last Name', validators=[DataRequired(), Length(min=1, max=30)])
    current_password = PasswordField('Current Password', validators=[Optional()])
    password = PasswordField('New Password', validators=[Optional(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password', validators=[EqualTo('password', message="Passwords must match")])

    submit = SubmitField('Update')

class UpdateWorkoutForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(min=1, max=200)])
    exercise = SelectField('Exercise', 
        validators=[DataRequired()], 
            choices=[
            ("",""),
            ("baseball", "Baseball"),
            ("basketball", "Basketball"),
            ("biking", "Biking"),
            ("boxing", "Boxing"),
            ("climbing", "Climbing"),
            ("dance", "Dance"),
            ("disc-sports", "Disc Sports"),
            ("elliptical", "Elliptical"),
            ("football", "Football"),
            ("golf", "Golf"),
            ("gymnastics", "Gymnastics"),
            ("hiking", "Hiking"),
            ("hiit", "High Intensity Interval Training"),
            ("hockey", "Hockey"),
            ("lacrosse", "Lacrosse"),
            ("pilates", "Pilates"),
            ("rowing", "Rowing"),
            ("rugby", "Rugby"),
            ("running", "Running"),
            ("skating", "Skating"),
            ("skiing", "Skiing"),
            ("snowboarding", "Snowboarding"),
            ("soccer", "Soccer"),
            ("softball", "Softball"),
            ("stair-stepper", "Stair Stepper"),
            ("strength-training", "Strength Training"),
            ("surfing", "Surfing"),
            ("swimming", "Swimming"),
            ("tennis", "Tennis"),
            ("volleyball", "Volleyball"),
            ("walking", "Walking"),
            ("weight-lifting", "Weight Lifting"),
            ("wrestling", "Wrestling"),
        ]
)
    date = DateTimeLocalField('Date and Time', validators=[DataRequired()])
    hours = IntegerField("Hours", validators=[Optional(), NumberRange(min=0)])
    minutes = IntegerField("Minutes", validators=[Optional(), NumberRange(min=0, max=59)])
    seconds = IntegerField("Seconds", validators=[Optional(), NumberRange(min=0, max=59)])
    update = SubmitField("Update")
    delete = SubmitField("Delete")