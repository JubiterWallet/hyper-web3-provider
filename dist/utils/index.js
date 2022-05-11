/**
 * get Site Icon from window
 * @param {*} window
 * @returns
 */
export function getSiteIcon(window) {
    var document = window.document;
    // Use the site's favicon if it exists
    var shortcutIcon = document.querySelector('head > link[rel="shortcut icon"]');
    if (shortcutIcon) {
        return shortcutIcon.href;
    }
    // Search through available icons in no particular order
    var icon = Array.prototype.slice.call(document.querySelectorAll('head > link[rel="icon"]')).find(function (icon) { return Boolean(icon.href); });
    if (icon) {
        return icon.href;
    }
    return null;
}
