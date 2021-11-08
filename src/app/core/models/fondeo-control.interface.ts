export interface IFondeoControl {
    id: number,
    name: string,
    investment: number,
    startDate: Date,
    endDate: Date,
    interestRate: number,
    interestPayable: number,
    defaultInterest: number,
    nextInterestPaymentDate: Date,
    status: string,
    principalPayment: number
}