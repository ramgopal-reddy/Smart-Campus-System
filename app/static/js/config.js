// API Configuration
const API_CONFIG = {
    // Update this with your actual FastAPI server URL
    BASE_URL: "https://smart-campus-management-system-lcgz.onrender.com",
    
    // API Endpoints
    ENDPOINTS: {
        ADD_STUDENT: '/add_student',
        MARK_ATTENDANCE: '/mark_attendance',
        ATTENDANCE_HISTORY: '/attendance_history',
        ORDER_FOOD: '/order_food',
        FOOD_ORDER_HISTORY: '/food_order_history',
        GET_STUDENT: '/student'
    }
};

// For development, you can use a local FastAPI server
// const API_CONFIG = {
//     BASE_URL: 'http://localhost:8000',
//     ENDPOINTS: {
//         ADD_STUDENT: '/add_student',
//         MARK_ATTENDANCE: '/mark_attendance',
//         ATTENDANCE_HISTORY: '/attendance_history',
//         ORDER_FOOD: '/order_food',
//         FOOD_ORDER_HISTORY: '/food_order_history',
//         GET_STUDENT: '/student'
//     }
// };

// Export for use in other files
window.API_CONFIG = API_CONFIG;
