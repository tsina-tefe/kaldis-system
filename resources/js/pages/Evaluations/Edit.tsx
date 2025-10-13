import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import type { Evaluation, EvaluatorGroup, EvaluatesGroup } from '@/types/evaluation';

type Props = {
    evaluation: Evaluation;
    evaluatorGroups: EvaluatorGroup[];
    evaluatesGroups: EvaluatesGroup[];
};

export default function Edit({ evaluation, evaluatorGroups, evaluatesGroups }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: evaluation.name,
        evaluator_group_id: evaluation.evaluator_group_id.toString(),
        evaluates_group_id: evaluation.evaluates_group_id.toString(),
        status: evaluation.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('evaluations.update', evaluation.id));
    };

    const getEvaluableTypeBadgeColor = (type: string) => {
        switch (type) {
            case 'employee':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'department':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'branch':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'other':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <AppLayout>
            <Head title="Edit Evaluation" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={route('evaluations.index')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold">Edit Evaluation</h1>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Evaluation Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter evaluation name"
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="evaluator_group_id">Evaluator Group (Who Evaluates)</Label>
                            <Select
                                value={data.evaluator_group_id}
                                onValueChange={(value) => setData('evaluator_group_id', value)}
                            >
                                <SelectTrigger className={errors.evaluator_group_id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select evaluator group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {evaluatorGroups.map((group) => (
                                        <SelectItem key={group.id} value={group.id.toString()}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{group.name}</span>
                                                {group.question_group && (
                                                    <span className="text-xs text-gray-500">
                                                        Questions: {group.question_group.name}
                                                    </span>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.evaluator_group_id && (
                                <p className="text-sm text-red-500">{errors.evaluator_group_id}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="evaluates_group_id">Evaluates Group (What is Being Evaluated)</Label>
                            <Select
                                value={data.evaluates_group_id}
                                onValueChange={(value) => setData('evaluates_group_id', value)}
                            >
                                <SelectTrigger className={errors.evaluates_group_id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select evaluates group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {evaluatesGroups.map((group) => (
                                        <SelectItem key={group.id} value={group.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{group.name}</span>
                                                    {group.question_group && (
                                                        <span className="text-xs text-gray-500">
                                                            Questions: {group.question_group.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <span
                                                    className={`ml-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getEvaluableTypeBadgeColor(group.evaluable_type)}`}
                                                >
                                                    {group.evaluable_type}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.evaluates_group_id && (
                                <p className="text-sm text-red-500">{errors.evaluates_group_id}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(value: any) => setData('status', value)}>
                                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Evaluation'}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href={route('evaluations.index')}>Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}

