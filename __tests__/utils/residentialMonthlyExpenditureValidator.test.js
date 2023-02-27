const ResidentialMonthlyExpenditureValidator = require("../../src/utils/ResidentialMonthlyExpenditureValidator");

describe("validate residential monthly expenditure", () => {
  test("should throw an error when residential monthly expenditure exceeds limit set", () => {
    const mockApplicantReq = {
      dateOfBirth: "2005-02-20",
      annualIncome: "50000",
      loanAmount: "10000",
      residentialMonthlyExpenditure: "1100",
    };
    const residentialMonthlyExpenditureValidator =
      new ResidentialMonthlyExpenditureValidator(1000);
    expect(() => {
      residentialMonthlyExpenditureValidator.validate(mockApplicantReq);
    }).toThrowError("Residential monthly expenditure cannot exceed 1000");
  });
  test("should return a valid residential monthly expenditure", () => {
    const mockApplicantReq = {
      dateOfBirth: "2005-02-20",
      annualIncome: "50000",
      loanAmount: "10000",
      residentialMonthlyExpenditure: "900",
    };
    const residentialMonthlyExpenditureValidator =
      new ResidentialMonthlyExpenditureValidator(1000);
    const isValidResidentialMonthlyExpenditure =
      residentialMonthlyExpenditureValidator.validate(mockApplicantReq);
    expect(isValidResidentialMonthlyExpenditure).toBe(true);
  });
});
