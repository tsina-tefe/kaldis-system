import { Head, Link, usePage } from '@inertiajs/react';
import TablePagination from '@/components/table-pagination';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import type { FiscalMonthPagination } from '@/types/fiscal-month';
import type { FiscalYear } from '@/types/fiscal-year';
import type { PageProps } from '@/types';

type Props = PageProps & {
    fiscalMonths: FiscalMonthPagination;
    fiscalYears: FiscalYear[];
    request: {
        search?: string;
        status?: string;
        fiscal_year?: string;
    };
};

export default function Index({ fiscalMonths, fiscalYears, request }: Props) {
    const { auth } = usePage<PageProps>().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [fiscalYearFilter, setFiscalYearFilter] = useState('all');

    // Frontend-only search/filter

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this fiscal month?')) {
            router.delete(route('fiscal-months.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Fiscal Months" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Ethiopian Fiscal Months</h1>
                    {auth.permissions.includes('create fiscal months') && (
                        <Button asChild>
                            <Link href={route('fiscal-months.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Fiscal Month
                            </Link>
                        </Button>
                    )}
                </div>

                <Card className="p-6">
                    <div className="mb-6 flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search fiscal months..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={fiscalYearFilter} onValueChange={setFiscalYearFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Years</SelectItem>
                                {fiscalYears.map((year) => (
                                    <SelectItem key={year.id} value={year.id.toString()}>
                                        {year.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="pb-3 text-left font-semibold">Fiscal Year</th>
                                    <th className="pb-3 text-left font-semibold">Month</th>
                                    <th className="pb-3 text-left font-semibold">Month #</th>
                                    <th className="pb-3 text-left font-semibold">Start Date</th>
                                    <th className="pb-3 text-left font-semibold">End Date</th>
                                    <th className="pb-3 text-left font-semibold">Status</th>
                                    <th className="pb-3 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fiscalMonths.data
                                    .filter((month) => {
                                        const matchesSearch = !searchQuery ||
                                            (month.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            (month.fiscal_year?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
                                        const matchesStatus = statusFilter === 'all' || (month.is_active ? 'active' : 'inactive') === statusFilter;
                                        const matchesYear = fiscalYearFilter === 'all' || month.fiscal_year_id?.toString() === fiscalYearFilter;
                                        return matchesSearch && matchesStatus && matchesYear;
                                    }).length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-gray-500">
                                            No fiscal months found
                                        </td>
                                    </tr>
                                ) : (
                                    fiscalMonths.data
                                        .filter((month) => {
                                            const matchesSearch = !searchQuery ||
                                                (month.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                (month.fiscal_year?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
                                            const matchesStatus = statusFilter === 'all' || (month.is_active ? 'active' : 'inactive') === statusFilter;
                                            const matchesYear = fiscalYearFilter === 'all' || month.fiscal_year_id?.toString() === fiscalYearFilter;
                                            return matchesSearch && matchesStatus && matchesYear;
                                        })
                                        .map((month) => (
                                        <tr key={month.id} className="border-b last:border-0">
                                            <td className="py-4">
                                                <div className="font-medium">{month.fiscal_year?.name}</div>
                                            </td>
                                            <td className="py-4">{month.name}</td>
                                            <td className="py-4 text-sm text-gray-600">{month.efy_month_number}</td>
                                            <td className="py-4 text-sm">{month.gregorian_start_date}</td>
                                            <td className="py-4 text-sm">{month.gregorian_end_date}</td>
                                            <td className="py-4">
                                                <span
                                                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                                        month.is_active
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                                    }`}
                                                >
                                                    {month.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex gap-2">
                                                    {auth.permissions.includes('update fiscal months') && (
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={route('fiscal-months.edit', month.id)}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {auth.permissions.includes('delete fiscal months') && (
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(month.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {fiscalMonths.data.length > 0 && (
                        <TablePagination total={fiscalMonths.total} from={fiscalMonths.from} to={fiscalMonths.to} links={fiscalMonths.links} />
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}

