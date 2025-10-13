<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First, ensure all permissions exist
        $this->call(PermissionSeeder::class);

        // Create Super Admin role
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin']);

        // Get all permissions
        $allPermissions = Permission::all();

        // Assign all permissions to Super Admin role
        $superAdminRole->syncPermissions($allPermissions);

        // Find user with ID 2
        $user = User::find(2);

        if ($user) {
            // Assign Super Admin role to user
            $user->assignRole('Super Admin');

            $this->command->info("✅ Super Admin role created with {$allPermissions->count()} permissions");
            $this->command->info("✅ Super Admin role assigned to user: {$user->name} (ID: {$user->id}, Email: {$user->email})");
        } else {
            $this->command->error("❌ User with ID 2 not found!");
        }
    }
}

