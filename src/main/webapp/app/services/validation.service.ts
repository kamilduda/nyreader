export class ValidationService {
    static getValidatorErrorMessage(code: string) {
        let config = {
            "required": "Required",
            "invalidCreditCard": "Is invalid credit card number",
            "invalidEmailAddress": "Invalid email address",
            "invalidPassword": "Invalid password. Password must be at least 6 characters long, and contain a number."
        };
        return config[code];
    }

    static emailValidator(control) {
        // RFC 2822 compliant regex
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return {"invalidEmailAddress": true};
        }
    }
}