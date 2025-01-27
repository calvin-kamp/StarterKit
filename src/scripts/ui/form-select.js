import TomSelect from 'tom-select';

export const formSelect = {

    vars: {

        elementQuery:                   '[data-js=form-select]',
        
        maxSelectableAttribute:         'data-select-max-selectable',

        config: {
            maxItems:                   1,
            searchField:                null
        }

    },

    init() {

        const $formSelects = this.findElements();

        if (!$formSelects) {
            console.warn('No form-select elements found.');
            return;
        }

        for (const $formSelect of $formSelects) {
            this.initializeElement($formSelect);
        }

    },

    findElements() {

        return Array.from(document.querySelectorAll(this.vars.elementQuery));

    },

    initializeElement($element) {

        const $select = $element.querySelector('select');

        if (!$select) {
            console.error('No select element found within:', $element);
            return;
        }

        const maxItems = $element.getAttribute(this.vars.maxSelectableAttribute);
        if (maxItems) {
            this.vars.config.maxItems = parseInt(maxItems, 10);
        }

        this.bind($select);

        const $input = $element.querySelector('input');
        if ($input) {
            $input.readOnly = true
        }

    },

    bind($select) {

        new TomSelect($select, this.vars.config);

    }

};
