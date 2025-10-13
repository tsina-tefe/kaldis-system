import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Evaluation = {
  id: number;
  name?: string;
};

export default function MyEvaluationIndex({ evaluations }: { evaluations: Evaluation[] }) {
  const { props } = usePage();
  const { flash } = props as any;

  return (
    <AppLayout>
      <Head title="My Evaluation" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Evaluation</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Evaluations Assigned To You</CardTitle>
          </CardHeader>
          <CardContent>
            {evaluations.length === 0 ? (
              <p className="text-gray-500">No evaluations assigned.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {evaluations.map((ev) => (
                  <div key={ev.id} className="flex items-center justify-between rounded border p-3">
                    <div className="font-medium">{ev.name || `Evaluation #${ev.id}`}</div>
                    <Button asChild>
                      <Link href={`/my-evaluation/${ev.id}`}>Open</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}


