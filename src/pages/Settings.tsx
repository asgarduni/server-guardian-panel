
import React from 'react';
import SettingsComponent from '@/components/Settings';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const SettingsPage: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "p-6 md:p-8 space-y-8",
      !isMobile && "ml-64" // Add margin when sidebar is visible
    )}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your Traccar server</p>
      </div>
      
      <SettingsComponent />
    </div>
  );
};

export default SettingsPage;
