
import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Cpu, 
  Smartphone, 
  User, 
  HardDrive,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { getServerStats, ServerStats } from '@/lib/api';
import { cn } from '@/lib/utils';

const ServerStatus: React.FC = () => {
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const data = await getServerStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch server stats', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatMemory = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(1)} GB`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const memoryUsage = (stats.usedMemory / stats.totalMemory) * 100;

  return (
    <div className="space-y-6 animate-scale-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Server Status</h2>
        <Button 
          size="sm" 
          variant="outline"
          onClick={fetchStats}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden transition-all-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">CPU Load</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="text-2xl font-bold">{stats.cpuLoad.toFixed(1)}%</div>
            <Progress 
              value={stats.cpuLoad} 
              className={cn(
                "h-2 mt-2",
                stats.cpuLoad > 80 ? "bg-secondary [&>div]:bg-destructive" : 
                stats.cpuLoad > 50 ? "bg-secondary [&>div]:bg-amber-500" : 
                "bg-secondary [&>div]:bg-primary"
              )}
            />
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="text-2xl font-bold">
              {formatMemory(stats.usedMemory)} / {formatMemory(stats.totalMemory)}
            </div>
            <Progress 
              value={memoryUsage} 
              className={cn(
                "h-2 mt-2",
                memoryUsage > 80 ? "bg-secondary [&>div]:bg-destructive" : 
                memoryUsage > 50 ? "bg-secondary [&>div]:bg-amber-500" : 
                "bg-secondary [&>div]:bg-primary"
              )}
            />
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="text-2xl font-bold">{stats.activeDevices}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Connected to the server
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Currently online
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden transition-all-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 space-y-0">
          <CardTitle className="text-base font-medium">Server Information</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Server Address</span>
                <span className="text-sm font-medium">181.189.124.150:8082</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">API Endpoint</span>
                <span className="text-sm font-medium">http://181.189.124.150:8082/api</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Protocol</span>
                <span className="text-sm font-medium">HTTP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerStatus;
