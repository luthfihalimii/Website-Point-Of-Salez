import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { Product, TransactionType } from '@/types';
import { Head } from '@inertiajs/react';

interface DailySummary {
    date: string;
    type: TransactionType;
    total_amount: number;
}

interface DashboardProps {
    dailyTransactions: DailySummary[];
    lowStockProducts: Product[];
}

export default function Dashboard({ dailyTransactions, lowStockProducts }: DashboardProps) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4 pt-0">
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold">Daily Transactions</h3>
                    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {dailyTransactions.map((transaction, index) => {
                            const date = new Date(transaction.date);
                            const formattedDate = date.toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            });

                            const isSale = transaction.type === 'SALE';

                            return (
                                <div
                                    key={`${transaction.date}-${transaction.type}-${index}`}
                                    className={`flex flex-col rounded-xl p-4 shadow-lg ${
                                        isSale ? 'bg-emerald-100 text-emerald-900' : 'bg-sky-100 text-sky-900'
                                    }`}
                                >
                                    <h4 className="text-lg font-bold">
                                        {isSale ? 'Sales' : 'Purchases'}
                                    </h4>
                                    <p className="text-sm opacity-80">Date: {formattedDate}</p>
                                    <p className="mt-2 text-xl font-semibold">
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0,
                                        }).format(transaction.total_amount)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-lg font-semibold">Low Stock Alerts</h3>
                    {lowStockProducts.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No products are below the minimum stock threshold.</p>
                    ) : (
                        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Product</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Current Stock</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Min Stock</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {lowStockProducts.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-4 py-2 font-medium text-gray-800">{product.name}</td>
                                            <td className="px-4 py-2 text-gray-600">{product.stock}</td>
                                            <td className="px-4 py-2 text-gray-600">{product.min_stock}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
