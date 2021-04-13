console.log('JS linked succesfully');

const database = firebase.database();

class Form {
    constructor() {
        this.form = document.getElementById("addUser");
        this.username = document.querySelector(".username");
        this.email = document.querySelector(".email");
        this.submit = document.querySelector(".submit");
        this.password = document.querySelector(".password");
        this.rPassword = document.querySelector(".repeatPassword");
        this.meten = document.querySelector(".money");
        this.addEventListeners();
    }
    addEventListeners() {
        this.form.addEventListener('submit', this.checkForm.bind(this));
        this.password.addEventListener('focusout', () => {
            if (this.password.length < 6) {
                alert('Wachtwoord moet ten minste 6 tekens lang zijn.');
            }
        });
    }
    checkForm(event) {
        event.preventDefault();
        if (this.password.value !== this.rPassword.value) {
            alert("Beide wachtwoorden zijn verschillend");
            this.password.value = "";
            this.rPassword.value = "";
        } else {
            this.pushForm();
        }
    }
    pushForm() {
        if (this.username.value !== "" && this.email.value !== "" && this.rPassword.value !== "") {
            console.log("Username:", this.username.value);
            console.log("Email:", this.email.value);
            console.log("Password:", this.rPassword.value);
            console.log("Meten betaald:", this.meten.value);
            database.ref('users/' + this.username.value).set({
                email: this.email.value,
                wachtwoord: this.rPassword.value,
                meten_betaald: this.meten.value * 2,
                meten_gebruikt: 0
            });
        } else {
            alert("Vul alle vakken in!");
        }
    }
}
new Form();