
/** FUNCTIE PT VALIDARE USERNAME */

function validateUsername() {
    var username = document.getElementById('username').value;
    var usernameValidator = document.getElementById('username-validator');
    var usernameValidatorMessage = document.getElementById('username-validator-message');

    usernameValidator.style = 'display:none';
    enableCreateAccountButton();
    var regexp = new RegExp("^([a-zA-Z]{6,30})$");

    if (username.length < 6 || username.length > 30) {

        usernameValidatorMessage.textContent = 'Username must contain between 6 and 30 characters.';
        usernameValidator.style = 'display:block';
        disableCreateAccountButton();

    } else if (!regexp.test(username)) {

        usernameValidatorMessage.textContent = 'Username must contain only alphabetical letters';
        usernameValidator.style = 'display:block';
        disableCreateAccountButton();

    } else {
        // AICI TRE SA VERIFICAM DACA EXISTA DEJA IN BAZA DE DATE
        
        /** verificare username */

        const URL = 'https://localhost:8050/registerUsername=' + username;
        const TIME = 5000;


        try { // trying to instantiate a XMLHttpRequest object
            var xhr = new XMLHttpRequest();
        } catch (e) {
            console.log('XMLHttpRequest cannot be instantiated: ' + e.message);
        } finally {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {   // data arrived
                    if (xhr.status === 200) { // response Ok from Web service
                        //    callback(xhr.responseText.trim());
                        var jsonResponse = JSON.parse(xhr.responseText);
                        console.log(jsonResponse);

                        if(jsonResponse.status === 200 && jsonResponse.response === 'invalid') {
                            usernameValidatorMessage.textContent = 'This username already exists';
                            usernameValidator.style = 'display:block';
                            disableCreateAccountButton();
                        }
                    }
                }
            };
            xhr.open("GET", URL, true); // opening connection
            xhr.timeout = TIME;         // setting the response time
            xhr.send();             // sending the HTTP request (no data is provided)
        }

    }

    // usernameValidatorMessage.textContent = checkIfUsernameExists("alex");
}

/** FUNCTIE PT VALIDARE FIRST NAME */

function validateFirstname() {
    var firstname = document.getElementById('firstname').value;
    var firstnameValidator = document.getElementById('firstname-validator');
    var firstnameValidatorMessage = document.getElementById('firstname-validator-message');

    firstnameValidator.style = 'display:none';
    enableCreateAccountButton();

    var regexp = new RegExp("^([a-zA-Z]+[ ]?[a-zA-Z]+)*");

    if (firstname.length < 1) {
        firstnameValidatorMessage.textContent = 'First Name must contain at least one character.';
        firstnameValidator.style = 'display:block';
        disableCreateAccountButton();

    } else if (!regexp.test(firstname)) {

        firstnameValidatorMessage.textContent = 'First Name must contain only alphabetical letters';
        firstnameValidator.style = 'display:block';
        disableCreateAccountButton();

    }

}


/** FUNCTIE PT VALIDARE LAST NAME */

function validateLastname() {
    var lastname = document.getElementById('lastname').value;
    var lastnameValidator = document.getElementById('lastname-validator');
    var lastnameValidatorMessage = document.getElementById('lastname-validator-message');

    lastnameValidator.style = 'display:none';
    enableCreateAccountButton();

    var regexp = new RegExp("^([a-zA-Z]+[ ]?[a-zA-Z]+)*");

    if (lastname.length < 1) {
        lastnameValidatorMessage.textContent = 'Last Name must contain at least one character.';
        lastnameValidator.style = 'display:block';
        disableCreateAccountButton();

    } else if (!regexp.test(lastname)) {

        lastnameValidatorMessage.textContent = 'Last Name must contain only alphabetical letters';
        lastnameValidator.style = 'display:block';
        disableCreateAccountButton();

    }

}



/** FUNCTIE PT VALIDARE PHONE NUMBER */

function validatePhoneNumber() {
    var phone = document.getElementById('phone').value;
    var phoneValidator = document.getElementById('phone-validator');
    var phoneValidatorMessage = document.getElementById('phone-validator-message');

    phoneValidator.style = 'display:none';
    enableCreateAccountButton();

    var regexp = new RegExp("^([0-9]{10})$");

    if (phone.length != 10) {

        phoneValidatorMessage.textContent = 'Phone number must contain 10 digits.';
        phoneValidator.style = 'display:block';
        disableCreateAccountButton();

    } else if (!regexp.test(phone)) {

        phoneValidatorMessage.textContent = 'Phone number must contain only digits';
        phoneValidator.style = 'display:block';
        disableCreateAccountButton();

    }

}

/** FUNCTIE PT VALIDARE EMAIL */

function validateEmail() {
    var email = document.getElementById('email').value;
    var emailValidator = document.getElementById('email-validator');
    var emailValidatorMessage = document.getElementById('email-validator-message');

    emailValidator.style = 'display:none';
    enableCreateAccountButton();

    var regexp = new RegExp("(^([a-zA-Z._0-9]+)([@])([a-zA-Z]+)([.][a-zA-Z]+)$)");

    if (!regexp.test(email)) {

        emailValidatorMessage.textContent = 'Email must be valid.';
        emailValidator.style = 'display:block';
        disableCreateAccountButton();

    }

}


/** FUNCTIE PT VALIDARE PASSWORD */

function validatePassword() {
    var password = document.getElementById('password').value;
    var passwordValidator = document.getElementById('password-validator');
    var passwordValidatorMessage = document.getElementById('password-validator-message');

    passwordValidator.style = 'display:none';
    enableCreateAccountButton();

    var regexp = new RegExp("(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}");

    if (password.length < 6) {

        passwordValidatorMessage.textContent = 'Password must contain at least 6 characters.';
        passwordValidator.style = 'display:block';
        disableCreateAccountButton();

    } else if (!regexp.test(password)) {

        passwordValidatorMessage.textContent = 'Password must contain lower case, upper case and special characters.';
        passwordValidator.style = 'display:block';
        disableCreateAccountButton();

    }
}




/** FUNCTIE PT VALIDARE INTERESTS */

function validateInterests() {
    var interests = document.getElementById('interests').value;
    var interestsValidator = document.getElementById('interests-validator');
    var interestsValidatorMessage = document.getElementById('interests-validator-message');

    interestsValidator.style = 'display:none';
    enableCreateAccountButton();


    if (interests.length >= 300) {

        interestsValidatorMessage.textContent = 'The text must contain less than 300 characters';
        interestsValidator.style = 'display:block';
        disableCreateAccountButton();

    }

}

/** Aratam sau nu BUTONUL DE CREATE ACCOUNT */

function disableCreateAccountButton() {
    var button = document.getElementById('create-account-button');
    button.disabled = true;
}


function enableCreateAccountButton() {
    var button = document.getElementById('create-account-button');
    button.disabled = false;
}

/** Verificam daca exista usernameul pe server  */

function checkIfUsernameExists(username) {

    const URL = 'http://localhost:8051/registerUsername=' + username;
    const TIME = 2000;

    var ok = true;

    var jsonResult;

    try { // trying to instantiate a XMLHttpRequest object
        var xhr = new XMLHttpRequest();
    } catch (e) {
        console.log('XMLHttpRequest cannot be instantiated: ' + e.message);
    } finally {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {   // data arrived
                if (xhr.status === 200) { // response Ok from Web service
                    //    callback(xhr.responseText.trim());
                    var jsonResponse = JSON.parse(xhr.responseText);
                    jsonResult = jsonResponse;
                }
            }
        };
        xhr.open("GET", URL, true); // opening connection
        xhr.timeout = TIME;         // setting the response time
        xhr.send();             // sending the HTTP request (no data is provided)
    }

    console.log(jsonResult);
    return jsonResult.response;
}