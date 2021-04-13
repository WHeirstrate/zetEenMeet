console.log("admin.js loaded");

class LoadAdminPage {
    constructor() {
        this.generateHtml();
        this.generateCss();
        new LoadAdminData();
    }
    generateHtml() {
        const htmlString = `
        <div class="usersContainer">
            <div class="loading">
                <h2>Even geduld...</h2>
                <p>De gebruikers worden geladen.</p>
            </div>
        </div>
        <div class="options">
            <button class="option log_out" type="submit">Log uit</button>
            <button class="option add_user" type="submit">Gebruiker</button>
        </div>`;
        document.getElementsByTagName('body')[0].innerHTML = htmlString;
    }
    generateCss() {
        document.getElementById('cssCommon').setAttribute('disabled', true);
        document.getElementById('cssLogin').setAttribute('disabled', true);
        document.getElementById('cssAdminAddUser').setAttribute('disabled', true);
        document.getElementById('cssAdmin').removeAttribute('disabled');
    }
}

class LoadAdminData {
    constructor() {
        this.database = firebase.database();
        this.renderElement = document.querySelector('.usersContainer');
        this.userName = document.querySelector('.user_name');
        this.email = document.querySelector('.user_mail');
        this.totalMeten = document.querySelector('.total_meten');
        this.usedMeten = document.querySelector('.used_meten');
        this.database.ref('users').on('value', this.gotData.bind(this), this.errData.bind(this));
    }
    gotData(data) {
        let htmlString = "";
        const users = data.val();
        Object.entries(users).forEach(user => {
            htmlString +=
                `<article class="user">
                <h2 class="user_name">${user[0]}</h2>
                <p class="user_mail">${user[1].email}</p>
                <div class="user_stats">
                    <div class="counter_container">
                        <div class="total_meten counter">${user[1].meten_gebruikt}</div>
                        <div class="used_meten counter">${Number(user[1].meten_betaald) - Number(user[1].meten_gebruikt)}</div>
                    </div>
                    <div class="add_user_data">
                        <button class="button subtract_meet">-1</button>
                        <button class="button add_meet">+1</button>
                        <input type="number" class="button money_input" placeholder="€">
                        <button class="button add_balance">+</button>
                    </div>
                </div>
            </article>`;
        });
        this.renderElement.innerHTML = htmlString;
        this.changeStyle();
        new WriteAdminData(this.database, Object.entries(data.val()));
        new AdminLocations();
    }
    changeStyle() {
        const usedMetenAll = Array.from(document.querySelectorAll('.used_meten'));
        usedMetenAll.map(usedMetenElement => {
            if (usedMetenElement.innerText < 0) usedMetenElement.style.background = "rgb(196, 84, 82)";
        });
    }
    errData(err) {
        console.log('Error:', err);
    }
}

class WriteAdminData {
    constructor(database, usersData) {
        this.database = database;
        this.subMeet = document.getElementsByClassName('subtract_meet');
        this.addMeet = document.getElementsByClassName('add_meet');
        this.moneyInp = document.getElementsByClassName('money_input');
        this.balances = document.getElementsByClassName('add_balance');
        this.usersData = usersData;
        this.addEventListeners();
    }
    addEventListeners() {
        for (let subMeetElement of this.subMeet) {
            subMeetElement.addEventListener('click', this.manageMeten.bind(this));
        }
        for (let addMeetElement of this.addMeet) {
            addMeetElement.addEventListener('click', this.manageMeten.bind(this));
        }
        for (let balance of this.balances) {
            balance.addEventListener('click', this.manageBalance.bind(this));
        }
    }
    manageMeten(event) {
        const parentUser = event.target.parentNode.parentNode.parentNode.firstElementChild.innerText;
        const formula = event.target.classList[1];
        if (formula === 'add_meet') {
            for (let userData of this.usersData) {
                if (userData[0] === parentUser) {
                    this.database.ref('users/' + parentUser).update({
                        meten_gebruikt: userData[1].meten_gebruikt + 1
                    });
                }
            }
        } else {
            for (let userData of this.usersData) {
                if (userData[0] === parentUser) {
                    this.database.ref('users/' + parentUser).update({
                        meten_gebruikt: userData[1].meten_gebruikt - 1
                    });
                }
            }
        }

    }
    manageBalance(event) {
        const parentUser = event.target.parentNode.parentNode.parentNode.firstElementChild.innerText;
        const metenInputElement = event.path[1].children[2];
        const addedMeten = metenInputElement.value * 2;
        for (let userData of this.usersData) {
            if (userData[0] === parentUser) {
                this.database.ref('users/' + parentUser).update({
                    meten_betaald: userData[1].meten_betaald + addedMeten
                });
            }
        }
        metenInputElement.value = '';
    }
}

class AdminLocations {
    constructor() {
        this.addUser = document.querySelector('.add_user');
        this.logOut = document.querySelector('.log_out');
        this.addEventListeners();
    }
    addEventListeners() {
        this.logOut.addEventListener('click', this.relocate.bind(this));
        this.addUser.addEventListener('click', this.relocate.bind(this));
    }
    relocate(e) {
        if (e.target.innerText === 'Log uit') {
            new LoadLoginPage();
        } else {
            new LoadAddUserPage();
        }
    }
}