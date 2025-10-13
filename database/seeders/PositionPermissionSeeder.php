<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PositionPermissionSeeder extends Seeder
{
    public function run()
    {
        Permission::create(['name' => 'view positions']);
        Permission::create(['name' => 'create positions']);
        Permission::create(['name' => 'update positions']);
        Permission::create(['name' => 'delete positions']);
    }
}
