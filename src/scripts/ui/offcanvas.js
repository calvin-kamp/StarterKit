export const offcanvas = {

    vars: {

        queries: {
            element:                    '*[data-js=offcanvas]',
            wrapper:                    '*[data-offcanvas-wrapper]',
            openTrigger:                '*[data-offcanvas-open-id]',
            closeTrigger:               '*[data-offcanvas-close]',
        },

        attributes: {
            openTriggerId:              'data-offcanvas-open-id',
            offcanvasId:                'data-offcanvas-id',
        },

        showClass:                      'offcanvas--show'

    },

    init() {

        const $offcanvasElements = this.findElements();

        if (!$offcanvasElements.length) {
            console.warn('No offcanvas elements found.');
            return;
        }

        this.moveElementsToBody($offcanvasElements);
        this.addEventTriggers();

    },

    findElements() {

        return Array.from(document.querySelectorAll(this.vars.queries.element));

    },

    moveElementsToBody($elements) {

        for (const $element of $elements) {
            document.body.appendChild($element.cloneNode(true));
            $element.remove();
        }

    },

    addEventTriggers() {

        this.addOpenTrigger();
        this.addClickOutsideTrigger();
        this.addCloseTrigger();

    },

    addOpenTrigger() {

        const $openTriggers = document.querySelectorAll(this.vars.queries.openTrigger);

        for (const $openTrigger of $openTriggers) {

            $openTrigger.addEventListener('click', (event) => {
                event.preventDefault();

                const offcanvasId = $openTrigger.getAttribute(this.vars.attributes.openTriggerId);
                const $offcanvas = document.querySelector(`[${this.vars.attributes.offcanvasId}="${offcanvasId}"]`);

                if ($offcanvas) {
                    this.show($offcanvas);
                } else {
                    console.error('Offcanvas element not found for trigger:', $openTrigger);
                }
            });

        }

    },

    addClickOutsideTrigger() {

        const $offcanvasElements = this.findElements();

        for (const $offcanvas of $offcanvasElements) {

            $offcanvas.addEventListener('click', (event) => {
                const $target = event.target;

                if (!$target.closest(this.vars.queries.wrapper)) {
                    this.hide($offcanvas);
                }
            });

        }

    },

    addCloseTrigger() {

        const $closeTriggers = document.querySelectorAll(this.vars.queries.closeTrigger);

        for (const $closeTrigger of $closeTriggers) {

            $closeTrigger.addEventListener('click', (event) => {
                const $offcanvas = event.target.closest(this.vars.queries.element);

                if ($offcanvas) {
                    this.hide($offcanvas);
                }
            });

        }

    },

    show($offcanvas) {

        $offcanvas.classList.add(this.vars.showClass);

    },

    hide($offcanvas) {

        $offcanvas.classList.remove(this.vars.showClass);

    }

};
