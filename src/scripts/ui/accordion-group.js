import Accordion from 'accordion-js';

export const accordionGroup = {

    vars: {

        elementQuery:               '*[data-js=accordion-group]',

        settingsAttribute:          'data-accordion-settings',

        additionalGeneralOptions: {

            onOpen: function ($currentElement) {

                window.scrollTo({

                    top: getOffsetPosition($currentElement),
                    behavior: 'smooth',

                });

            },

        },

    },

    init() {

        const $accordionGroups = this.findElements();

        if (!$accordionGroups) {

            console.warn('No accordion elements found.');

            return;

        }

        for (const $accordionGroup of $accordionGroups) {

            this.initializeElement($accordionGroup);

        }

    },

    findElements() {

        return Array.from(document.querySelectorAll(this.vars.elementQuery));

    },

    initializeElement($element) {

        let accordionOptions = $element.getAttribute(this.vars.settingsAttribute);

        try {

            accordionOptions = JSON.parse(decodeURIComponent(accordionOptions));

        } catch (error) {

            console.warn('Invalid accordion settings for element:', $element, error);
            accordionOptions = {};

        }

        if (!accordionOptions.disableAdditionalGeneralOptions) {
            accordionOptions = {
                ...accordionOptions,
                ...this.vars.additionalGeneralOptions,
            };
        }

        new Accordion($element, accordionOptions);

    }

}
