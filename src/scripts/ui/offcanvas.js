import { updateAriaAttribute } from '@scripts/utils/update-aria-attribute.js';
import { saveFocus, restoreFocus } from '@stores/focus.js';

export const offcanvas = {

    vars: {

        queries: {
            element:                    '*[data-js=offcanvas]',
            wrapper:                    '*[data-offcanvas-wrapper]',
            openTrigger:                '*[data-offcanvas-open-id]',
            closeTrigger:               '*[data-offcanvas-close]',
            focusable:                  'button, a, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
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
        this.addKeyboardListener();

    },

    addOpenTrigger() {

        const $openTriggers = document.querySelectorAll(this.vars.queries.openTrigger);

        for (const $openTrigger of $openTriggers) {

            $openTrigger.addEventListener('click', (event) => {
                event.preventDefault();

                const offcanvasId = $openTrigger.getAttribute(this.vars.attributes.openTriggerId);
                const $offcanvas = document.querySelector(`[${this.vars.attributes.offcanvasId}="${offcanvasId}"]`);

                if ($offcanvas) {
                    saveFocus();
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
                if (!event.target.closest(this.vars.queries.wrapper)) {
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

    addKeyboardListener() {

        document.addEventListener('keydown', (event) => {

            if (event.key === 'Escape') {
                const $openOffcanvas = document.querySelector(`.${this.vars.showClass}`);

                if ($openOffcanvas) {
                    this.hide($openOffcanvas);
                }
            }

        });

    },

    show($offcanvas) {

        $offcanvas.classList.add(this.vars.showClass);

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        document.body.style.paddingRight = `${scrollbarWidth}px`;

        updateAriaAttribute($offcanvas, 'aria-hidden', 'false');

        const $focusableElements = $offcanvas.querySelectorAll(this.vars.queries.focusable);

        if ($focusableElements?.length) {
            $focusableElements[0].focus();
        }

        this.trapFocus($offcanvas);
        document.querySelector('main').setAttribute('inert', '');

    },

    hide($offcanvas) {

        $offcanvas.classList.remove(this.vars.showClass);

        document.body.style.overflow = '';
        document.body.style.height = '';
        document.body.style.paddingRight = '';

        updateAriaAttribute($offcanvas, 'aria-hidden', 'true');

        restoreFocus();

        document.querySelector('main').removeAttribute('inert');

    },

    trapFocus($offcanvas) {

        const $focusableElements = Array.from($offcanvas.querySelectorAll(this.vars.queries.focusable));

        if ($focusableElements.length === 0) {
            return;
        }

        const firstElement = $focusableElements[0];
        const lastElement = $focusableElements[$focusableElements.length - 1];

        const handleTabKey = (event) => {

            if (event.key === 'Tab') {
                if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }

        };

        $offcanvas.addEventListener('keydown', handleTabKey);

    }

};
