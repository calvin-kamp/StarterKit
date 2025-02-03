export const modal = {

    vars: {

        queries: {
            element:                    '*[data-js=modal]',
            wrapper:                    '.modal__wrapper',
            openTrigger:                '*[data-open-modal]',
            closeTrigger:               '*[data-close-modal]',
        },

        triggerAttribute:               'data-open-modal',

        showClass:                      'modal--visible'

    },

    init() {

        const $modals = this.findElements();

        if (!$modals) {
            console.warn('No modal elements found.');
            return;
        }

        this.moveElementsToBody($modals);
        this.addEventTriggers();

    },

    findElements() {

        return Array.from(document.querySelectorAll(this.vars.queries.element));

    },

    moveElementsToBody($elements) {

        console.log($elements)

        for (const $element of $elements) {
            document.body.appendChild($element.cloneNode(true));
            $element.remove();
        }

    },

    addEventTriggers() {

        this.addOpenTriggers();
        this.addClickOutsideTriggers();
        this.addCloseTriggers();

    },

    addOpenTriggers() {

        const $openTriggers = document.querySelectorAll(this.vars.queries.openTrigger);

        for (const $openTrigger of $openTriggers) {

            $openTrigger.addEventListener('click', (event) => {
                event.preventDefault();

                const modalSelector = '.' + $openTrigger.getAttribute(this.vars.triggerAttribute);
                const $modal = document.querySelector(modalSelector);

                if ($modal) {
                    this.show($modal);
                } else {
                    console.error('Modal element not found for trigger:', $openTrigger);
                }
            });

        }

    },

    addClickOutsideTriggers() {

        const $modals = this.findElements();

        for (const $modal of $modals) {

            $modal.addEventListener('click', (event) => {
                const $target = event.target;

                if (!$target.closest(this.vars.queries.wrapper)) {
                    this.hide($modal);
                }
            });

        }

    },

    addCloseTriggers() {

        const $closeTriggers = document.querySelectorAll(this.vars.queries.closeTrigger);

        for (const $closeTrigger of $closeTriggers) {

            $closeTrigger.addEventListener('click', (event) => {
                const $modal = event.target.closest(this.vars.queries.element);

                if ($modal) {
                    this.hide($modal);
                }
            });

        }

    },

    show($modal) {

        $modal.classList.add(this.vars.showClass);

    },

    hide($modal) {

        $modal.classList.remove(this.vars.showClass);

    }

};
