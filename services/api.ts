import axios from 'axios';
import { RepairRequest, User, Building, Room } from '../types';

// Link to Strapi Backend: Use VITE_API_URL if provided, else default to /api for Nginx proxy
const API_URL = import.meta.env.VITE_API_URL || '';
const API_BASE = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`.replace(/\/+$/, '') || '/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// axios interceptor: always inject latest JWT before every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('strapi_jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// axios interceptor: handle 401/403 by clearing stale tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.warn('⚠️ API returned', error.response.status, 'for', error.config?.url);
        }
        return Promise.reject(error);
    }
);


// Flatten Strapi v4/v5 nested structures recursively
const flattenStrapi = (item: any): any => {
    if (!item) return item;

    if (Array.isArray(item)) {
        return item.map(flattenStrapi);
    }

    if (typeof item === 'object') {
        let result = { ...item };

        // Pull up attributes
        if (result.attributes) {
            result = { id: result.id, ...result.attributes };
            delete (result as any).attributes;
        }

        // Handle data wrapper
        if (result.data !== undefined) {
            return flattenStrapi(result.data);
        }

        // Recursively flatten children
        const final: any = {};
        Object.keys(result).forEach(key => {
            final[key] = flattenStrapi(result[key]);
        });

        // Consistent IDs
        if (final.id || final.documentId) {
            final.id = final.documentId || final.id;
            final.strapiId = final.strapiId || result.id;
        }

        return final;
    }

    return item;
};

// Helper to extract data from Strapi response
const extractData = (res: any) => {
    const data = res.data?.data;
    if (data === undefined) return res.data;
    return flattenStrapi(data);
};

// Helper to wrap data for Strapi payload and strip read-only fields
const wrapPayload = (data: any) => {
    const forbidden = ['id', 'documentId', 'strapiId', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 'createdBy', 'updatedBy', 'localizations'];
    const clean: any = {};

    Object.keys(data).forEach(key => {
        if (forbidden.includes(key)) return;
        const val = data[key];

        // Skip undefined or null values
        if (val === undefined || val === null) return;

        // ALLOW PRIMITIVES (Strings/Numbers) - This is critical for relation IDs like building: "doc_id"
        if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
            clean[key] = val;
            return;
        }

        // Skip populated relations (objects with id/documentId) to avoid Strapi 400s
        if (typeof val === 'object' && !Array.isArray(val)) {
            // If it's a relation object, we might want to extract the ID, 
            // but usually the frontend should send the ID directly.
            if ((val as any).documentId) {
                // In Strapi 5, we can often send the documentId string
                clean[key] = (val as any).documentId;
            } else if ((val as any).id) {
                clean[key] = (val as any).id;
            }
            return;
        }

        // For arrays (e.g., many-to-many), map objects to IDs
        if (Array.isArray(val)) {
            clean[key] = val.map(item => (typeof item === 'object' ? (item.documentId || item.id) : item)).filter(Boolean);
            return;
        }
    });

    console.log("STRAPI PAYLOAD SENDING:", clean);
    return { data: clean };
};

export const requestService = {
    getAll: () => api.get<any>('/repair-requests?populate=*').then(extractData),
    create: (data: any) => {
        // Build a clean payload manually - wrapPayload may strip valid null-like relation IDs
        const payload: any = {};
        const allowed = ['title', 'description', 'status', 'priority', 'imageUrl', 'submittedDate', 'department', 'room', 'requester'];
        allowed.forEach(k => {
            if (data[k] !== undefined && data[k] !== null) payload[k] = data[k];
        });
        console.log('📤 repair-request CREATE payload:', payload);
        return api.post<any>('/repair-requests', { data: payload }).then(extractData);
    },
    update: (id: string, data: any) => {
        const payload: any = {};
        const allowed = ['title', 'description', 'status', 'priority', 'imageUrl', 'department', 'room'];
        allowed.forEach(k => {
            if (data[k] !== undefined) payload[k] = data[k];
        });
        console.log('📤 repair-request UPDATE payload:', payload);
        return api.put<any>(`/repair-requests/${id}`, { data: payload }).then(extractData);
    },
    delete: (id: string) => api.delete(`/repair-requests/${id}`).then(res => res.data),
};

export const buildingService = {
    getAll: () => api.get<any>('/buildings?populate=*').then(extractData),
    create: (data: any) => api.post<any>('/buildings', wrapPayload(data)).then(extractData),
    update: (id: string, data: any) => api.put<any>(`/buildings/${id}`, wrapPayload(data)).then(extractData),
    delete: (id: string) => api.delete(`/buildings/${id}`).then(res => res.data),
};

export const departmentService = {
    getAll: () => api.get<any>('/departments?populate=*').then(extractData),
    create: (data: any) => api.post<any>('/departments', wrapPayload(data)).then(extractData),
    update: (id: string, data: any) => api.put<any>(`/departments/${id}`, wrapPayload(data)).then(extractData),
    delete: (id: string) => api.delete(`/departments/${id}`).then(res => res.data),
};

export const roomService = {
    getAll: () => api.get<any>('/rooms?populate=*').then(extractData),
    create: (data: any) => api.post<any>('/rooms', wrapPayload(data)).then(extractData),
    update: (id: string, data: any) => api.put<any>(`/rooms/${id}`, wrapPayload(data)).then(extractData),
    delete: (id: string) => api.delete(`/rooms/${id}`).then(res => res.data),
};

export const userService = {
    getAll: () => api.get<any>('/users?populate=department').then(res => {
        const users = Array.isArray(res.data) ? res.data : (res.data.results || []);
        return users.map((u: any) => ({
            id: u.id,
            name: u.username || u.email?.split('@')[0] || 'Unknown User',
            email: u.email || '',
            department: u.department?.name || u.department || 'Chưa cập nhật',
            role: u.user_role || (u.email?.includes('admin') ? 'ADMIN' : (u.email?.includes('tech') ? 'TECH' : 'USER'))
        }));
    }),
    create: (data: any) => {
        const { id, documentId, role, name, ...rest } = data;

        // Strip forbidden fields from rest
        const forbidden = ['id', 'documentId', 'strapiId', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 'createdBy', 'updatedBy', 'localizations'];
        const cleanRest: any = {};
        Object.keys(rest).forEach(key => {
            if (!forbidden.includes(key)) cleanRest[key] = rest[key];
        });

        const payload = {
            ...cleanRest,
            username: name || rest.email,
            user_role: role || 'USER',
            role: 1, // Require authenticated role ID in Strapi v5
            confirmed: true
        };
        return api.post<any>('/users', payload).then(res => ({
            ...res.data,
            name: res.data.username,
            role: res.data.user_role
        }));
    },
    update: (id: string, data: any) => {
        const { id: dummy, documentId, role, name, ...rest } = data;

        // Strip forbidden fields from rest
        const forbidden = ['id', 'documentId', 'strapiId', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 'createdBy', 'updatedBy', 'localizations'];
        const cleanRest: any = {};
        Object.keys(rest).forEach(key => {
            if (!forbidden.includes(key)) cleanRest[key] = rest[key];
        });

        const payload = {
            ...cleanRest,
            username: name,
            user_role: role || 'USER',
            confirmed: true
        };
        console.log("USER UPDATE PAYLOAD:", payload);
        return api.put<any>(`/users/${id}`, payload).then(res => ({
            ...res.data,
            name: res.data.username,
            role: res.data.user_role
        }));
    },
    delete: (id: string) => api.delete(`/users/${id}`).then(res => res.data),

    // Strapi Auth Login
    login: (credentials: any) => api.post('/auth/local', {
        identifier: credentials.email,
        password: credentials.password
    }).then(async res => {
        const { jwt, user } = res.data;

        // set token for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
        localStorage.setItem('strapi_jwt', jwt); // Persist token

        console.log("Logged in user:", user);


        // Fetch full user details to get role and department if possible
        let role = 'USER';
        let department = 'Chưa cập nhật';
        let me: any = null;
        try {
            // Using a fresh call to ensure we get the latest populated data
            // Strapi v5 prefers array or specific object format for populate
            const meRes = await api.get('/users/me?populate[0]=role&populate[1]=department');
            me = flattenStrapi(meRes.data);
            console.log("👤 Full user details for", me.username, ":", me);

            // Priority: user_role field, then derived from email
            role = me.user_role || (me.email?.includes('admin') ? 'ADMIN' : (me.email?.includes('tech') ? 'TECH' : 'USER'));

            if (me.department) {
                // Handle various Strapi relation structures
                if (typeof me.department === 'string') {
                    department = me.department;
                } else if (me.department.name) {
                    department = me.department.name;
                } else if (Array.isArray(me.department) && me.department.length > 0) {
                    department = me.department[0].name || me.department[0];
                }
            }

            // Final normalization
            department = department.trim();

            // HARD OVERRIDE for TCHC user
            if (user.username?.toLowerCase() === 'tchc') {
                department = 'Phòng Tổ chức - Hành chính';
            }

            console.log(`🏢 Assigned Department: "${department}" | Role: ${role}`);
        } catch (e) {
            console.error("❌ Error fetching full user details during login:", e);
            if (user.email.toLowerCase().includes('admin')) role = 'ADMIN';
            else if (user.email.toLowerCase().includes('tech')) role = 'TECH';
        }

        // Adapt Strapi user to App User
        const userObj = {
            id: (me?.id) || user.id || user.documentId,
            documentId: (me?.documentId) || user.documentId,
            name: user.username || user.email?.split('@')[0] || 'N/A',
            email: user.email,
            department: department,
            role: role
        };
        localStorage.setItem('currentUser', JSON.stringify(userObj));
        return userObj;
    }).catch(err => {
        console.error("Login Error Details:", err.response?.data || err.message);
        throw err;
    }),
};

// Seed service is not available in Strapi by default, removed or needs custom controller
export const seedService = {
    seed: (force = false) => Promise.resolve({ message: "Seed not supported in Strapi mode yet" })
}

export default api;
