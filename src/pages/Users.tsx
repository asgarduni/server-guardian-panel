
import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  User, 
  RefreshCw, 
  PlusCircle,
  MoreVertical,
  Pencil,
  Trash2,
  Shield
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { getUsers, addUser, updateUser, deleteUser, User as UserType } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

const Users: React.FC = () => {
  const isMobile = useIsMobile();
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [newUser, setNewUser] = useState<Partial<UserType>>({
    name: '',
    email: '',
    phone: '',
    administrator: false,
    disabled: false,
  });
  
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const data = await getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      administrator: false,
      disabled: false,
    });
    setShowUserDialog(true);
  };

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      administrator: user.administrator,
      disabled: user.disabled,
    });
    setShowUserDialog(true);
  };

  const handleDeleteUser = (user: UserType) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleSaveUser = async () => {
    try {
      if (!newUser.name || !newUser.email) {
        toast({
          title: 'Validation Error',
          description: 'Name and email are required',
          variant: 'destructive',
        });
        return;
      }

      if (selectedUser) {
        // Update existing user
        await updateUser(selectedUser.id, newUser);
        toast({
          title: 'Success',
          description: 'User updated successfully',
        });
      } else {
        // Add new user
        await addUser(newUser);
        toast({
          title: 'Success',
          description: 'User added successfully',
        });
      }
      
      setShowUserDialog(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user', error);
      toast({
        title: 'Error',
        description: 'Failed to save user',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser.id);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      setShowDeleteDialog(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className={cn(
      "p-6 md:p-8 space-y-8",
      !isMobile && "ml-64" // Add margin when sidebar is visible
    )}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage user accounts</p>
      </div>
      
      <div className="space-y-6 animate-scale-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 pl-10"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={fetchUsers} disabled={refreshing} className="gap-2">
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
              Refresh
            </Button>
            <Button size="sm" onClick={handleAddUser} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>
        
        <Card className="overflow-hidden transition-all-200 hover:shadow-md">
          <CardHeader className="bg-secondary/50 p-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <UsersIcon className="h-4 w-4" />
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <User className="h-8 w-8 mb-2" />
                          <p>No users found</p>
                          {searchQuery && (
                            <p className="text-sm mt-1">Try a different search term</p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="transition-all-200 hover:bg-secondary/30">
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone || '-'}</TableCell>
                        <TableCell>
                          {user.administrator ? (
                            <Badge className="bg-primary">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              User
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.disabled ? (
                            <Badge variant="secondary" className="text-muted-foreground">
                              Disabled
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500">
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-destructive">
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

        {/* User Dialog */}
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedUser ? 'Edit User' : 'Add User'}</DialogTitle>
              <DialogDescription>
                {selectedUser ? 'Update user information' : 'Enter details for the new user'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newUser.name || ''}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email || ''}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  value={newUser.phone || ''}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="administrator">Administrator</Label>
                  <Switch
                    id="administrator"
                    checked={newUser.administrator || false}
                    onCheckedChange={(checked) => setNewUser({ ...newUser, administrator: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="disabled">Disabled</Label>
                  <Switch
                    id="disabled"
                    checked={newUser.disabled || false}
                    onCheckedChange={(checked) => setNewUser({ ...newUser, disabled: checked })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUserDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveUser}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the user
                {selectedUser ? ` "${selectedUser.name}"` : ''}.
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
    </div>
  );
};

export default Users;
