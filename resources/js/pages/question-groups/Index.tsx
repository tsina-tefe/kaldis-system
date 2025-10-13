import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { usePermission } from '@/hooks/user-permissions';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import type { QuestionGroup } from '@/types/question-groups';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Question Groups', href: '/question-groups' },
];

export default function QuestionGroupsIndex({ groups }: { groups: { data: QuestionGroup[]; total: number; from: number; to: number; links: any[] } }) {
    const { can } = usePermission();
    const [search, setSearch] = React.useState('');

    // Frontend-only search: filter current page rows in-memory

    function deleteGroup(id: number) {
        if (confirm('Are you sure?')) {
            router.delete(`/question-groups/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Question Groups" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Question Groups</CardTitle>
                        <div className="ml-4">
                            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search groups..." />
                        </div>
                        <CardAction>
                            {can('create question groups') && (
                                <Link href="/question-groups/create">
                                    <Button variant="default">Add New</Button>
                                </Link>
                            )}
                        </CardAction>
                    </CardHeader>
                    <hr />
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Questions</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {groups.data
                                    .filter((g) => !search || g.name.toLowerCase().includes(search.toLowerCase()))
                                    .map((g) => (
                                    <TableRow key={g.id}>
                                        <TableCell>{g.name}</TableCell>
                                        <TableCell>{g.questions_count ?? 0}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            {can('update question groups') && (
                                                <Link href={`/question-groups/${g.id}/edit`}>
                                                    <Button size="sm" variant="secondary">Edit</Button>
                                                </Link>
                                            )}
                                            {can('delete question groups') && (
                                                <Button size="sm" variant="destructive" onClick={() => deleteGroup(g.id)}>Delete</Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}


