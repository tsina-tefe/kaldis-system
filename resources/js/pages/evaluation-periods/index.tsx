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
import type { EvaluationPeriodPagination } from '@/types/evaluation-period';
import type { PageProps } from '@/types';
import { toast } from 'sonner';

type Props = PageProps & {
    evaluationPeriods: EvaluationPeriodPagination;
    request: {
        search?: string;
        status?: string;
    };
};

export default function Index({ evaluationPeriods, request }: Props) {
    const { auth } = usePage<PageProps>().props;
    const { flash } = usePage<{ flash: { message?: string } }>().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        if (flash.message) {
            toast.success(flash.message);
        }
    }, [flash.message]);

    // Frontend-only search/filter

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this evaluation period?')) {
            router.delete(route('evaluation-periods.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Evaluation Periods" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Evaluation Periods</h1>
                    {auth.permissions.includes('create evaluation periods') && (
                        <Button asChild>
                            <Link href={route('evaluation-periods.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Evaluation Period
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
                                placeholder="Search evaluation periods..."
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
                                    <th className="pb-3 text-left font-semibold">Period Name</th>
                                    <th className="pb-3 text-left font-semibold">Fiscal Year</th>
                                    <th className="pb-3 text-left font-semibold">Fiscal Month</th>
                                    <th className="pb-3 text-left font-semibold">Status</th>
                                    <th className="pb-3 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evaluationPeriods.data
                                    .filter((period) => {
                                        const matchesSearch = !searchQuery ||
                                            (period.evaluation_period_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            (period.fiscal_year?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            (period.fiscal_month?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
                                        const matchesStatus = statusFilter === 'all' || period.status === statusFilter;
                                        return matchesSearch && matchesStatus;
                                    }).length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-500">
                                            No evaluation periods found
                                        </td>
                                    </tr>
                                ) : (
                                    evaluationPeriods.data
                                        .filter((period) => {
                                            const matchesSearch = !searchQuery ||
                                                (period.evaluation_period_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                (period.fiscal_year?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                (period.fiscal_month?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
                                            const matchesStatus = statusFilter === 'all' || period.status === statusFilter;
                                            return matchesSearch && matchesStatus;
                                        })
                                        .map((period) => (
                                        <tr key={period.id} className="border-b last:border-0">
                                            <td className="py-4">
                                                <div className="font-medium">{period.evaluation_period_name}</div>
                                            </td>
                                            <td className="py-4 text-sm">
                                                {period.fiscal_year?.name || 'N/A'}
                                            </td>
                                            <td className="py-4 text-sm">
                                                {period.fiscal_month?.name || 'N/A'}
                                            </td>
                                            <td className="py-4">
                                                <span
                                                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                                        period.status === 'active'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                                    }`}
                                                >
                                                    {period.status === 'active' ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex gap-2">
                                                    {auth.permissions.includes('update evaluation periods') && (
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={route('evaluation-periods.edit', period.id)}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {auth.permissions.includes('delete evaluation periods') && (
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(period.id)}
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

                    {evaluationPeriods.data.length > 0 && (
                        <TablePagination total={evaluationPeriods.total} from={evaluationPeriods.from} to={evaluationPeriods.to} links={evaluationPeriods.links} />
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
