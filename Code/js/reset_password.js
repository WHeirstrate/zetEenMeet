console.log("reset_password.js loaded");

class LoadResetPage {
    constructor(usersData) {
        this.container = document.querySelector('.inner_body');
        this.generateHtml();
        this.generateCss();
        new ResetForm(usersData);
    }
    generateHtml() {
        const htmlString = `
        <h1>Zet <br> Een <br> Meet.be</h1>
        <p>Wachtwoord vergeten?<br>Krijg een mailtje!
        </p>
        <form id="request_email" action="">
            <input class="form_input username" type="text" placeholder="Scoutsnaam">
            <br>
            <a class="return" href="">Ga terug</a>
            <br>
            <button class="submit" type="submit">Stuur e-mail</button>
        </form>`;
        this.container.innerHTML = htmlString;
    }
    generateCss() {
        document.getElementById('cssLogin').setAttribute('disabled', true);
        document.getElementById('cssResetPassword').removeAttribute('disabled');
    }
}

class ResetForm {
    constructor(usersData) {
        this.usersData = usersData;
        this.formElement = document.getElementById('request_email');
        this.usernameElement = document.querySelector('.username');
        this.returnElement = document.querySelector('.return');
        this.addEventListeners();
    }
    addEventListeners() {
        this.returnElement.addEventListener('click', (e) => {
            e.preventDefault();
            new LoadLoginPage();
        });
        this.formElement.addEventListener('submit', this.submitForm.bind(this));
    }
    submitForm(e) {
        e.preventDefault();
        if (this.usernameElement.value !== "") {
            for (let userData of this.usersData) {
                if (this.usernameElement.value === userData[0]) {
                    new LoadConfirmPage(userData);
                    break;
                }
            }
        } else {
            this.usernameElement.focus();
        }
    }
}