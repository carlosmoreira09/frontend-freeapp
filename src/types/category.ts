import type {DailyTransaction} from "./transaction.ts";

export interface Category {
    id: string;
    name: string;
    description: string;
    dailyTransactions?: DailyTransaction[];
    createdAt?: Date;
    updatedAt?: Date;
}