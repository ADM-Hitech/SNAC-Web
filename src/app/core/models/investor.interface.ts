export interface IInvestor {
    id: number,
    name: string,
    limitDateExecuteCapital: Date,
    amountCommitted: number,
    amountExercised: number,
    interestRate: number,
    investments: number,
    startDate: Date,
    endDate: Date,
    capitalStatusCalls: string,
    attachedFiles: string,
    investmentStatus: string,
    daysForCapitalCall: number,
    interestPaid: number
}