import axios from 'axios';

const frappeClient = axios.create({
  baseURL: '/api',
  withCredentials: true
});

// Authentication utilities
export const getFrappeAuth = async () => {
  try {
    const response = await frappeClient.get('/method/flex.api.auth.get_logged_user');
    return response.data?.message?.user;
  } catch (error) {
    return null;
  }
};

export const loginToFrappe = async (username: string, password: string) => {
  try {
    const response = await frappeClient.post('/method/login', {
      usr: username,
      pwd: password
    });
    return response.data;
  } catch (error) {
    throw new Error('Authentication failed');
  }
};

export const logoutFromFrappe = async () => {
  try {
    await frappeClient.get('/method/logout');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Permission checking utility
export const checkPermissions = async (doctype: string, permissions: string[]) => {
  try {
    const response = await frappeClient.get('/method/flex.api.auth.check_permissions', {
      params: {
        doctype,
        permissions: permissions.join(',')
      }
    });
    return response.data?.message?.has_permission || false;
  } catch (error) {
    return false;
  }
};

// DocType CRUD operations
export interface DocTypeOptions {
  fields?: string[];
  filters?: Record<string, any>;
  limit?: number;
  start?: number;
  orderBy?: string;
}

export const getDocList = async (doctype: string, options: DocTypeOptions = {}) => {
  try {
    const response = await frappeClient.get('/method/flex.api.doctype.get_list', {
      params: {
        doctype,
        ...options
      }
    });
    return response.data?.message || [];
  } catch (error) {
    throw new Error(`Failed to fetch ${doctype} list`);
  }
};

export const getDoc = async (doctype: string, name: string) => {
  try {
    const response = await frappeClient.get('/method/flex.api.doctype.get_doc', {
      params: {
        doctype,
        name
      }
    });
    return response.data?.message;
  } catch (error) {
    throw new Error(`Failed to fetch ${doctype} document`);
  }
};

export const createDoc = async (doctype: string, doc: Record<string, any>) => {
  try {
    const response = await frappeClient.post('/method/flex.api.doctype.create_doc', {
      doctype,
      doc
    });
    return response.data?.message;
  } catch (error) {
    throw new Error(`Failed to create ${doctype} document`);
  }
};

export const updateDoc = async (doctype: string, name: string, doc: Record<string, any>) => {
  try {
    const response = await frappeClient.put('/method/flex.api.doctype.update_doc', {
      doctype,
      name,
      doc
    });
    return response.data?.message;
  } catch (error) {
    throw new Error(`Failed to update ${doctype} document`);
  }
};

export const deleteDoc = async (doctype: string, name: string) => {
  try {
    const response = await frappeClient.delete('/method/flex.api.doctype.delete_doc', {
      params: {
        doctype,
        name
      }
    });
    return response.data?.message;
  } catch (error) {
    throw new Error(`Failed to delete ${doctype} document`);
  }
};

// Sidebar navigation
export const getSidebarItems = async () => {
  try {
    const response = await frappeClient.get('/method/flex.api.navigation.get_sidebar_items');
    return response.data?.message || [];
  } catch (error) {
    return [];
  }
};