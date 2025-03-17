
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Server, 
  Shield, 
  Bell, 
  Clock, 
  Globe,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Server settings
  const [serverSettings, setServerSettings] = useState({
    serverUrl: 'http://181.189.124.150',
    port: '8082',
    connectionTimeout: '30',
    enableSsl: false,
    debugMode: false,
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notifyOnDeviceOffline: true,
    notifyOnGeofenceViolation: true,
    notifyOnSpeedLimit: false,
    emailAddress: 'admin@example.com',
    phoneNumber: '',
  });
  
  // Display settings
  const [displaySettings, setDisplaySettings] = useState({
    distanceUnit: 'km',
    speedUnit: 'kph',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    language: 'en',
    mapType: 'osm',
  });

  const handleSaveSettings = async () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: 'Settings saved',
        description: 'Your settings have been updated successfully',
      });
    }, 1000);
    
    // In a real implementation, you would send these settings to your API
    console.log('Server settings:', serverSettings);
    console.log('Notification settings:', notificationSettings);
    console.log('Display settings:', displaySettings);
  };

  return (
    <div className="space-y-6 animate-scale-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Settings</h2>
        <Button onClick={handleSaveSettings} disabled={saving} className="gap-2">
          {saving ? (
            <>
              <Check className="h-4 w-4" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="server" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
          <TabsTrigger value="server" className="gap-2">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">Server</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="display" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Display</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="server" className="space-y-4">
          <Card>
            <CardHeader className="bg-secondary/50 p-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <Server className="h-4 w-4" />
                Server Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="serverUrl">Server URL</Label>
                  <Input
                    id="serverUrl"
                    value={serverSettings.serverUrl}
                    onChange={(e) => setServerSettings({...serverSettings, serverUrl: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    value={serverSettings.port}
                    onChange={(e) => setServerSettings({...serverSettings, port: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="connectionTimeout">Connection Timeout (seconds)</Label>
                <Input
                  id="connectionTimeout"
                  value={serverSettings.connectionTimeout}
                  onChange={(e) => setServerSettings({...serverSettings, connectionTimeout: e.target.value})}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableSsl">Enable SSL</Label>
                    <div className="text-sm text-muted-foreground">
                      Use secure connection with HTTPS
                    </div>
                  </div>
                  <Switch
                    id="enableSsl"
                    checked={serverSettings.enableSsl}
                    onCheckedChange={(checked) => setServerSettings({...serverSettings, enableSsl: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="debugMode">Debug Mode</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable verbose logging for troubleshooting
                    </div>
                  </div>
                  <Switch
                    id="debugMode"
                    checked={serverSettings.debugMode}
                    onCheckedChange={(checked) => setServerSettings({...serverSettings, debugMode: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-secondary/50 p-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <Shield className="h-4 w-4" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Security settings are managed through the Traccar server configuration file.
                Please contact your system administrator to modify these settings.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader className="bg-secondary/50 p-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <Bell className="h-4 w-4" />
                Notification Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive alerts via email
                    </div>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                  />
                </div>
                
                {notificationSettings.emailNotifications && (
                  <div className="space-y-2 pl-6 border-l-2 border-muted ml-2">
                    <Label htmlFor="emailAddress">Email Address</Label>
                    <Input
                      id="emailAddress"
                      value={notificationSettings.emailAddress}
                      onChange={(e) => setNotificationSettings({...notificationSettings, emailAddress: e.target.value})}
                      placeholder="Enter email address"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive alerts via SMS
                    </div>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                  />
                </div>
                
                {notificationSettings.smsNotifications && (
                  <div className="space-y-2 pl-6 border-l-2 border-muted ml-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={notificationSettings.phoneNumber}
                      onChange={(e) => setNotificationSettings({...notificationSettings, phoneNumber: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive alerts in browser or mobile app
                    </div>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Alert Types</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifyOnDeviceOffline">Device Offline</Label>
                  <Switch
                    id="notifyOnDeviceOffline"
                    checked={notificationSettings.notifyOnDeviceOffline}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, notifyOnDeviceOffline: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifyOnGeofenceViolation">Geofence Violation</Label>
                  <Switch
                    id="notifyOnGeofenceViolation"
                    checked={notificationSettings.notifyOnGeofenceViolation}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, notifyOnGeofenceViolation: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifyOnSpeedLimit">Speed Limit Exceeded</Label>
                  <Switch
                    id="notifyOnSpeedLimit"
                    checked={notificationSettings.notifyOnSpeedLimit}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, notifyOnSpeedLimit: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader className="bg-secondary/50 p-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <Globe className="h-4 w-4" />
                Display Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="distanceUnit">Distance Unit</Label>
                  <Select 
                    value={displaySettings.distanceUnit}
                    onValueChange={(value) => setDisplaySettings({...displaySettings, distanceUnit: value})}
                  >
                    <SelectTrigger id="distanceUnit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">Kilometers (km)</SelectItem>
                      <SelectItem value="mi">Miles (mi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="speedUnit">Speed Unit</Label>
                  <Select 
                    value={displaySettings.speedUnit}
                    onValueChange={(value) => setDisplaySettings({...displaySettings, speedUnit: value})}
                  >
                    <SelectTrigger id="speedUnit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kph">Kilometers per hour (km/h)</SelectItem>
                      <SelectItem value="mph">Miles per hour (mph)</SelectItem>
                      <SelectItem value="kn">Knots (kn)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={displaySettings.timezone}
                    onValueChange={(value) => setDisplaySettings({...displaySettings, timezone: value})}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="GMT-5">GMT-5 (Eastern Time)</SelectItem>
                      <SelectItem value="GMT-6">GMT-6 (Central Time)</SelectItem>
                      <SelectItem value="GMT-7">GMT-7 (Mountain Time)</SelectItem>
                      <SelectItem value="GMT-8">GMT-8 (Pacific Time)</SelectItem>
                      <SelectItem value="GMT+1">GMT+1 (Central European Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={displaySettings.language}
                    onValueChange={(value) => setDisplaySettings({...displaySettings, language: value})}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select 
                    value={displaySettings.dateFormat}
                    onValueChange={(value) => setDisplaySettings({...displaySettings, dateFormat: value})}
                  >
                    <SelectTrigger id="dateFormat">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select 
                    value={displaySettings.timeFormat}
                    onValueChange={(value) => setDisplaySettings({...displaySettings, timeFormat: value})}
                  >
                    <SelectTrigger id="timeFormat">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mapType">Map Type</Label>
                <Select 
                  value={displaySettings.mapType}
                  onValueChange={(value) => setDisplaySettings({...displaySettings, mapType: value})}
                >
                  <SelectTrigger id="mapType">
                    <SelectValue placeholder="Select map type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="osm">OpenStreetMap</SelectItem>
                    <SelectItem value="google">Google Maps</SelectItem>
                    <SelectItem value="carto">Carto</SelectItem>
                    <SelectItem value="mapbox">Mapbox</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-secondary/50 p-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <Clock className="h-4 w-4" />
                Reports & History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultReportPeriod">Default Report Period</Label>
                <Select defaultValue="today">
                  <SelectTrigger id="defaultReportPeriod">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="historyRetention">History Retention</Label>
                <Select defaultValue="90days">
                  <SelectTrigger id="historyRetention">
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">30 Days</SelectItem>
                    <SelectItem value="90days">90 Days</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
