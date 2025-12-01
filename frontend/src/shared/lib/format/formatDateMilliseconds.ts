type DateFormatOptions = Intl.DateTimeFormatOptions & {
    showTime?: boolean;
};

const formatDateMilliseconds = (function () {
    return function (
        date: string | number | Date,
        locale = 'ru-RU',
        options: DateFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            showTime: false,
        },
    ): string {
        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            throw new Error('Invalid date');
        }

        const defaultDateOptions: Intl.DateTimeFormatOptions = {
            year: options.year ?? 'numeric',
            month: options.month ?? 'long',
            day: options.day ?? 'numeric',
        };

        const fullOptions: Intl.DateTimeFormatOptions = options.showTime
            ? {
                  ...defaultDateOptions,
                  hour: options.hour ?? '2-digit',
                  minute: options.minute ?? '2-digit',
                  second: options.second,
              }
            : defaultDateOptions;

        return new Intl.DateTimeFormat(locale, fullOptions).format(parsedDate);
    };
})();

const formatDateTimeMilliseconds = (function () {
    return function (
        date: string | number | Date,
        locale = 'ru-RU',
        options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        },
    ) {
        return formatDateMilliseconds(date, locale, {...options, showTime: true});
    };
})();

const formatDateTime = (date: number, locale?: string) => {
    return formatDateTimeMilliseconds(date * 1000, locale);
};

const unixToHumanReadable = (
    unixTimestamp: number,
    t?: (key: string, options?: {count?: number; time?: string}) => string,
    locale?: string,
): string => {
    const date = new Date(unixTimestamp * 1000);
    const now = new Date();

    const formatTime = (d: Date): string => {
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (inputDate.getTime() === today.getTime()) {
        if (diffMinutes < 1) {
            return t ? t('format.justNow') : 'только что';
        } else if (diffMinutes < 60) {
            return t ? t('format.minutesAgo', {count: diffMinutes}) : `${diffMinutes} мин. назад`;
        } else {
            const time = formatTime(date);
            return t ? t('format.todayAt', {time}) : `сегодня в ${time}`;
        }
    } else if (inputDate.getTime() === yesterday.getTime()) {
        const time = formatTime(date);
        return t ? t('format.yesterdayAt', {time}) : `вчера в ${time}`;
    } else {
        return formatDateTime(unixTimestamp, locale);
    }
};

export {unixToHumanReadable, formatDateTime, formatDateMilliseconds, formatDateTimeMilliseconds};
