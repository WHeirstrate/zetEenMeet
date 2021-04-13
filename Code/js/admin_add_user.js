console.log("admin_add_user.js loaded");

class LoadAddUserPage {
    constructor() {
        this.generateHtml();
        this.generateCss();
        new AddUserForm();
    }
    generateHtml() {
        const htmlString = `
        <div class="inner_body">
            <h2>Voeg een gebruiker toe</h2>
            <form class="form_add_user" id="form_add_user">
                <input class="input user_name" type="text" placeholder="Scoutsnaam" required>
                <input class="input user_email" type="email" placeholder="E-mail" required>
                <input class="input user_pswrd" type="password" placeholder="Wachtwoord" required>
                <input class="input user_pswrd_conf" type="password" placeholder="Herhaal wachtwoord" required>
                <input class="input user_payed" type="number" placeholder="€">
                <input class="button return" type="button" value="Ga terug" onclick="new LoadAdminPage()">
                <button class="button create_user" type="submit">Maak aan</button>
            </form>
        </div>`;
        document.body.innerHTML = htmlString;
    }
    generateCss() {
        document.getElementById('cssAdmin').setAttribute('disabled', true);
        document.getElementById('cssAdminAddUser').removeAttribute('disabled');
    }
}

class AddUserForm {
    constructor() {
        this.database = firebase.database();
        this.form = document.getElementById('form_add_user');
        this.username = document.querySelector(".user_name");
        this.email = document.querySelector(".user_email");
        this.password = document.querySelector(".user_pswrd");
        this.rPassword = document.querySelector(".user_pswrd_conf");
        this.money = document.querySelector(".user_payed");
        this.addUser = document.querySelector(".create_user");
        this.addEventListeners();
    }

    addEventListeners() {
        this.form.addEventListener('submit', this.checkForm.bind(this));
        this.rPassword.addEventListener('focusin', () => {
            if (this.password.value.length < 6) {
                alert('Wachtwoord moet ten minste 6 tekens lang zijn.');
                this.password.focus();
            }
        });
    }
    checkForm(e) {
        e.preventDefault();
        if (this.password.value !== this.rPassword.value) {
            alert("De wachtwoorden komen niet overeen.");
            this.rPassword.value = "";
            this.rPassword.focus();
        } else {
            this.pushForm();
            console.log('push form');
        }
    }
    pushForm() {
        this.database.ref('users/' + this.username.value).set({
            email: this.email.value,
            wachtwoord: this.rPassword.value,
            meten_betaald: this.money.value * 2,
            meten_gebruikt: 0
        });
        this.username.value = "";
        this.email.value = "";
        this.password.value = "";
        this.rPassword.value = "";
        this.money.value = "";
    }
}