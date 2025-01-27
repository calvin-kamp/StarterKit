import { formValidation } from "@scripts/utils/form-validation.js";

export const formExample = {

    vars: {

        moduleQuery:                    '[data-js=form-example]'

    },

    init() {

        const $formExamples = this.findModules();

        if (!$formExamples) {
            console.warn('No form-example modules found.');
            return;
        }

        for (const $formExample of $formExamples) {
            this.initializeModule($formExample);
        }

    },

    findModules() {

        return Array.from(document.querySelectorAll(this.vars.moduleQuery));

    },

    initializeModule($module) {

        const $form = $module.querySelector('form');

        if (!$form) {
            console.error('No form found within module:', $module);
            return;
        }

        formValidation.init();

        const submitHandler = (event) => {
            event.preventDefault();
            alert('Your form submit function via JS!');
        };

        formValidation.manualSubmit($form, submitHandler);

        $form.addEventListener('submit', (event) => {
            event.preventDefault();
        });

    }

};
