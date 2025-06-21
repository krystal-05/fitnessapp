import { convertUnits, convertTimezone } from "./newfunctions.js";

export class WorkoutCard{
    constructor(workout, template, mode, container) {
        this.workout = workout;
        this.card = template.content.cloneNode(true).children[0];
        this.mode = mode;
        this.container = container;

        this.renderBase();
        this.renderByMode();
    }
    renderBase(){
        const exercise = this.card.querySelector("[exercise-data]");
        const title = this.card.querySelector("[title-data]");
        const hours = this.card.querySelector("[hours-data]");
        const minutes = this.card.querySelector("[minutes-data]");
        const seconds = this.card.querySelector("[seconds-data]");
        const datetime = this.card.querySelector("[datetime-data]");

        exercise.textContent = this.workout.exercise;
        title.textContent = this.workout.workout_title;

        console.log({
            workout: this.workout,
            hours: this.card.querySelector("[hours-data]"),
            minutes: this.card.querySelector("[minutes-data]"),
            seconds: this.card.querySelector("[seconds-data]")
          });
          
        convertTimezone(datetime, this.workout);
        convertUnits(this.workout, hours, minutes, seconds);

        this.workout.element = this.card;

    }

    renderByMode(){
        switch(this.mode){
            case "view_workouts":
                this.viewWorkouts();
                break;
            case "feed":
                break;
        }
    }

    viewWorkouts() {
        const edit_btn = this.card.querySelector("[edit-btn]");
        if (edit_btn) {
            edit_btn.onclick = () => {
                window.location.href = `/edit_workout/${this.workout.id}`;
            };
        }
    }

    getElement() {
        return this.card;
      }

}
