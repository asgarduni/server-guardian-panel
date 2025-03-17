
import React from 'react';
import ServerStatus from '@/components/ServerStatus';
import Map from '@/components/Map';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "p-6 md:p-8 space-y-8",
      !isMobile && "ml-64" // Add margin when sidebar is visible
    )}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your Traccar server</p>
      </div>
      
      <ServerStatus />
      <Map />
    </div>
  );
};

export default Dashboard;
