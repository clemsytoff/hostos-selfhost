import { config } from '@/config';

const API_BASE_URL = config.apiUrl;

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit & { skipAutoLogout?: boolean } = {}
): Promise<ApiResponse<T>> {
  const { skipAutoLogout, ...fetchOptions } = options;
  const token = localStorage.getItem('access_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...fetchOptions.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    // Auto-logout on 401 Unauthorized (but skip for login endpoints)
    if (response.status === 401 && !skipAutoLogout) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.dispatchEvent(new CustomEvent('auth:logout'));
      return { error: 'Session expirée, veuillez vous reconnecter' };
    }

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || data.msg || 'Une erreur est survenue' };
    }

    return { data };
  } catch (error) {
    return { error: 'Erreur de connexion au serveur' };
  }
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    fetchApi<{ access_token: string; user: { id: number; firstName: string; lastName: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ Email: email, Password: password }), skipAutoLogout: true }
    ),

  adminLogin: (email: string, password: string) =>
    fetchApi<{ access_token: string; user: { id: number; firstName: string; RoleID: number } }>(
      '/auth/admin/login',
      { method: 'POST', body: JSON.stringify({ Email: email, Password: password }), skipAutoLogout: true }
    ),

  register: (data: { FirstName: string; LastName: string; Email: string; PhoneNumber: string; Password: string }) =>
    fetchApi<{ msg: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  adminRegister: (data: { FirstName: string; LastName: string; Email: string; Password: string }) =>
    fetchApi<{ msg: string }>('/auth/admin/register', { method: 'POST', body: JSON.stringify(data) }),

  logout: () => fetchApi<{ msg: string }>('/auth/logout', { method: 'POST' }),
};

// Admin API
export const adminApi = {
  getCustomers: () =>
    fetchApi<Array<{ ID: number; FirstName: string; LastName: string; Email: string; PhoneNumber: string; CreatedAt: string }>>(
      '/admin/customers/list'
    ),

  getStaff: () =>
    fetchApi<Array<{ ID: number; FirstName: string; LastName: string; Email: string; RoleID: number; CreatedAt: string }>>(
      '/admin/admins/list'
    ),

  deleteStaff: (id: number) =>
    fetchApi<{ msg: string }>(`/admin/staff/${id}`, { method: 'DELETE' }),

  deleteCustomer: (id: number) =>
    fetchApi<{ msg: string }>(`/admin/customer/${id}`, { method: 'DELETE' }),

  createCustomer: (data: { FirstName: string; LastName: string; Email: string; PhoneNumber: string; Password: string }) =>
    fetchApi<{ msg: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  createStaff: (data: { FirstName: string; LastName: string; Email: string; Password: string; RoleID: number }) =>
    fetchApi<{ msg: string }>('/auth/admin/register', { method: 'POST', body: JSON.stringify(data) }),

  editStaff: (id: number, data: Partial<{ FirstName: string; LastName: string; Email: string; RoleID: number; Password: string }>) =>
    fetchApi<{ msg: string }>(`/admin/staff/edit/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  editCustomer: (id: number, data: Partial<{ FirstName: string; LastName: string; Email: string; PhoneNumber: string; Password: string }>) =>
    fetchApi<{ msg: string }>(`/admin/customer/edit/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getStaffInfo: (id: number) =>
    fetchApi<{ ID: number; FirstName: string; LastName: string; Email: string; RoleID: number; RoleName: string; CreatedAt: string }>(
      `/admin/staff/infos/${id}`
    ),
};

// Customer API
export const customerApi = {
  getInfo: (id: number) =>
    fetchApi<{ ID: number; FirstName: string; LastName: string; Email: string; PhoneNumber: string; CreatedAt: string }>(
      `/customers/customer/infos/${id}`
    ),
};

// Products API
export const productsApi = {
  getAll: () =>
    fetchApi<Array<{ ID: number; ProductName: string; Description: string; Price: number; StockQuantity: number }>>(
      '/products/list'
    ),

  create: (data: { ProductName: string; Description?: string; Price: number; StockQuantity?: number }) =>
    fetchApi<{ msg: string }>('/products/admin/create', { method: 'POST', body: JSON.stringify(data) }),

  edit: (id: number, data: Partial<{ ProductName: string; Description: string; Price: number; StockQuantity: number }>) =>
    fetchApi<{ msg: string }>(`/products/admin/edit/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: (id: number) =>
    fetchApi<{ msg: string }>(`/products/admin/delete/${id}`, { method: 'DELETE' }),
};

// Orders API
export const ordersApi = {
  create: (productId: number, customerId?: number) =>
    fetchApi<{ msg: string }>('/orders/create', {
      method: 'POST',
      body: JSON.stringify({ ProductID: productId, ...(customerId && { CustomerID: customerId }) }),
    }),

  getAll: () =>
    fetchApi<Array<{ ID: number; Status: string; TotalAmount: number; OrderDate: string; CustomerEmail: string; ProductName: string }>>(
      '/orders/list'
    ),

  getPending: () =>
    fetchApi<Array<{ ID: number; Status: string; TotalAmount: number; OrderDate: string; CustomerEmail: string; ProductName: string }>>(
      '/orders/list/pending'
    ),

  validate: (orderId: number, status: 'Delivered' | 'Cancelled') =>
    fetchApi<{ msg: string }>(`/orders/validate/${orderId}`, {
      method: 'POST',
      body: JSON.stringify({ Status: status }),
    }),

  getActiveServices: () =>
    fetchApi<Array<{
      ID: number;
      Status: string;
      RecurentPrice: number;
      StartedAt: string;
      EndedAt: string;
      CustomerEmail: string;
      ProductName: string;
      CustomerID: number;
      ProductID: number;
    }>>('/orders/list/actual'),

  editService: (id: number, data: Partial<{ Status: string; RecurentPrice: number; EndedAt: string }>) =>
    fetchApi<{ msg: string }>(`/orders/actual/edit/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  terminateService: (id: number) =>
    fetchApi<{ msg: string }>(`/orders/actual/terminate/${id}`, { method: 'DELETE' }),
};

// Dashboard API (Client)
export const dashboardApi = {
  getStats: () =>
    fetchApi<{ active_services: number; pending_orders: number; total_spent: number }>('/me/stats'),

  getMyServices: () =>
    fetchApi<Array<{
      ServiceID: number;
      StartedAt: string;
      EndedAt: string;
      ProductName: string;
      Description: string;
      Price: number;
      DaysRemaining: number;
      Status: 'Active' | 'Expired';
    }>>('/me/my-services'),

  getMyOrders: () =>
    fetchApi<Array<{ ID: number; Status: string; TotalAmount: number; OrderDate: string; ProductName: string }>>(
      '/me/my-orders'
    ),
};
