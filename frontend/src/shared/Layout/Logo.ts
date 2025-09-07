import {LogoProps} from '@gravity-ui/navigation/build/esm/components/types';
import {Ghost} from '@gravity-ui/icons';

export const getLogo = (): LogoProps => ({
    icon: Ghost,
    text: 'Organization name',
});
