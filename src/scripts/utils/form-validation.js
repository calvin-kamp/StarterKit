export const formValidation = {

    vars: {
        queries: {
            form:                           '*[data-js=form-validation]',
            password:                       '*[type=password]',
            radioGroupRequired:             '*[data-validation-radio-group-required]',
            checkboxGroupRequired:          '*[data-validation-checkbox-group-required]'
        },

        attributes: {
            validationRequired:             'data-validation-required',
            submitMessage:                  'data-validation-submit-message'
        },

        classes: {
            valid:                          'valid',
            invalid:                        'invalid',
            submitMessage:                  'form__submit-message col-12'
        },

        events: {
            validation:                     ['input', 'change'],
            submit:                         'submit'
        },

        messages: {
            passwordError:                  'Passwords are not matching!'
        },

        initialized:                        false
    },

    init() {
        if (!this.vars.initialized) {
            this.addEventListeners();
            this.vars.initialized = true;
        }
    },

    addEventListeners() {
        const $forms = document.querySelectorAll(this.vars.queries.form);

        if (!$forms) {
            return;
        }

        for (const $form of $forms) {
            const $passwordFields = $form.querySelectorAll(this.vars.queries.password);
            const $formFields = new Set([
                ...$form.querySelectorAll('input'),
                ...$form.querySelectorAll('select'),
                ...$form.querySelectorAll('textarea')
            ]);

            let isSubmitAttempted = false;

            for (const $formField of $formFields) {
                $formField.addEventListener('input', () => {
                    this.updateFieldAttributes($formField);

                    if (isSubmitAttempted) {
                        this.updateFieldValidationClasses($formField);
                    }
                });

                $formField.addEventListener('change', () => {
                    if (isSubmitAttempted) {
                        this.updateFieldValidationClasses($formField);
                    }
                });
            }

            $form.addEventListener(this.vars.events.submit, (event) => {
                isSubmitAttempted = true;
                let isValid = true;

                for (const $formField of $formFields) {
                    this.updateFieldAttributes($formField);
                    this.updateFieldValidationClasses($formField);

                    if (!$formField.checkValidity()) {
                        isValid = false;
                    }
                }

                this.validateGroups($form, true);

                if (!isValid || !$form.checkValidity()) {
                    event.preventDefault();
                    $form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    setTimeout(() => {
                        this.showSubmitMessage($form);
                    }, 100);                    
                }
            });
        }
    },

    updateFieldAttributes($formField) {
        if ($formField.tagName === 'INPUT' || $formField.tagName === 'TEXTAREA') {
            $formField.setAttribute('value', $formField.value);

            if ($formField.tagName === 'TEXTAREA') {
                $formField.setAttribute('data-value', $formField.value);
            }
        }
    },

    updateFieldValidationClasses($formField) {
        if ($formField.hasAttribute(this.vars.attributes.validationRequired)) {
            $formField.setAttribute('required', '');

            if (!$formField.checkValidity()) {
                $formField.classList.add(this.vars.classes.invalid);
                $formField.classList.remove(this.vars.classes.valid);
            } else {
                $formField.classList.add(this.vars.classes.valid);
                $formField.classList.remove(this.vars.classes.invalid);
            }
        }
    },

    validateGroups($form, triggeredBySubmit) {
        this.validateCheckboxGroups($form, triggeredBySubmit);
        this.validateRadioGroups($form, triggeredBySubmit);
    },

    validateCheckboxGroups($form, triggeredBySubmit) {
        const $checkboxGroups = $form.querySelectorAll(this.vars.queries.checkboxGroupRequired);

        for (const $checkboxGroup of $checkboxGroups) {
            const $checkboxes = $checkboxGroup.querySelectorAll('input[type=checkbox]');
            const isOneChecked = Array.from($checkboxes).some(($checkbox) => $checkbox.checked);

            if (triggeredBySubmit) {
                $checkboxGroup.classList.toggle(this.vars.classes.invalid, !isOneChecked);
                $checkboxGroup.classList.toggle(this.vars.classes.valid, isOneChecked);
            }

            $checkboxes.forEach(($checkbox) => {
                $checkbox.addEventListener('change', () => {
                    const isChecked = Array.from($checkboxes).some(($cb) => $cb.checked);

                    $checkboxGroup.classList.toggle(this.vars.classes.invalid, !isChecked);
                    $checkboxGroup.classList.toggle(this.vars.classes.valid, isChecked);

                    for (const $checkbox of $checkboxes) {
                        $checkbox.required != isChecked;
                    }
                });
            });
        }
    },

    validateRadioGroups($form, triggeredBySubmit) {
        const $radioGroups = $form.querySelectorAll(this.vars.queries.radioGroupRequired);

        for (const $radioGroup of $radioGroups) {
            const $radios = $radioGroup.querySelectorAll('input[type=radio]');
            const isOneSelected = Array.from($radios).some(($radio) => $radio.checked);

            if (triggeredBySubmit) {
                $radioGroup.classList.toggle(this.vars.classes.invalid, !isOneSelected);
                $radioGroup.classList.toggle(this.vars.classes.valid, isOneSelected);
            }

            $radios.forEach(($radio) => {
                $radio.addEventListener('change', () => {
                    const isSelected = Array.from($radios).some(($rd) => $rd.checked);

                    $radioGroup.classList.toggle(this.vars.classes.invalid, !isSelected);
                    $radioGroup.classList.toggle(this.vars.classes.valid, isSelected);

                    for (const $radio of $radios) {
                        $radio.required != isSelected;
                    }
                });
            });
        }
    },    

    showSubmitMessage($form) {
        const submitMessage = $form.getAttribute(this.vars.attributes.submitMessage);

        if (submitMessage) {
            $form.innerHTML = `<p class="${this.vars.classes.submitMessage}">${submitMessage}</p>`;
        }

        $form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },

    manualSubmit($form, submitHandler) {
        if (!$form) return;

        $form.addEventListener(this.vars.events.submit, (event) => {
            if ($form.checkValidity()) {
                submitHandler(event);
            }

            event.preventDefault();
        });
    }
};
