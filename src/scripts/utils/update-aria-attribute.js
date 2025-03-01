export function updateAriaAttribute($element, attribute, value = null) {
    
    if (!$element || !attribute) {
        return;
    }


    if (value === null) {
        $element.setAttribute(attribute, currentValue === "true" ? "false" : "true");
    } else {
        $element.setAttribute(attribute, value);
    }

}
