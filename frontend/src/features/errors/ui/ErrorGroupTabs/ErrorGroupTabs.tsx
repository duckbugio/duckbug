import {Icon, Tab, TabList} from '@gravity-ui/uikit';
import {BroadcastSignal, FileText, LayoutList, SquareDashed} from '@gravity-ui/icons';
import React from 'react';
import {Err} from '@/entities/error/model/types';

export enum ErrorGroupTabsState {
    STACK_TRACE = 'stackTrace',
    CONTEXT = 'context',
    REQUEST = 'request',
    ENV = 'env',
}

type ErrorGroupTabsProps = {
    activeTab: ErrorGroupTabsState;
    setActiveTab: (value: ErrorGroupTabsState) => void;
    err: Err;
};

const ErrorGroupTabs: React.FC<ErrorGroupTabsProps> = ({activeTab, setActiveTab, err}) => {
    const handleTabChange = (newValue: string) => {
        if (Object.values(ErrorGroupTabsState).includes(newValue as ErrorGroupTabsState)) {
            setActiveTab(newValue as ErrorGroupTabsState);
        } else {
            setActiveTab(ErrorGroupTabsState.CONTEXT);
        }
    };

    return (
        <TabList
            style={{marginBottom: '16px'}}
            size={'xl'}
            value={activeTab}
            onUpdate={(value) => handleTabChange(value)}
        >
            <Tab
                value={ErrorGroupTabsState.STACK_TRACE.toString()}
                icon={<Icon data={BroadcastSignal} />}
            >
                Stack trace
            </Tab>

            {err.context && (
                <Tab
                    value={ErrorGroupTabsState.CONTEXT.toString()}
                    icon={<Icon data={SquareDashed} />}
                >
                    Context
                </Tab>
            )}

            {err.url && (
                <Tab
                    value={ErrorGroupTabsState.REQUEST.toString()}
                    icon={<Icon data={LayoutList} />}
                >
                    Request
                </Tab>
            )}

            {err.env && (
                <Tab value={ErrorGroupTabsState.ENV.toString()} icon={<Icon data={FileText} />}>
                    ENV
                </Tab>
            )}
        </TabList>
    );
};

export default ErrorGroupTabs;
