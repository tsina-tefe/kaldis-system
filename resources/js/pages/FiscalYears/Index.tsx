import { Head, Link, router, usePage } from '@inertiajs/react';
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
import type { FiscalYearPagination } from '@/types/fiscal-year';
import type { PageProps } from '@/types';

type Props = PageProps & {
    fiscalYears: FiscalYearPagination;
    request: {
        search?: string;
        status?: string;
    };
};

export default function Index({ fiscalYears, request }: Props) {
    const { auth } = usePage<PageProps>().props;
    const [searchQuery, setSearchQuery] = useState(request.search || '');
    const [statusFilter, setStatusFilter] = useState(request.status || 'all');

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            router.get(
                route('fiscal-years.index'),
                { search: searchQuery, status: statusFilter },
                { preserveState: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery, statusFilter]);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this fiscal year?')) {
            router.delete(route('fiscal-years.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Fiscal Years" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Ethiopian Fiscal Years</h1>
                    {auth.permissions.includes('create fiscal years') && (
                        <Button asChild>
                            <Link href={route('fiscal-years.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Fiscal Year
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
                                placeholder="Search fiscal years..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
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
                                    <th className="pb-3 text-left font-semibold">Name</th>
                                    <th className="pb-3 text-left font-semibold">Start Date</th>
                                    <th className="pb-3 text-left font-semibold">End Date</th>
                                    <th className="pb-3 text-left font-semibold">Months</th>
                                    <th className="pb-3 text-left font-semibold">Status</th>
                                    <th className="pb-3 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fiscalYears.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-gray-500">
                                            No fiscal years found
                                        </td>
                                    </tr>
                                ) : (
                                    fiscalYears.data.map((year) => (
                                        <tr key={year.id} className="border-b last:border-0">
                                            <td className="py-4">
                                                <div className="font-medium">{year.name}</div>
                                            </td>
                                            <td className="py-4 text-sm">{year.gregorian_start_date}</td>
                                            <td className="py-4 text-sm">{year.gregorian_end_date}</td>
                                            <td className="py-4">
                                                <span className="text-sm text-gray-600">
                                                    {year.fiscal_months_count || 0} months
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <span
                                                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                                        year.is_active
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                                    }`}
                                                >
                                                    {year.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex gap-2">
                                                    {auth.permissions.includes('update fiscal years') && (
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={route('fiscal-years.edit', year.id)}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {auth.permissions.includes('delete fiscal years') && (
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(year.id)}
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

                    {fiscalYears.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            {fiscalYears.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}

