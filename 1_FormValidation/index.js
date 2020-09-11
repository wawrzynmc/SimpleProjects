// varaibles
const validationCard = document.querySelector('.validation-card');
const messageCard = document.querySelector('.message-card');
const form = document.querySelector('.form');
const inputs = form.querySelectorAll('input');
const submitBtn = form.querySelector('.form__btn-submit');
const showFormBtn = document.querySelector('.card__btn-show-form');

const validationDict = {
	username: {
		valid: false,
		value: '',
	},
	email: {
		valid: false,
		value: '',
	},
	password: {
		valid: false,
		value: '',
	},
	password2: {
		valid: false,
		value: '',
	},
};

// -- functions
// ---- handlers
function onInputChangeHandler(event) {
	const input = event.target;
	validationDict[input.id].value = input.value;

	checkInputs(input);
}

// ---- helpers
const clearInputs = () => {
	inputs.forEach((input) => {
        input.value = '';
        input.parentElement.classList.remove('success')
		validationDict[input.id].valid = false;
		validationDict[input.id].value = '';
	});
};

// ---- validation functions
const checkIfEmpty = (value) => (!!!value ? true : false);
const checkIfEmail = (value) => {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(value).toLowerCase());
};
const checkPasswordLength = (value) => (value.length >= 6 ? true : false);
const checkIfPasswordMatches = (password1, password2) =>
	password1 === password2 ? true : false;

// ---- error / success function
const setErrorFor = (input, message) => {
	validationDict[input.id].valid = false;
	const formControl = input.parentElement;
	const small = formControl.querySelector('small');

	small.innerText = message;

	formControl.classList.add('error');
	formControl.classList.remove('success');
};

const setSuccessFor = (input, message) => {
	validationDict[input.id].valid = true;
	const formControl = input.parentElement;

	formControl.classList.remove('error');
	formControl.classList.add('success');
};

// ---- check inputs
const checkInputs = (input) => {
	let inputsArray = [],
		validationPassed = false;

	if (input) {
		inputsArray.push(input);
	} else {
		inputsArray = inputs;
	}

	inputsArray.forEach((input) => {
		const inputName = input.id;
		const inputValue = validationDict[inputName].value;

		switch (inputName) {
			case 'username':
				checkIfEmpty(inputValue)
					? setErrorFor(input, `${inputName} cannot be empty`)
					: setSuccessFor(input);
				break;
			case 'email':
				checkIfEmpty(inputValue)
					? setErrorFor(input, `${inputName} cannot be empty`)
					: !checkIfEmail(inputValue)
					? setErrorFor(input, `${inputName} must be email.`)
					: setSuccessFor(input);
				break;
			case 'password':
				checkIfEmpty(inputValue)
					? setErrorFor(input, `${inputName} cannot be empty`)
					: !checkPasswordLength(inputValue)
					? setErrorFor(
							input,
							`${inputName} has to have at least 6. characters.`
					  )
					: setSuccessFor(input);
				break;
			case 'password2':
				checkIfEmpty(inputValue)
					? setErrorFor(input, `${inputName} cannot be empty`)
					: !checkIfPasswordMatches(
							validationDict['password'].value,
							inputValue
					  )
					? setErrorFor(input, `passwords have to match`)
					: setSuccessFor(input);
				break;
			default:
				break;
		}
	});

	for (let key of Object.keys(validationDict)) {
		if (validationDict[key].valid === false) {
			submitBtn.disabled = true;
			validationPassed = false;
			break;
		} else {
			submitBtn.disabled = false;
			validationPassed = true;
		}
	}

	return validationPassed;
};

// -- event listeners
form.addEventListener('submit', (event) => {
	event.preventDefault();
});

inputs.forEach((input) => {
    input.addEventListener('input', onInputChangeHandler);
    const inputValue = input.value
    validationDict[input.id].value = inputValue

    if (!!inputValue) {
        checkInputs(input)
    }
});

submitBtn.addEventListener('click', (event) => {
	if (checkInputs()) {
		validationCard.classList.add('invisible');
		messageCard.classList.remove('invisible');
	}
});

showFormBtn.addEventListener('click', (event) => {
	messageCard.classList.add('invisible');
	validationCard.classList.remove('invisible');
	clearInputs();
});
