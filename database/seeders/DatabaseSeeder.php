<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        $adminRoleId = Role::where('slug', 'admin')->value('id');

        User::updateOrCreate(
            ['email' => 'admin@pos.test'],
            [
                'name' => 'Admin POS',
                'role_id' => $adminRoleId,
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
    }
}
