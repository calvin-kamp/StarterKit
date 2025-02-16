import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, Scrollbar } from 'swiper/modules';

export const swiper = {

    vars: {

        elementQuery:                   '[data-js=swiper]',

        settingsAttribute:              'data-swiper-settings',

        mainOptions: {
            modules: [Navigation, Pagination, Autoplay, Scrollbar],
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            scrollbar: {
                el: '.swiper-scrollbar',
                enabled: true,
                draggable: true
            }
        }

    },

    init() {

        const $swipers = this.findElements();

        if (!$swipers.length) {
            console.warn('No swiper elements found.');
            return;
        }

        for (const $swiper of $swipers) {
            this.initializeElement($swiper);
        }

    },

    findElements() {

        return Array.from(document.querySelectorAll(this.vars.elementQuery));

    },

    initializeElement($element) {

        const additionalOptions = $element.getAttribute(this.vars.settingsAttribute);
        let options = { ...this.vars.mainOptions };

        if (additionalOptions) {
            try {
                const parsedOptions = JSON.parse(additionalOptions);
                options = { ...options, ...parsedOptions };
            } catch (error) {
                console.warn('Invalid swiper settings for element:', $element, error);
            }
        }

        new Swiper($element, options);

    }
    
};
