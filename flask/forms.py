from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import SubmitField, StringField, PasswordField, SelectField, IntegerField, SelectMultipleField
from wtforms.validators import DataRequired, Length, EqualTo, Optional, NumberRange, InputRequired
from wtforms.fields import DateTimeLocalField, DateField
from wtforms.validators import ValidationError
from datetime import timedelta, date
from wtforms.widgets import ListWidget, CheckboxInput

class UpdateProfileForm(FlaskForm):
    image_file = FileField('Update Profile Picture', validators=[FileAllowed(['jpg', 'png'])])
    first_name = StringField('First Name', validators=[DataRequired(), Length(min=1, max=30)])
    last_name = StringField('Last Name', validators=[DataRequired(), Length(min=1, max=30)])
    current_password = PasswordField('Current Password', validators=[Optional()])
    password = PasswordField('New Password', validators=[Optional(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password', validators=[EqualTo('password', message="Passwords must match")])

    submit = SubmitField('Update')

class UpdateWorkoutForm(FlaskForm):
    name = StringField('Title', validators=[DataRequired(), Length(min=1, max=200)])
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

#function for the create challenges form "date" field
def within_next_30_days(form, field):
    today = date.today()
    max_date = today + timedelta(days=30)
    if field.data < today or field.data > max_date:
        raise ValidationError("Date must be within the next 30 days.")
    if field.data == today:
        raise ValidationError("Date must not be today")

def at_least_one_selected(form, field):
    if not field.data:
        raise ValidationError("Please select at least one exercise.")
    
class createChallengeForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(min=1, max=200)])
    exercises = SelectMultipleField('Exercise', 
        validators=[at_least_one_selected], 
            choices=[
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
        ],
        option_widget=CheckboxInput(),
        widget=ListWidget(prefix_label=False)
)
    #convert to int since user_id is being passed
    invited_friends = SelectMultipleField('Invite Friends', coerce=int,validators=[InputRequired()], option_widget=CheckboxInput(),
        widget=ListWidget(prefix_label=False))
    start_date = DateField(
        "Start Date",
        validators=[
            DataRequired(),
            within_next_30_days
        ],
        #Sets HTML attributes to restrict the calendar picker in browser
        render_kw={
            "min": date.today().isoformat(),
            "max": (date.today() + timedelta(days=30)).isoformat()
        }
    )

    duration = IntegerField("days", validators=[DataRequired(), NumberRange(min=0, max=365)])
    submit= SubmitField("Create Challenge")