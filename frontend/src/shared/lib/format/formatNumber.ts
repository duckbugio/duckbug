export const formatNumber = (function () {
    return function (
        number: number | string,
        locale = 'ru-RU',
        options: Intl.NumberFormatOptions = {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        },
    ): string {
        const parsedNumber = typeof number === 'string' ? parseFloat(number) : number;

        if (isNaN(parsedNumber)) {
            throw new Error('Invalid number');
        }

        return new Intl.NumberFormat(locale, options).format(parsedNumber);
    };
})();
