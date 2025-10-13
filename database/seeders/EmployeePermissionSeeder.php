<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class EmployeePermissionSeeder extends Seeder
{
    public function run()
    {
        Permission::create(['name' => 'view employees']);
        Permission::create(['name' => 'create employees']);
        Permission::create(['name' => 'update employees']);
        Permission::create(['name' => 'delete employees']);
    }
}
