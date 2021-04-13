console.log("login.js loaded");

//---------------------------------------------//

class LoadLoginPage {
    constructor() {
        this.generateHtml();
        this.generateCss();
        new LoginRedirect();
    }
    generateHtml() {
        const htmlString = `
        <div class="inner_body">
        <h1>Zet <br> Een <br> Meet.be</h1>
            <form id="add_user" action="">
                <input class="form_input user_name" type="text" placeholder="Scoutsnaam" required>
                <br>
                <input class="form_input password" type="password" placeholder="Wachtwoord" required>
                <a class="reset_password" href="">Wachtwoord vergeten?</a>
                <br>
                <button class="log_in" type="submit">Log in</button>
            </form>
        </div>`;

        document.body.innerHTML = htmlString;
    }
    generateCss() {
        document.getElementById('cssUser').setAttribute('disabled', true);
        document.getElementById('cssResetPassword').setAttribute('disabled', true);
        document.getElementById('cssMailConfirmation').setAttribute('disabled', true);
        document.getElementById('cssAdmin').setAttribute('disabled', true);
        document.getElementById('cssCommon').removeAttribute('disabled');
        document.getElementById('cssLogin').removeAttribute('disabled');
    }

}

class LoginRedirect {
    constructor() {
        this.database = firebase.database();
        this.forgotPasswordElement = document.querySelector('.reset_password');
        this.logIn = document.querySelector('.log_in');
        this.userName = document.querySelector('.user_name');
        this.password = document.querySelector('.password');
        this.database.ref('users').on('value', this.gotData.bind(this), this.errData.bind(this));

    }
    gotData(data) {
        this.usersData = Object.entries(data.val());
        this.addEventListeners();
    }
    errData(err) {
        console.log('ERROR:', err);
    }

    addEventListeners() {
        this.forgotPasswordElement.addEventListener('click', this.forgotPassword.bind(this));
        this.logIn.addEventListener('click', this.checkData.bind(this));
    }
    forgotPassword(e) {
        e.preventDefault();
        new LoadResetPage(this.usersData);
    }
    checkData(event) {
        event.preventDefault();
        if (this.userName.value !== "") {
            if (this.password.value !== "") {
                for (let userData of this.usersData) {
                    if (userData[0] === this.userName.value) {
                        const sessionUser = userData;
                        if (sessionUser[1].wachtwoord === this.password.value) {
                            if (sessionUser[0] !== "Admin") {
                                new LoadUserPage(sessionUser);
                            } else {
                                new LoadAdminPage();
                            }
                        } else {
                            this.password.value = "";
                            this.password.focus();
                            break;
                        }
                    }
                    this.userName.focus();
                }
            } else {
                this.password.focus();
            }
        } else {
            this.userName.focus();
        }
    }
}

new LoadLoginPage();