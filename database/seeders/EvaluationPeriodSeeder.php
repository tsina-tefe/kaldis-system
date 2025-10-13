<?php

namespace Database\Seeders;

use App\Models\EvaluationPeriod;
use App\Models\FiscalMonth;
use App\Models\FiscalYear;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EvaluationPeriodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get active fiscal year and months
        $activeFiscalYear = FiscalYear::where('is_active', true)->first();
        
        if (!$activeFiscalYear) {
            $this->command->warn('No active fiscal year found. Please create one first.');
            return;
        }

        $activeFiscalMonths = FiscalMonth::where('fiscal_year_id', $activeFiscalYear->id)
            ->where('is_active', true)
            ->get();

        if ($activeFiscalMonths->isEmpty()) {
            $this->command->warn('No active fiscal months found. Please create some first.');
            return;
        }

        $evaluationPeriods = [
            [
                'evaluation_period_name' => 'Q1 Performance Review',
                'fiscal_year_id' => $activeFiscalYear->id,
                'fiscal_month_id' => $activeFiscalMonths->first()->id,
                'status' => 'active',
            ],
            [
                'evaluation_period_name' => 'Mid-Year Assessment',
                'fiscal_year_id' => $activeFiscalYear->id,
                'fiscal_month_id' => $activeFiscalMonths->skip(1)->first()?->id ?? $activeFiscalMonths->first()->id,
                'status' => 'active',
            ],
            [
                'evaluation_period_name' => 'Annual Performance Review',
                'fiscal_year_id' => $activeFiscalYear->id,
                'fiscal_month_id' => $activeFiscalMonths->skip(2)->first()?->id ?? $activeFiscalMonths->first()->id,
                'status' => 'inactive',
            ],
        ];

        foreach ($evaluationPeriods as $period) {
            EvaluationPeriod::firstOrCreate(
                [
                    'evaluation_period_name' => $period['evaluation_period_name'],
                    'fiscal_year_id' => $period['fiscal_year_id'],
                ],
                $period
            );
        }

        $this->command->info('✅ Evaluation periods seeded successfully!');
    }
}
