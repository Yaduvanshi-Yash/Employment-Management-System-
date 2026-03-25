

const employees = [
  {
    "id": 1,
    "firstName": "Amit",
    "email": "e@e.com",
    "password": "123",
    "taskNumbers": {
      "active": 2,
      "newTask": 1,
      "complete": 1,
      "failed": 1
    },
    "tasks": [
      {
        "active": true,
        "newTask": true,
        "complete": false,
        "failed": false,
        "taskTitle": "Design Landing Page",
        "taskDescription": "Create UI layout for landing page",
        "taskDate": "2026-03-10",
        "category": "Design"
      },
      {
        "active": true,
        "newTask": false,
        "complete": true,
        "failed": false,
        "taskTitle": "Fix Navbar Bug",
        "taskDescription": "Resolve responsive issue in navbar",
        "taskDate": "2026-03-05",
        "category": "Frontend"
      },
      {
        "active": false,
        "newTask": false,
        "complete": false,
        "failed": true,
        "taskTitle": "API Integration",
        "taskDescription": "Connect frontend with backend API",
        "taskDate": "2026-03-01",
        "category": "Backend"
      }
    ]
  },
  {
    "id": 2,
    "firstName": "Rahul",
    "email": "employee2@example.com",
    "password": "123",
    "taskNumbers": {
      "active": 2,
      "newTask": 1,
      "complete": 1,
      "failed": 1
    },
    "tasks": [
      {
        "active": true,
        "newTask": true,
        "complete": false,
        "failed": false,
        "taskTitle": "Database Setup",
        "taskDescription": "Create MongoDB collections",
        "taskDate": "2026-03-11",
        "category": "Database"
      },
      {
        "active": true,
        "newTask": false,
        "complete": false,
        "failed": false,
        "taskTitle": "Write API Endpoints",
        "taskDescription": "Develop REST APIs for user module",
        "taskDate": "2026-03-12",
        "category": "Backend"
      },
      {
        "active": false,
        "newTask": false,
        "complete": true,
        "failed": false,
        "taskTitle": "Bug Testing",
        "taskDescription": "Test login and signup features",
        "taskDate": "2026-03-03",
        "category": "Testing"
      },
      {
        "active": false,
        "newTask": false,
        "complete": false,
        "failed": true,
        "taskTitle": "Payment Gateway",
        "taskDescription": "Integrate Razorpay payment system",
        "taskDate": "2026-02-28",
        "category": "Integration"
      }
    ]
  },
  {
    "id": 3,
    "firstName": "Priya",
    "email": "employee3@example.com",
    "password": "123",
    "taskNumbers": {
      "active": 2,
      "newTask": 1,
      "complete": 1,
      "failed": 0
    },
    "tasks": [
      {
        "active": true,
        "newTask": true,
        "complete": false,
        "failed": false,
        "taskTitle": "Create Dashboard",
        "taskDescription": "Develop admin dashboard UI",
        "taskDate": "2026-03-09",
        "category": "Frontend"
      },
      {
        "active": true,
        "newTask": false,
        "complete": false,
        "failed": false,
        "taskTitle": "Chart Integration",
        "taskDescription": "Add charts using Chart.js",
        "taskDate": "2026-03-13",
        "category": "Frontend"
      },
      {
        "active": false,
        "newTask": false,
        "complete": true,
        "failed": false,
        "taskTitle": "Code Review",
        "taskDescription": "Review teammate's code",
        "taskDate": "2026-03-02",
        "category": "Development"
      }
    ]
  },
  {
    "id": 4,
    "firstName": "Sneha",
    "email": "employee4@example.com",
    "password": "123",
    "taskNumbers": {
      "active": 2,
      "newTask": 1,
      "complete": 1,
      "failed": 0
    },
    "tasks": [
      {
        "active": true,
        "newTask": true,
        "complete": false,
        "failed": false,
        "taskTitle": "SEO Optimization",
        "taskDescription": "Improve website SEO",
        "taskDate": "2026-03-15",
        "category": "Marketing"
      },
      {
        "active": true,
        "newTask": false,
        "complete": false,
        "failed": false,
        "taskTitle": "Content Upload",
        "taskDescription": "Upload blog content",
        "taskDate": "2026-03-12",
        "category": "Content"
      },
      {
        "active": false,
        "newTask": false,
        "complete": true,
        "failed": false,
        "taskTitle": "Analytics Setup",
        "taskDescription": "Configure Google Analytics",
        "taskDate": "2026-03-04",
        "category": "Analytics"
      }
    ]
  },
  {
    "id": 5,
    "firstName": "Arjun",
    "email": "employee5@example.com",
    "password": "123",
    "taskNumbers": {
      "active": 2,
      "newTask": 1,
      "complete": 1,
      "failed": 1
    },
    "tasks": [
      {
        "active": true,
        "newTask": true,
        "complete": false,
        "failed": false,
        "taskTitle": "Mobile UI Testing",
        "taskDescription": "Test UI on Android devices",
        "taskDate": "2026-03-14",
        "category": "Testing"
      },
      {
        "active": true,
        "newTask": false,
        "complete": false,
        "failed": false,
        "taskTitle": "Performance Optimization",
        "taskDescription": "Improve page load speed",
        "taskDate": "2026-03-16",
        "category": "Performance"
      },
      {
        "active": false,
        "newTask": false,
        "complete": true,
        "failed": false,
        "taskTitle": "Security Check",
        "taskDescription": "Check vulnerabilities",
        "taskDate": "2026-03-06",
        "category": "Security"
      },
      {
        "active": false,
        "newTask": false,
        "complete": false,
        "failed": true,
        "taskTitle": "Server Deployment",
        "taskDescription": "Deploy app on cloud server",
        "taskDate": "2026-03-01",
        "category": "DevOps"
      }
    ]
  }
];


const Admin = [
  {
    id: 1,
    email: "admin@example.com",
    password: "123",
  },
];
export const setLocalStorage =()=>{
  if (!localStorage.getItem("employees")) {
    localStorage.setItem("employees", JSON.stringify(employees));
  }

  if (!localStorage.getItem("admin")) {
    localStorage.setItem("admin", JSON.stringify(Admin));
  }
}

export const getLocalStorage =()=>{
  const employeesData = localStorage.getItem("employees");
  const adminData = localStorage.getItem("admin");
  /*
   * Parses JSON strings from localStorage into usable objects/arrays.
   * Old code: return {employees, admin}; → returned raw strings, causing ".find is not a function" error.
   * New code: Parses to objects, so data.employees.find(...) works for login checks.
   */
  return {
    employees: employeesData ? JSON.parse(employeesData) : null,
    admin: adminData ? JSON.parse(adminData) : null
  };
} 
