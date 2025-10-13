<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EvaluationPeriod extends Model
{
    use HasFactory;

    protected $fillable = [
        'evaluation_period_name',
        'fiscal_year_id',
        'fiscal_month_id',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function fiscalYear(): BelongsTo
    {
        return $this->belongsTo(FiscalYear::class);
    }

    public function fiscalMonth(): BelongsTo
    {
        return $this->belongsTo(FiscalMonth::class);
    }

    public function evaluationResponses(): HasMany
    {
        return $this->hasMany(EvaluationResponse::class);
    }
}
