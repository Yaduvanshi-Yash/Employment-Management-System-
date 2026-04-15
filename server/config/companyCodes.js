// Company registration codes for role-based signup
// In production, these should be in your database or environment variables

export const companyCodes = {
  // Admin registration codes - employees use these to sign up as admin
  admin: [
    "1234", // Example admin code 1
    "5678", // Example admin code 2
    "9012", // Example admin code 3
  ],
  
  // Employee registration codes - employees use these to sign up as regular employees
  employee: [
    "3456", // Example employee code 1
    "7890", // Example employee code 2
    "2345", // Example employee code 3
  ],
};

// Validate company code
export const validateCompanyCode = (code, role) => {
  if (!code || code.length !== 4 || isNaN(code)) {
    return false;
  }
  
  const codeList = companyCodes[role];
  return codeList && codeList.includes(code);
};
