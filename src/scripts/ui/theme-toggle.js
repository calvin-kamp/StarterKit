import { theme, toggleTheme } from "@stores/theme";

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

        $themeToggleTrigger.addEventListener('click', () => {

            toggleTheme();

            this.updateThemeClasses($themeToggle);

        })

    },

    updateThemeClasses($themeToggle) {

        const currentTheme = theme.get();

        if (currentTheme === 'light') {
            $themeToggle.classList.add(this.vars.classes.lightTheme);
            $themeToggle.classList.remove(this.vars.classes.darkTheme);
        } else if (currentTheme === 'dark') {
            $themeToggle.classList.add(this.vars.classes.darkTheme);
            $themeToggle.classList.remove(this.vars.classes.lightTheme);
        }

    }
    
}