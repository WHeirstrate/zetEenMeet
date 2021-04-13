console.log("user.js loaded");

class LoadUserPage {
    constructor(userData) {
        this.userName = userData[0];
        this.database = firebase.database();
        this.database.ref('users').on('value', this.determinUser.bind(this), this.errData.bind(this));
        this.generateCss();
    }
    determinUser(data) {
        this.usersData = Object.entries(data.val());
        for (let userData of this.usersData) {
            if (userData[0] === this.userName) {
                this.generateHtml(userData);
                new UserInput(userData);
            }
        }
    }
    errData(err) {
        console.log('Error:', err);
    }
    generateHtml(sessionUser) {
        const htmlString = `
        <div class="user">
            <h1 class="user_name">${sessionUser[0]}</h1>
            <div class="counter_container">
                <div class="used_meten counter">${sessionUser[1].meten_gebruikt}</div>
                <div class="other_meten counter">${Number(sessionUser[1].meten_betaald) - Number(sessionUser[1].meten_gebruikt)}</div>
            </div>
            <div class="button_container">
                <button class="add_meet addition">+1</button><br>
                <button class="add_double_meet addition">+2</button>
            </div>
            <button class="log_out" type="submit">Log uit</button>
        </div>`;
        document.getElementsByTagName('body')[0].innerHTML = htmlString;
    }
    generateCss() {
        document.getElementById('cssLogin').setAttribute('disabled', true);
        document.getElementById('cssCommon').setAttribute('disabled', true);
        document.getElementById('cssUser').removeAttribute('disabled');
    }
}

class UserInput {
    constructor(userData) {
        this.userData = userData;
        this.additions = document.getElementsByClassName('addition');
        this.logOut = document.querySelector('.log_out');
        this.changeStyle();
        this.addEventListeners();
    }
    addEventListeners() {
        for (let addition of this.additions) {
            addition.addEventListener('click', this.addAddition.bind(this));
        }
        this.logOut.addEventListener('click', () => new LoadLoginPage());
    }
    addAddition(event) {
        const useradditionType = event.target.innerText;
        firebase.database().ref('users/' + this.userData[0]).update({
            meten_gebruikt: this.userData[1].meten_gebruikt + Number(useradditionType)
        });
    }
    changeStyle() {
        const otherMetenElement = Array.from(document.getElementsByClassName('other_meten'))[0];
        if (otherMetenElement.innerText < 0) document.getElementsByClassName('counter_container')[0].style.background = "rgb(196, 84, 82)";
    }
}