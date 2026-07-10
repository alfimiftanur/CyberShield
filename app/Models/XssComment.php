<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class XssComment extends Model
{
    protected $fillable = [
        'author_name',
        'body',
        'target_version',
    ];
}