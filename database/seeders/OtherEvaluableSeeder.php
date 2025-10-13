<?php

namespace Database\Seeders;

use App\Models\OtherEvaluable;
use Illuminate\Database\Seeder;

class OtherEvaluableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $otherEvaluables = [
            [
                'name' => 'Customer Feedback',
                'description' => 'Evaluation based on customer satisfaction surveys and feedback',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Project Completion',
                'description' => 'Assessment of project delivery timelines and quality',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Innovation Score',
                'description' => 'Evaluation of creative solutions and new ideas contributed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Team Collaboration',
                'description' => 'Assessment of teamwork and collaboration skills',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Training Completion',
                'description' => 'Tracking of mandatory and optional training courses completed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Safety Compliance',
                'description' => 'Evaluation of adherence to safety protocols and regulations',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Quality Metrics',
                'description' => 'Assessment based on quality control standards and measurements',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cost Efficiency',
                'description' => 'Evaluation of resource optimization and budget management',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($otherEvaluables as $evaluable) {
            OtherEvaluable::create($evaluable);
        }
    }
}

