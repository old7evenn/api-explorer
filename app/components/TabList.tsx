import React, { useState } from 'react';

import { Card } from 'antd';

import 'assets/styles/globals.css';

export interface TabListProps {
  tabList: {
    key: string;
    label: string;
  }[];
  contentList: Record<string, React.ReactNode>;
}

export const TabList: React.FC<TabListProps> = ({ tabList, contentList }) => {
  const [activeTab, setActiveTab] = useState<string>('header');

  const onTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <>
      <Card
        style={{ width: '100%' }}
        tabList={tabList}
        activeTabKey={activeTab}
        onTabChange={onTabChange}
        tabProps={{
          size: 'middle',
        }}
        className="bg-background text-foreground custom-card"
      >
        {contentList[activeTab]}
      </Card>
    </>
  );
};
