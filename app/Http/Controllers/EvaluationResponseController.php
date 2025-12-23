<?php

namespace App\Http\Controllers;

use App\Models\EvaluationResponse;
use App\Models\EvaluationPeriod;
use App\Models\EvaluationType;
use App\Models\Question;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EvaluationResponseController extends Controller
{
    public function index(Request $request)
    {
        $evaluationResponses = EvaluationResponse::query()
            ->with(['evaluator', 'evaluate', 'evaluationPeriod', 'evaluationType', 'questionResponses.question'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('evaluator', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('evaluate', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('evaluationPeriod', function ($q) use ($search) {
                    $q->where('evaluation_period_name', 'like', "%{$search}%");
                });
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('evaluation-responses/index', [
            'evaluationResponses' => $evaluationResponses,
            'request' => $request->only('search'),
        ]);
    }

    public function create()
    {
        $evaluationPeriods = EvaluationPeriod::where('status', 'active')->get();
        $evaluationTypes = EvaluationType::all();
        $users = User::with('employee')->get();
        $questions = Question::where('status', 'active')->get();

        return Inertia::render('evaluation-responses/create', [
            'evaluationPeriods' => $evaluationPeriods,
            'evaluationTypes' => $evaluationTypes,
            'users' => $users,
            'questions' => $questions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'evaluator_id' => 'required|exists:users,id',
            'evaluate_id' => 'required|exists:users,id',
            'evaluation_period_id' => 'required|exists:evaluation_periods,id',
            'evaluation_type_id' => 'required|exists:evaluation_types,id',
            'comment' => 'nullable|string',
            'question_responses' => 'required|array|min:1',
            'question_responses.*.question_id' => 'required|exists:questions,id',
            'question_responses.*.score' => 'required|integer|min:1|max:5',
        ]);

        $evaluationResponse = EvaluationResponse::create([
            'evaluator_id' => $validated['evaluator_id'],
            'evaluate_id' => $validated['evaluate_id'],
            'evaluation_period_id' => $validated['evaluation_period_id'],
            'evaluation_type_id' => $validated['evaluation_type_id'],
            'comment' => $validated['comment'],
        ]);

        foreach ($validated['question_responses'] as $questionResponse) {
            $evaluationResponse->questionResponses()->create([
                'question_id' => $questionResponse['question_id'],
                'score' => $questionResponse['score'],
            ]);
        }

        return redirect()->route('evaluation-responses.index')
            ->with('message', 'Evaluation Response created successfully!');
    }

    public function edit(EvaluationResponse $evaluationResponse)
    {
        $evaluationResponse->load(['questionResponses.question']);
        $evaluationPeriods = EvaluationPeriod::where('status', 'active')->get();
        $evaluationTypes = EvaluationType::all();
        $users = User::with('employee')->get();
        $questions = Question::where('status', 'active')->get();

        return Inertia::render('evaluation-responses/edit', [
            'evaluationResponse' => $evaluationResponse,
            'evaluationPeriods' => $evaluationPeriods,
            'evaluationTypes' => $evaluationTypes,
            'users' => $users,
            'questions' => $questions,
        ]);
    }

    public function update(Request $request, EvaluationResponse $evaluationResponse)
    {
        $validated = $request->validate([
            'evaluator_id' => 'required|exists:users,id',
            'evaluate_id' => 'required|exists:users,id',
            'evaluation_period_id' => 'required|exists:evaluation_periods,id',
            'evaluation_type_id' => 'required|exists:evaluation_types,id',
            'comment' => 'nullable|string',
            'question_responses' => 'required|array|min:1',
            'question_responses.*.question_id' => 'required|exists:questions,id',
            'question_responses.*.score' => 'required|integer|min:1|max:5',
        ]);

        $evaluationResponse->update([
            'evaluator_id' => $validated['evaluator_id'],
            'evaluate_id' => $validated['evaluate_id'],
            'evaluation_period_id' => $validated['evaluation_period_id'],
            'evaluation_type_id' => $validated['evaluation_type_id'],
            'comment' => $validated['comment'],
        ]);

        // Delete existing question responses and create new ones
        $evaluationResponse->questionResponses()->delete();
        foreach ($validated['question_responses'] as $questionResponse) {
            $evaluationResponse->questionResponses()->create([
                'question_id' => $questionResponse['question_id'],
                'score' => $questionResponse['score'],
            ]);
        }

        return redirect()->route('evaluation-responses.index')
            ->with('message', 'Evaluation Response updated successfully!');
    }

    public function destroy(EvaluationResponse $evaluationResponse)
    {
        $evaluationResponse->delete();

        return redirect()->route('evaluation-responses.index')
            ->with('message', 'Evaluation Response deleted successfully!');
    }
}
