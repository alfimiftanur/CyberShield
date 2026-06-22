<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class LabAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('lab_accounts')->insert([
            ['username' => 'admin', 'password' => 'SuperSecret123', 'role' => 'admin'],
            ['username' => 'jdoe', 'password' => 'password1', 'role' => 'employee'],
        ]);
    }
}
