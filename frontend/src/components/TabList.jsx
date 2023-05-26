import React, { useState } from 'react';

function TabList({ children, onTabChange }) {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (index) => {
        setActiveTab(index);
        if (onTabChange) {
            onTabChange(index);
        }
    }

    return (
        <div className="flex space-x-4">
            {React.Children.map(children, (child, index) =>
                React.cloneElement(child, {
                    onClick: () => handleTabChange(index),
                    isActive: activeTab === index,
                })
            )}
        </div>
    );
}

export default TabList;
