<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'branch_code',
        'name',
        'location',
        'contact_email',
        'contact_phone',
        'description',
    ];

    public function departments()
    {
        return $this->belongsToMany(Department::class);
    }
}
