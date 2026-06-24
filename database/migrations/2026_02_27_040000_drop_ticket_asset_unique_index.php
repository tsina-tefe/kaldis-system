<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::table('ticket_assets', function (Blueprint $table) {
        // Drop foreign keys that depend on the index first
        try {
            $table->dropForeign(['department_id']);
        } catch (\Throwable $e) {}

        try {
            $table->dropForeign(['ticket_sub_category_id']);
        } catch (\Throwable $e) {}

        // Now safe to drop the unique index
        try {
            $table->dropUnique('asset_dept_sub_name_unique');
        } catch (\Throwable $e) {}

        // Re-add the foreign keys
        try {
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('cascade');
        } catch (\Throwable $e) {}

        try {
            $table->foreign('ticket_sub_category_id')->references('id')->on('ticket_sub_categories')->onDelete('cascade');
        } catch (\Throwable $e) {}
    });
}

    public function down(): void
    {
        Schema::table('ticket_assets', function (Blueprint $table) {
            // Restore unique constraint on (department_id, ticket_sub_category_id, name)
            $table->unique(['department_id', 'ticket_sub_category_id', 'name'], 'asset_dept_sub_name_unique');
        });
    }
};
