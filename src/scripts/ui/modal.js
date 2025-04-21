import { updateAriaAttribute } from '@scripts/utils/update-aria-attribute.js';
import { saveFocus, restoreFocus } from '@stores/focus.js';

export const modal = {
    vars: {

        queries: {
            element:                    '*[data-js=modal]',
            wrapper:                    '*[data-modal-wrapper]',
            openTrigger:                '*[data-modal-open-id]',
            closeTrigger:               '*[data-modal-close]',
            focusable:                  'button, a, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        },

        attributes: {
            openTriggerId:              'data-modal-open-id',
            modalId:                    'data-modal-id',
        },

        showClass:                      'modal--show'

    },

    init() {

        const $modals = this.findElements();

        if (!$modals.length) {
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

                const modalId = $openTrigger.getAttribute(this.vars.attributes.openTriggerId);
                const $modal = document.querySelector(`[${this.vars.attributes.modalId}='${modalId}']`);

                if ($modal) {
                    saveFocus();
                    this.show($modal);
                } else {
                    console.error('Modal element not found for trigger:', $openTrigger);
                }
            });

        }

    },

    addClickOutsideTrigger() {

        const $modals = this.findElements();

        for (const $modal of $modals) {

            $modal.addEventListener('click', (event) => {
                if (!event.target.closest(this.vars.queries.wrapper)) {
                    this.hide($modal);
                }
            });

        }

    },

    addCloseTrigger() {

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

    addKeyboardListener() {

        document.addEventListener('keydown', (event) => {

            if (event.key === 'Escape') {
                const $openModal = document.querySelector(`.${this.vars.showClass}`);

                if ($openModal) {
                    this.hide($openModal);
                }
            }

        });

    },

    show($modal) {

        $modal.classList.add(this.vars.showClass);
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';

        if(scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
        
        updateAriaAttribute($modal, 'aria-hidden', 'false');

        const $focusableElements = $modal.querySelectorAll(this.vars.queries.focusable);

        if ($focusableElements?.length) {
            $focusableElements[0].focus();
        }

        this.trapFocus($modal);
        document.querySelector('main').setAttribute('inert', '');

    },

    hide($modal) {

        $modal.classList.remove(this.vars.showClass);

        document.body.style.overflow = '';
        document.body.style.height = '';
        document.body.style.paddingRight = '';

        updateAriaAttribute($modal, 'aria-hidden', 'true');

        restoreFocus();

        document.querySelector('main').removeAttribute('inert');

    },

    trapFocus($modal) {

        const $focusableElements = Array.from($modal.querySelectorAll(this.vars.queries.focusable));

        if (!$focusableElements.length === 0) {
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

        $modal.addEventListener('keydown', handleTabKey);

    }

};
