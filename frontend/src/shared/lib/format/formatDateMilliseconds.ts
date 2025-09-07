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

const formatDateTime = (date: number) => {
    return formatDateTimeMilliseconds(date * 1000);
};

const unixToHumanReadable = (unixTimestamp: number): string => {
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
            return 'только что';
        } else if (diffMinutes < 60) {
            return `${diffMinutes} мин. назад`;
        } else {
            return `сегодня в ${formatTime(date)}`;
        }
    } else if (inputDate.getTime() === yesterday.getTime()) {
        return `вчера в ${formatTime(date)}`;
    } else {
        return formatDateTime(unixTimestamp);
    }
};

export {unixToHumanReadable, formatDateTime, formatDateMilliseconds, formatDateTimeMilliseconds};
