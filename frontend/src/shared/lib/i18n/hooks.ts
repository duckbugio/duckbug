import {useTranslation as useI18nTranslation} from 'react-i18next';
import {LANGUAGES, type Language} from '@/app/constants';

export const useTranslation = () => {
    const {t, i18n} = useI18nTranslation();

    const changeLanguage = (lang: Language) => {
        i18n.changeLanguage(lang);
    };

    const currentLanguage = (i18n.language as Language) || LANGUAGES.RU;

    return {
        t,
        changeLanguage,
        currentLanguage,
        i18n,
    };
};
