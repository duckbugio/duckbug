import {Button, Select} from '@gravity-ui/uikit';
import {useTranslation} from '@/shared/lib/i18n/hooks';
import {LANGUAGES} from '@/app/constants';

export const LanguageSwitcher = () => {
    const {currentLanguage, changeLanguage} = useTranslation();

    const options = [
        {value: LANGUAGES.RU, content: 'Русский'},
        {value: LANGUAGES.EN, content: 'English'},
    ];

    return (
        <Select
            value={[currentLanguage]}
            onUpdate={(value) => changeLanguage(value[0] as typeof LANGUAGES[keyof typeof LANGUAGES])}
            options={options}
            size="s"
        />
    );
};
