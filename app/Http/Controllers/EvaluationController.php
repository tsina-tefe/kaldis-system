<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use App\Models\EvaluatorGroup;
use App\Models\EvaluatesGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class EvaluationController extends Controller
{
    public function index(Request $request)
    {
        $query = Evaluation::with(['evaluatorGroup', 'evaluatesGroup']);

        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhereHas('evaluatorGroup', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%');
                })
                ->orWhereHas('evaluatesGroup', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%');
                });
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $evaluations = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Evaluations/Index', [
            'evaluations' => $evaluations,
            'request' => $request->only('search', 'status'),
        ]);
    }

    public function create()
    {
        $evaluatorGroups = EvaluatorGroup::with('questionGroup:id,name')
            ->select('id', 'name', 'question_group_id')
            ->orderBy('name')
            ->get();
        
        $evaluatesGroups = EvaluatesGroup::with('questionGroup:id,name')
            ->select('id', 'name', 'question_group_id', 'evaluable_type')
            ->orderBy('name')
            ->get();

        return Inertia::render('Evaluations/Create', [
            'evaluatorGroups' => $evaluatorGroups,
            'evaluatesGroups' => $evaluatesGroups,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'evaluator_group_id' => 'required|exists:evaluator_groups,id',
            'evaluates_group_id' => 'required|exists:evaluates_groups,id',
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        Evaluation::create($validated);

        return Redirect::route('evaluations.index')->with('flash.message', 'Evaluation created successfully!');
    }

    public function edit(Evaluation $evaluation)
    {
        $evaluatorGroups = EvaluatorGroup::with('questionGroup:id,name')
            ->select('id', 'name', 'question_group_id')
            ->orderBy('name')
            ->get();
        
        $evaluatesGroups = EvaluatesGroup::with('questionGroup:id,name')
            ->select('id', 'name', 'question_group_id', 'evaluable_type')
            ->orderBy('name')
            ->get();

        return Inertia::render('Evaluations/Edit', [
            'evaluation' => $evaluation->load(['evaluatorGroup', 'evaluatesGroup']),
            'evaluatorGroups' => $evaluatorGroups,
            'evaluatesGroups' => $evaluatesGroups,
        ]);
    }

    public function update(Request $request, Evaluation $evaluation)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'evaluator_group_id' => 'required|exists:evaluator_groups,id',
            'evaluates_group_id' => 'required|exists:evaluates_groups,id',
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        $evaluation->update($validated);

        return Redirect::route('evaluations.index')->with('flash.message', 'Evaluation updated successfully!');
    }

    public function destroy(Evaluation $evaluation)
    {
        $evaluation->delete();

        return Redirect::route('evaluations.index')->with('flash.message', 'Evaluation deleted successfully!');
    }
}
