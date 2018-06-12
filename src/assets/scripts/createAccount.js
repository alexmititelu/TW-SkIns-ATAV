
    /** FUNCTIE PT VALIDARE USERNAME */

    function validateUsername() {
        var username = document.getElementById('username').value;
        var usernameValidator = document.getElementById('username-validator');
        var usernameValidatorMessage = document.getElementById('username-validator-message');
        
        usernameValidator.style = 'display:none';
        
        var regexp = new RegExp("^([a-zA-Z]{6,30})$");

        if(username.length<6 || username.length > 30) {

            usernameValidatorMessage.textContent = 'Username must contain between 6 and 30 characters.';
            usernameValidator.style = 'display:block'; 

        } else if(!regexp.test(username)) {

            usernameValidatorMessage.textContent = 'Username must contain only alphabetical letters';
            usernameValidator.style = 'display:block'; 

        } else if(username === 'alex') {
            // AICI TRE SA VERIFICAM DACA EXISTA DEJA IN BAZA DE DATE
            usernameValidatorMessage.textContent = 'This username already exists';
            usernameValidator.style = 'display:block'; 

        }  
        //<i class="fa fa-ban fa-lg"></i> <span id=username-validator-message>&nbsp test</span>
    }


    /** FUNCTIE PT VALIDARE FIRST NAME */

    function validateFirstname() {
        var firstname = document.getElementById('firstname').value;
        var firstnameValidator = document.getElementById('firstname-validator');
        var firstnameValidatorMessage = document.getElementById('firstname-validator-message');
        
        firstnameValidator.style = 'display:none';
        
        var regexp = new RegExp("^([a-zA-Z]+[ ]?[a-zA-Z]+)*");

        if(firstname.length <1 ) {
            firstnameValidatorMessage.textContent = 'First Name must contain at least one character.';
            firstnameValidator.style = 'display:block'; 

        } else if(!regexp.test(firstname)) {

            firstnameValidatorMessage.textContent = 'First Name must contain only alphabetical letters';
            firstnameValidator.style = 'display:block'; 

        }  
        //<i class="fa fa-ban fa-lg"></i> <span id=username-validator-message>&nbsp test</span>
    }

