export const flyingFocus = {

    vars: {
        
        elementQuery:                   '*[data-js=flying-focus]',

        visibleClass:                   'flying-focus--visible',

        focusElement:                   null,

        lastRect:                       null,

        isKeyboardNavigation:           false

    },

    init() {

        this.vars.focusElement = document.querySelector(this.vars.elementQuery);

        if (!this.vars.focusElement) {
            console.error("Flying focus element not found.");
            return;
        }

        this.addEventTriggers();

    },

    addEventTriggers() {
        
        document.addEventListener("keydown", (event) => {
            const key = event.key;
            if (key === "Tab" || key.startsWith("Arrow")) {
                this.vars.isKeyboardNavigation = true;
            }
        });

        
        document.addEventListener("mousedown", () => {
            this.vars.isKeyboardNavigation = false;
        });

        document.addEventListener("focusin", (event) => {
            this.updateFocus(event);
        });

        document.addEventListener("focusout", () => {
            this.removeFocus();
        });

    },

    updateFocus(event) {

        if (!this.vars.isKeyboardNavigation) {
            return;
        }

        const target = event.target;
        if (!target || !target.getBoundingClientRect) {
            return;
        }

        const rect = target.getBoundingClientRect();
        const focusEl = this.vars.focusElement;

        
        focusEl.style.width = `${rect.width}px`;
        focusEl.style.height = `${rect.height}px`;
        focusEl.style.left = `${rect.left + window.scrollX}px`;
        focusEl.style.top = `${rect.top + window.scrollY}px`;

        
        focusEl.classList.add(this.vars.visibleClass);

    },

    removeFocus() {

        this.vars.focusElement.classList.remove(this.vars.visibleClass);

    }

};
