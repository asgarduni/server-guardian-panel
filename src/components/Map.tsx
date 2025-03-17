
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, RefreshCw, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getLatestPositions, Position, Device, getDevices } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [devices, setDevices] = useState<Record<number, Device>>({});
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setRefreshing(true);
      
      // Get devices and latest positions
      const devicesData = await getDevices();
      const devicesMap = devicesData.reduce((acc, device) => {
        acc[device.id] = device;
        return acc;
      }, {} as Record<number, Device>);
      
      setDevices(devicesMap);
      
      const positionsData = await getLatestPositions();
      setPositions(positionsData);
    } catch (error) {
      console.error('Failed to fetch map data', error);
      toast({
        title: 'Error',
        description: 'Failed to load map data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // This would typically initialize and update a map library like Leaflet or Google Maps
    // For this demo, we're creating a simple visual representation
    if (!mapRef.current || positions.length === 0) return;
    
    const renderMap = () => {
      const mapElement = mapRef.current;
      if (!mapElement) return;

      // Clear previous markers
      const existingMarkers = mapElement.querySelectorAll('.map-marker');
      existingMarkers.forEach(marker => marker.remove());

      // Create markers for each position
      positions.forEach(position => {
        const device = devices[position.deviceId];
        if (!device) return;
        
        // Calculate position in the container (simple representation)
        // In a real implementation, you would use proper geo-coordinates
        const x = (position.longitude + 180) / 360 * mapElement.clientWidth;
        const y = (90 - position.latitude) / 180 * mapElement.clientHeight;
        
        // Create marker element
        const marker = document.createElement('div');
        marker.className = 'map-marker animate-scale-in';
        marker.style.left = `${x}px`;
        marker.style.top = `${y}px`;
        
        // Add device information
        const tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        tooltip.innerHTML = `
          <strong>${device.name}</strong><br>
          Speed: ${position.speed.toFixed(1)} km/h<br>
          Last update: ${new Date(position.deviceTime).toLocaleString()}
        `;
        
        marker.appendChild(tooltip);
        mapElement.appendChild(marker);
        
        // Add click event
        marker.addEventListener('click', () => {
          // Toggle tooltip visibility
          tooltip.classList.toggle('active');
        });
      });
    };
    
    renderMap();
    
    // Update when window is resized
    window.addEventListener('resize', renderMap);
    return () => window.removeEventListener('resize', renderMap);
  }, [positions, devices]);

  return (
    <div className="space-y-6 animate-scale-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Live Tracking</h2>
        <Button 
          size="sm" 
          variant="outline"
          onClick={fetchData}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>
      
      <Card className="overflow-hidden transition-all-200 hover:shadow-md">
        <CardHeader className="bg-secondary/50 p-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <MapPin className="h-4 w-4" />
            Device Locations ({positions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-[500px] relative">
          {loading ? (
            <div className="h-full flex items-center justify-center bg-muted/20 animate-pulse">
              <div className="flex flex-col items-center text-muted-foreground">
                <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                <p>Loading map data...</p>
              </div>
            </div>
          ) : positions.length === 0 ? (
            <div className="h-full flex items-center justify-center bg-muted/20">
              <div className="flex flex-col items-center text-muted-foreground">
                <MapPin className="h-8 w-8 mb-2" />
                <p>No active devices to display</p>
              </div>
            </div>
          ) : (
            <div ref={mapRef} className="h-full w-full relative bg-[#f8f9fa]">
              {/* Map content will be dynamically added here */}
              <div className="absolute inset-0 p-2 text-xs text-muted-foreground">
                <p>This is a simplified map view. In a production implementation, you would integrate a maps library like Leaflet, Google Maps, or Mapbox.</p>
              </div>
              <div className="absolute bottom-4 right-4 z-10">
                <div className="bg-white p-2 rounded-lg shadow-md text-xs">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <span>Active devices: {positions.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <style jsx>{`
        .map-marker {
          position: absolute;
          width: 20px;
          height: 20px;
          background-color: hsl(var(--primary));
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          cursor: pointer;
          box-shadow: 0 0 0 2px white;
          transition: all 0.3s ease;
        }
        
        .map-marker:hover {
          transform: translate(-50%, -50%) scale(1.2);
        }
        
        .map-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: white;
          color: black;
          padding: 8px;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          width: 180px;
          display: none;
          z-index: 20;
          margin-bottom: 8px;
          pointer-events: none;
          font-size: 12px;
          white-space: nowrap;
        }
        
        .map-marker:hover .map-tooltip,
        .map-tooltip.active {
          display: block;
        }
        
        .map-tooltip:after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: white;
        }
      `}</style>
    </div>
  );
};

export default Map;
