import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';
import type { EvaluationResponsePagination } from '@/types/evaluation-response';
import type { PageProps } from '@/types';
import { toast } from 'sonner';

type Props = PageProps & {
    evaluationResponses: EvaluationResponsePagination;
    request: {
        search?: string;
    };
};

export default function Index({ evaluationResponses, request }: Props) {
    const { auth } = usePage<PageProps>().props;
    const { flash } = usePage<{ flash: { message?: string } }>().props;
    const [searchQuery, setSearchQuery] = useState(request.search || '');

    useEffect(() => {
        if (flash.message) {
            toast.success(flash.message);
        }
    }, [flash.message]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            router.get(
                route('evaluation-responses.index'),
                { search: searchQuery },
                { preserveState: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this evaluation response?')) {
            router.delete(route('evaluation-responses.destroy', id));
        }
    };

    const calculateAverageScore = (questionResponses: any[]) => {
        if (!questionResponses || questionResponses.length === 0) return 0;
        const total = questionResponses.reduce((sum, response) => sum + response.score, 0);
        return (total / questionResponses.length).toFixed(1);
    };

    return (
        <AppLayout>
            <Head title="" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold"></h1>
                    {auth.permissions.includes('create evaluation responses') && (
                        <Button asChild>
                            <Link href={route('evaluation-responses.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Evaluation Response
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
                                placeholder="Search evaluation responses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="pb-3 text-left font-semibold">Evaluator</th>
                                    <th className="pb-3 text-left font-semibold">Evaluatee</th>
                                    <th className="pb-3 text-left font-semibold">Period</th>
                                    <th className="pb-3 text-left font-semibold">Type</th>
                                    <th className="pb-3 text-left font-semibold">Average Score</th>
                                    <th className="pb-3 text-left font-semibold">Comment</th>
                                    <th className="pb-3 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evaluationResponses.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-gray-500">
                                            No evaluation responses found
                                        </td>
                                    </tr>
                                ) : (
                                    evaluationResponses.data.map((response) => (
                                        <tr key={response.id} className="border-b last:border-0">
                                            <td className="py-4">
                                                <div className="font-medium">
                                                    {response.evaluator?.name || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="font-medium">
                                                    {response.evaluate?.name || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="py-4 text-sm">
                                                {response.evaluation_period?.evaluation_period_name || 'N/A'}
                                            </td>
                                            <td className="py-4 text-sm">
                                                {response.evaluation_type?.name || 'N/A'}
                                            </td>
                                            <td className="py-4">
                                                <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                                    {calculateAverageScore(response.question_responses || [])}
                                                </span>
                                            </td>
                                            <td className="py-4 text-sm max-w-xs truncate">
                                                {response.comment || 'No comment'}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex gap-2">
                                                    {auth.permissions.includes('view evaluation responses') && (
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={`/evaluation-responses/${response.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {auth.permissions.includes('update evaluation responses') && (
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={route('evaluation-responses.edit', response.id)}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {auth.permissions.includes('delete evaluation responses') && (
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(response.id)}
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

                    {evaluationResponses.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            {evaluationResponses.links.map((link, index) => (
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
