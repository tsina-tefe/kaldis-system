<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'evaluator_group_id',
        'evaluates_group_id',
        'status',
    ];

    public function evaluatorGroup(): BelongsTo
    {
        return $this->belongsTo(EvaluatorGroup::class);
    }

    public function evaluatesGroup(): BelongsTo
    {
        return $this->belongsTo(EvaluatesGroup::class);
    }

    public function evaluationResponses(): HasMany
    {
        return $this->hasMany(EvaluationResponse::class);
    }
}
