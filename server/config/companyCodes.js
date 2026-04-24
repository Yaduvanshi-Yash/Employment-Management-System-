const parseCodes = (value, fallback) =>
  (value || fallback)
    .split(",")
    .map((code) => code.trim())
    .filter((code) => /^\d{4}$/.test(code));

export const companyCodes = {
  admin: parseCodes(process.env.ADMIN_COMPANY_CODES, "1234,5678,9012"),
  employee: parseCodes(process.env.EMPLOYEE_COMPANY_CODES, "3456,7890,2345"),
};

// Validate company code
export const validateCompanyCode = (code, role) => {
  if (!code || code.length !== 4 || isNaN(code)) {
    return false;
  }

  const codeList = companyCodes[role];
  return codeList && codeList.includes(code);
};
