<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class BranchPermissionSeeder extends Seeder
{
    public function run()
    {
        Permission::create(['name' => 'view branches']);
        Permission::create(['name' => 'create branches']);
        Permission::create(['name' => 'update branches']);
        Permission::create(['name' => 'delete branches']);
    }
}