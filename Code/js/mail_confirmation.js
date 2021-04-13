console.log("mail_confirmation.js loaded");

class LoadConfirmPage {
    constructor(userData) {
        this.userData = userData;
        this.generateHtml();
        this.generateCss();
        this.addEventlisteners();
    }
    generateHtml() {
        const htmlString = `
        <h1>Zet <br> Een <br> Meet.be</h1>
        <p>Er is een email gestuurd naar:</p>
        <p class="user_email">${this.userData[1].email}</p>
        <div class="return_container">
            <a class="return">Ga terug</a>
        </div>`;
        document.querySelector('.inner_body').innerHTML = htmlString;
    }
    generateCss() {
        document.getElementById('cssResetPassword').setAttribute('disabled', true);
        document.getElementById('cssMailConfirmation').removeAttribute('disabled');

    }
    addEventlisteners() {
        document.querySelector('.return').addEventListener('click', () => new LoadLoginPage());
    }

}