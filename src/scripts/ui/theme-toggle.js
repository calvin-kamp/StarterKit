import { theme, toggleTheme } from "@stores/theme";
import { updateAriaAttribute } from "@scripts/utils/update-aria-attribute.js";

export const themeToggle = {

    vars: {

        queries: {
            element:                    '*[data-js=theme-toggle]',
            themeToggle:                '*[data-theme-toggle-trigger]'
        },

        classes: {
            lightTheme:                 'theme-toggle--light',
            darkTheme:                  'theme-toggle--dark'
        }

    },

    init() {

        const $themeToggles = this.findElements();

        if (!$themeToggles.length) {
            console.warn('No theme-toggle elements found.');
            return;
        }

        for (const $themeToggle of $themeToggles) {
            this.addEventTrigger($themeToggle);
            theme.subscribe(() => this.updateThemeClasses($themeToggle));
        }

    },

    findElements() {

        return Array.from(document.querySelectorAll(this.vars.queries.element));

    },

    addEventTrigger($themeToggle) {

        const $themeToggleTrigger = $themeToggle.querySelector(this.vars.queries.themeToggle);

        if (!$themeToggleTrigger) {
            console.warn('No theme toggle trigger found.');
            return;
        }

        $themeToggleTrigger.addEventListener('click', () => {

            toggleTheme();

            this.updateThemeClasses($themeToggle);

        })

    },

    updateThemeClasses($themeToggle) {

        const currentTheme = theme.get();
        const $toggleButton = $themeToggle.querySelector('button');

        if (!$toggleButton) {
            console.warn('No toggle button found inside theme toggle.');
            return;
        }

        $themeToggle.classList.toggle(this.vars.classes.lightTheme, currentTheme === 'light');
        $themeToggle.classList.toggle(this.vars.classes.darkTheme, currentTheme === 'dark');

        updateAriaAttribute($toggleButton, "aria-label", 
            currentTheme === 'light' 
            ? 'Switch color theme to dark' 
            : 'Switch color theme to light'
        );

    }

}
