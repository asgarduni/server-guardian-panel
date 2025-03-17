
/**
 * Traccar API Service
 * Documentation: https://www.traccar.org/api-reference/
 */

const API_URL = 'http://181.189.124.150:8082/api';

// Define types
export interface Device {
  id: number;
  name: string;
  uniqueId: string;
  status: string;
  lastUpdate?: string;
  position?: Position;
}

export interface Position {
  id: number;
  deviceId: number;
  protocol: string;
  serverTime: string;
  deviceTime: string;
  fixTime: string;
  valid: boolean;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  course: number;
  address?: string;
  attributes: Record<string, any>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  administrator: boolean;
  disabled: boolean;
}

export interface ServerStats {
  cpuLoad: number;
  usedMemory: number;
  totalMemory: number;
  activeUsers: number;
  activeDevices: number;
}

// Authentication state
let session = {
  email: '',
  token: localStorage.getItem('traccar_token') || ''
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(session.token ? { 'Authorization': `Bearer ${session.token}` } : {}),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401) {
    // Clear token if unauthorized
    localStorage.removeItem('traccar_token');
    session.token = '';
    throw new Error('Unauthorized. Please log in again.');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  // Some endpoints return no content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// Auth functions
export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const userData = await response.json();
    
    // Save token from cookies
    const cookies = response.headers.get('Set-Cookie');
    const tokenMatch = cookies?.match(/JSESSIONID=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : '';
    
    if (token) {
      localStorage.setItem('traccar_token', token);
      session = { email, token };
      return userData;
    } else {
      throw new Error('No authentication token received');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await apiRequest('/session', { method: 'DELETE' });
  } finally {
    localStorage.removeItem('traccar_token');
    session = { email: '', token: '' };
  }
};

export const isAuthenticated = () => {
  return !!session.token;
};

// Devices
export const getDevices = async (): Promise<Device[]> => {
  return apiRequest('/devices');
};

export const getDevice = async (id: number): Promise<Device> => {
  return apiRequest(`/devices/${id}`);
};

export const updateDevice = async (id: number, data: Partial<Device>): Promise<Device> => {
  return apiRequest(`/devices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

export const addDevice = async (data: Partial<Device>): Promise<Device> => {
  return apiRequest('/devices', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const deleteDevice = async (id: number): Promise<void> => {
  return apiRequest(`/devices/${id}`, { method: 'DELETE' });
};

// Positions
export const getPositions = async (deviceId: number, from: Date, to: Date): Promise<Position[]> => {
  const params = new URLSearchParams({
    deviceId: deviceId.toString(),
    from: from.toISOString(),
    to: to.toISOString()
  });
  
  return apiRequest(`/positions?${params}`);
};

export const getLatestPositions = async (): Promise<Position[]> => {
  return apiRequest('/positions');
};

// Users
export const getUsers = async (): Promise<User[]> => {
  return apiRequest('/users');
};

export const getUser = async (id: number): Promise<User> => {
  return apiRequest(`/users/${id}`);
};

export const updateUser = async (id: number, data: Partial<User>): Promise<User> => {
  return apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

export const addUser = async (data: Partial<User>): Promise<User> => {
  return apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const deleteUser = async (id: number): Promise<void> => {
  return apiRequest(`/users/${id}`, { method: 'DELETE' });
};

// Server info/stats (mock - replace with actual endpoints if available)
export const getServerStats = async (): Promise<ServerStats> => {
  try {
    // Try to get real server stats if the endpoint exists
    return await apiRequest('/server/stats');
  } catch (error) {
    // Return mock data if endpoint doesn't exist
    return {
      cpuLoad: Math.random() * 100,
      usedMemory: Math.random() * 1024,
      totalMemory: 4096,
      activeUsers: Math.floor(Math.random() * 10),
      activeDevices: Math.floor(Math.random() * 50)
    };
  }
};
