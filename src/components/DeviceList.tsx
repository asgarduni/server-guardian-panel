
import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  MoreVertical,
  RefreshCw,
  PlusCircle,
  Pencil, 
  Trash2, 
  MapPin, 
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { getDevices, addDevice, updateDevice, deleteDevice, Device } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

const DeviceList: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showDeviceDialog, setShowDeviceDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [newDevice, setNewDevice] = useState<Partial<Device>>({
    name: '',
    uniqueId: '',
  });
  
  const { toast } = useToast();

  const fetchDevices = async () => {
    try {
      setRefreshing(true);
      const data = await getDevices();
      setDevices(data);
      setFilteredDevices(data);
    } catch (error) {
      console.error('Failed to fetch devices', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch devices',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    
    // Refresh devices every minute
    const interval = setInterval(fetchDevices, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = devices.filter(device => 
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        device.uniqueId.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDevices(filtered);
    } else {
      setFilteredDevices(devices);
    }
  }, [searchQuery, devices]);

  const handleAddDevice = () => {
    setSelectedDevice(null);
    setNewDevice({ name: '', uniqueId: '' });
    setShowDeviceDialog(true);
  };

  const handleEditDevice = (device: Device) => {
    setSelectedDevice(device);
    setNewDevice({
      name: device.name,
      uniqueId: device.uniqueId,
    });
    setShowDeviceDialog(true);
  };

  const handleDeleteDevice = (device: Device) => {
    setSelectedDevice(device);
    setShowDeleteDialog(true);
  };

  const handleViewOnMap = (device: Device) => {
    // This would typically navigate to a map view focused on this device
    toast({
      title: 'Map View',
      description: `Showing device "${device.name}" on map`,
    });
  };

  const handleSaveDevice = async () => {
    try {
      if (!newDevice.name || !newDevice.uniqueId) {
        toast({
          title: 'Validation Error',
          description: 'Name and ID are required',
          variant: 'destructive',
        });
        return;
      }

      if (selectedDevice) {
        // Update existing device
        await updateDevice(selectedDevice.id, newDevice);
        toast({
          title: 'Success',
          description: 'Device updated successfully',
        });
      } else {
        // Add new device
        await addDevice(newDevice);
        toast({
          title: 'Success',
          description: 'Device added successfully',
        });
      }
      
      setShowDeviceDialog(false);
      fetchDevices();
    } catch (error) {
      console.error('Failed to save device', error);
      toast({
        title: 'Error',
        description: 'Failed to save device',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDevice) return;
    
    try {
      await deleteDevice(selectedDevice.id);
      toast({
        title: 'Success',
        description: 'Device deleted successfully',
      });
      setShowDeleteDialog(false);
      fetchDevices();
    } catch (error) {
      console.error('Failed to delete device', error);
      toast({
        title: 'Error',
        description: 'Failed to delete device',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="outline" className="text-muted-foreground">Offline</Badge>;
      case 'unknown':
        return <Badge variant="secondary">Unknown</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-muted rounded-md w-full md:w-80"></div>
        <div className="h-96 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-scale-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative">
          <Input
            placeholder="Search devices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 pl-10"
          />
          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={fetchDevices} disabled={refreshing} className="gap-2">
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button size="sm" onClick={handleAddDevice} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Device
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden transition-all-200 hover:shadow-md">
        <CardHeader className="bg-secondary/50 p-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Smartphone className="h-4 w-4" />
            Devices ({filteredDevices.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Smartphone className="h-8 w-8 mb-2" />
                        <p>No devices found</p>
                        {searchQuery && (
                          <p className="text-sm mt-1">Try a different search term</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDevices.map((device) => (
                    <TableRow key={device.id} className="transition-all-200 hover:bg-secondary/30">
                      <TableCell className="font-medium">{device.name}</TableCell>
                      <TableCell>{device.uniqueId}</TableCell>
                      <TableCell>{getStatusBadge(device.status || 'unknown')}</TableCell>
                      <TableCell>{formatDate(device.lastUpdate)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditDevice(device)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewOnMap(device)}>
                              <MapPin className="h-4 w-4 mr-2" />
                              View on Map
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteDevice(device)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Device Dialog */}
      <Dialog open={showDeviceDialog} onOpenChange={setShowDeviceDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedDevice ? 'Edit Device' : 'Add Device'}</DialogTitle>
            <DialogDescription>
              {selectedDevice ? 'Update device information' : 'Enter details for the new device'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Device Name
              </label>
              <Input
                id="name"
                value={newDevice.name || ''}
                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                placeholder="Enter device name"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="uniqueId" className="text-sm font-medium">
                Unique ID
              </label>
              <Input
                id="uniqueId"
                value={newDevice.uniqueId || ''}
                onChange={(e) => setNewDevice({ ...newDevice, uniqueId: e.target.value })}
                placeholder="Enter device unique ID"
              />
              <p className="text-xs text-muted-foreground">
                This is typically the IMEI or other unique device identifier
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeviceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDevice}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the device
              {selectedDevice ? ` "${selectedDevice.name}"` : ''} and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeviceList;
