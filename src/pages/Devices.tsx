
import React from 'react';
import DeviceList from '@/components/DeviceList';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Devices: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "p-6 md:p-8 space-y-8",
      !isMobile && "ml-64" // Add margin when sidebar is visible
    )}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Devices</h1>
        <p className="text-muted-foreground">Manage your tracking devices</p>
      </div>
      
      <DeviceList />
    </div>
  );
};

export default Devices;
