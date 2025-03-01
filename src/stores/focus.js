import { atom } from 'nanostores';

export const focusStore = atom(null);

export function saveFocus() {
    const activeElement = document.activeElement;

    if (activeElement && typeof activeElement.focus === 'function') {
        focusStore.set(activeElement);
    }
}

export function restoreFocus() {
    const lastFocusedElement = focusStore.get();

    if (lastFocusedElement) {
        setTimeout(() => {
            lastFocusedElement.focus();
        }, 10);
    }
}
