jest.mock("../../src/domain/Age");
jest.mock("../../src/domain/AnnualIncome");
jest.mock("../../src/domain/LoanAmount");
jest.mock("../../src/domain/Expenditure");
const {
  LoanValidationService,
} = require("../../src/services/Services");
const {
  Age,
  AnnualIncome,
  LoanAmount,
  Expenditure,
} = require("../../src/domain/Customer");

describe("validate loan", () => {
  test("should throw error due to incorrect date of birth format", () => {
    const mockCustomerReq = {
      dateOfBirth: "20-02-2000",
      annualIncome: "50000",
      loanAmount: "20000",
      residentialMonthlyExpenditure: "900",
    };

    const mockAge = new Age(25);
    mockAge.errors = [];
    mockAge.validate = jest.fn((mockCustomerReq) => {
      throw new Error("Invalid date of birth");
    });

    const loanValidationService = new LoanValidationService([mockAge]);

    expect(() => loanValidationService.validate(mockCustomerReq)).toThrowError(
      "Loan application invalid"
    );
  });
  test("should throw error due to invalid annual income format", () => {
    const mockCustomerReq = {
      dateOfBirth: "1997-02-20",
      annualIncome: "£50000",
      loanAmount: "10000",
      residentialMonthlyExpenditure: "900",
    };

    const mockAnnualIncome = new AnnualIncome(25000);
    mockAnnualIncome.errors = [];
    mockAnnualIncome.validate = jest.fn((mockCustomerReq) => {
      throw new Error("Annual income must be a numeric value");
    });

    const loanValidationService = new LoanValidationService([mockAnnualIncome]);

    expect(() => loanValidationService.validate(mockCustomerReq)).toThrowError(
      "Loan application invalid"
    );
  });
  test("should throw error due to invalid loan amount format", () => {
    const mockCustomerReq = {
      dateOfBirth: "1997-02-20",
      annualIncome: "50000",
      loanAmount: "£10000",
      residentialMonthlyExpenditure: "900",
    };

    const mockLoanAmount = new LoanAmount();
    mockLoanAmount.errors = [];
    mockLoanAmount.validate = jest.fn((mockCustomerReq) => {
      throw new Error("Loan amount must be a numeric value");
    });

    const loanValidationService = new LoanValidationService([mockLoanAmount]);
    expect(() => loanValidationService.validate(mockCustomerReq)).toThrowError(
      "Loan application invalid"
    );
  });
  test("should throw error due to incorrect residential monthly expenditure format", () => {
    const mockCustomerReq = {
      dateOfBirth: "1997-02-20",
      annualIncome: "50000",
      loanAmount: "10000",
      residentialMonthlyExpenditure: "£900",
    };

    const mockExpenditure = new Expenditure(1000);
    mockExpenditure.errors = [];
    mockExpenditure.validate = jest.fn((mockCustomerReq) => {
      throw new Error(
        "Residential monthly expenditure must be a numeric value"
      );
    });

    const loanValidationService = new LoanValidationService([mockExpenditure]);

    expect(() => loanValidationService.validate(mockCustomerReq)).toThrowError(
      "Loan application invalid"
    );
  });
  test("should return an invalid loan application due to failing age criteria", () => {
    const mockCustomerReq = {
      dateOfBirth: "2000-02-20",
      annualIncome: "50000",
      loanAmount: "20000",
      residentialMonthlyExpenditure: "900",
    };

    const mockAge = new Age(25);
    mockAge.validate = jest.fn().mockReturnValue(false);
    mockAge.errors = ["Age must be least 25"];

    const loanValidationService = new LoanValidationService([mockAge]);
    expect(loanValidationService.validate(mockCustomerReq)).toBe(false);
    expect(loanValidationService.errors).toEqual(["Age must be least 25"]);
  });
  test("should return an invalid loan application due to failing annual income criteria", () => {
    const mockCustomerReq = {
      dateOfBirth: "2000-02-20",
      annualIncome: "20000",
      loanAmount: "1000",
      residentialMonthlyExpenditure: "900",
    };

    const mockAnnualIncome = new AnnualIncome(25000);
    mockAnnualIncome.validate = jest.fn().mockReturnValue(false);
    mockAnnualIncome.errors = ["Annual income must be least 25000"];

    const loanValidationService = new LoanValidationService([mockAnnualIncome]);
    expect(loanValidationService.validate(mockCustomerReq)).toBe(false);
    expect(loanValidationService.errors).toEqual([
      "Annual income must be least 25000",
    ]);
  });
  test("should return an invalid loan application due to failing loan amount criteria", () => {
    const mockCustomerReq = {
      dateOfBirth: "2000-02-20",
      annualIncome: "20000",
      loanAmount: "15000",
      residentialMonthlyExpenditure: "900",
    };

    const mockLoanAmount = new LoanAmount();
    mockLoanAmount.validate = jest.fn().mockReturnValue(false);
    mockLoanAmount.errors = [
      "Loan amount must be less than 20% of annual income",
    ];

    const loanValidationService = new LoanValidationService([mockLoanAmount]);
    expect(loanValidationService.validate(mockCustomerReq)).toBe(false);
    expect(loanValidationService.errors).toEqual([
      "Loan amount must be less than 20% of annual income",
    ]);
  });
  test("should return an invalid loan application due to failing residential monthly expenditure criteria", () => {
    const mockCustomerReq = {
      dateOfBirth: "2000-02-20",
      annualIncome: "20000",
      loanAmount: "1000",
      residentialMonthlyExpenditure: "1100",
    };

    const mockExpenditure = new Expenditure(1000);
    mockExpenditure.validate = jest.fn().mockReturnValue(false);
    mockExpenditure.errors = [
      "Residential monthly expenditure must be less than 1000",
    ];

    const loanValidationService = new LoanValidationService([mockExpenditure]);
    expect(loanValidationService.validate(mockCustomerReq)).toBe(false);
    expect(loanValidationService.errors).toEqual([
      "Residential monthly expenditure must be less than 1000",
    ]);
  });
});