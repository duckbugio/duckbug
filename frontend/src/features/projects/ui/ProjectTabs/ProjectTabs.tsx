import {Icon, Tab, TabList} from '@gravity-ui/uikit';
import {BookOpen, CircleExclamation, TriangleExclamation} from '@gravity-ui/icons';
import React from 'react';
import {formatNumber} from '@/shared/lib/format/formatNumber';

export enum TabsState {
    QUICK_START = 'quickStart',
    ERRORS = 'errors',
    LOGS = 'logs',
}

type TabsProps = {
    activeTab: TabsState;
    setActiveTab: (value: TabsState) => void;
    errorsTotal: number;
    logsTotal: number;
};

const ProjectTabs: React.FC<TabsProps> = ({activeTab, setActiveTab, errorsTotal, logsTotal}) => {
    const handleTabChange = (newValue: string) => {
        if (Object.values(TabsState).includes(newValue as TabsState)) {
            setActiveTab(newValue as TabsState);
        } else {
            setActiveTab(TabsState.ERRORS);
        }
    };

    return (
        <TabList
            style={{marginBottom: '16px'}}
            size={'xl'}
            value={activeTab}
            onUpdate={(value) => handleTabChange(value)}
        >
            <Tab value={TabsState.QUICK_START.toString()} icon={<Icon data={BookOpen} />}>
                Быстрый старт
            </Tab>
            <Tab
                value={TabsState.ERRORS.toString()}
                icon={<Icon data={TriangleExclamation} />}
                counter={formatNumber(errorsTotal)}
            >
                Ошибки
            </Tab>
            <Tab
                value={TabsState.LOGS.toString()}
                icon={<Icon data={CircleExclamation} />}
                counter={formatNumber(logsTotal)}
            >
                Логи
            </Tab>
        </TabList>
    );
};

export default ProjectTabs;
