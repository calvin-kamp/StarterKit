import { updateAriaAttribute } from '@scripts/utils/update-aria-attribute.js';

export const expandableContent = {

    vars: {

        queries: {
            element:                    '*[data-js=expandable-content]',
            wrapper:                    '*[data-expandable-content-wrapper]',
            toggle:                     '*[data-expandable-content-toggle]',
        },

        classes: {
            expanded:                   'expandable-content--expanded',
            expandable:                 'expandable-content--expandable'
        }

    },

    init() {

        const $expandableElements = this.findElements();

        if (!$expandableElements.length) {
            console.warn('No expandable content elements found.');
            return;
        }

        this.addEventTriggers();
        this.updateExpandability();

        window.addEventListener('resize', () => {
            this.updateExpandability();
        });

    },

    findElements() {

        return Array.from(document.querySelectorAll(this.vars.queries.element));

    },

    addEventTriggers() {

        this.addToggleTrigger();

    },

    addToggleTrigger() {

        const $toggleButtons = document.querySelectorAll(this.vars.queries.toggle);

        for (const $toggleButton of $toggleButtons) {
            $toggleButton.addEventListener('click', (event) => {
                event.preventDefault();

                const $expandableContent = $toggleButton.closest(this.vars.queries.element);

                if ($expandableContent) {
                    this.toggleExpand($expandableContent, $toggleButton);
                } else {
                    console.error('Expandable content element not found for trigger:', $toggleButton);
                }
            });
        }

    },

    toggleExpand($expandableContent, $toggleButton) {

        const $contentWrapper = $expandableContent.querySelector(this.vars.queries.wrapper);
        if (!$contentWrapper) {
            return;
        }

        const isExpanded = $expandableContent.classList.contains(this.vars.classes.expanded);

        if (isExpanded) {
            this.collapse($expandableContent, $contentWrapper);

            updateAriaAttribute($toggleButton, 'aria-expanded', 'false');
        } else {
            this.expand($expandableContent, $contentWrapper);
            
            updateAriaAttribute($toggleButton, 'aria-expanded', 'true');
        }

    },

    collapse($expandableContent, $contentWrapper) {

        $expandableContent.classList.remove(this.vars.classes.expanded);

        requestAnimationFrame(() => {
            $contentWrapper.style.maxHeight = '';
        });

    },

    expand($expandableContent, $contentWrapper) {

        const contentWrapperHeight = $contentWrapper.scrollHeight;

        $expandableContent.classList.add(this.vars.classes.expanded);

        requestAnimationFrame(() => {
            $contentWrapper.style.maxHeight = `${contentWrapperHeight}px`;
        });

    },

    checkIfExpandable($expandableContent) {

        const $contentWrapper = $expandableContent.querySelector(this.vars.queries.wrapper);
        if (!$contentWrapper) return;

        if ($contentWrapper.scrollHeight > $contentWrapper.offsetHeight) {
            $expandableContent.classList.add(this.vars.classes.expandable);
        } else {
            $expandableContent.classList.remove(this.vars.classes.expandable);
        }

    },

    updateExpandability() {

        this.findElements().forEach($expandableContent => {
            this.checkIfExpandable($expandableContent);
        });

    }

};
