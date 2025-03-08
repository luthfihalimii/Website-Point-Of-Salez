<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        return Inertia::render('Transaction/Index',[
            'transaction' => Transaction::latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Transaction/Create',[
            'products' => Product::with('category')->get()
        ]);
    }
}
