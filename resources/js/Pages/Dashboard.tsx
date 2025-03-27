import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Transaction } from '@/types';
import { Head } from '@inertiajs/react';

interface DashboardProps {
    dailyTransactions: Transaction[]
}

export default function Dashboard({ dailyTransactions }: DashboardProps) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="flex flex-col gap-4 p-4 pt-0">
                <h3 className="text-lg font-semibold">Daily Transactions</h3>
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {dailyTransactions.map((transaction, index) => {
                        const date = new Date(transaction.date);
                        const formattedDate = date.toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',

                        });

                        return (
                            <div
                                key={index}
                                className={`flex flex-col rounded-xl bg-${transaction.type === 'SALE'
                                    ? 'green-100'
                                    : 'blue-100'
                                    } p-4 shadow-lg`}
                            >
                                <h4 className="text-lg font-bold text-gray-800">
                                    {transaction.type === 'SALE'
                                        ? 'Sales'
                                        : 'Purchases'}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    Date: {formattedDate}
                                </p>
                                <p className="mt-2 text-xl font-semibold text-gray-700">
                                    Rp {transaction.total_amount.toLocaleString('id-ID')}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
