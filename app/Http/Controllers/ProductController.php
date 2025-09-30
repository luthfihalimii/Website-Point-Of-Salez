<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Product/Index', [
            'products' => Product::with('category')->latest()->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Product/Create', [
            'category' => Category::get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->storeAs('products', $image->hashName());
            $data['image'] = $imagePath;
        }
        Product::create($data);
        return to_route('product.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return Inertia::render('Product/Detail',[
            'product' => Product::findOrFail($product->id)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('Product/Edit',[
            'product' => Product::findOrFail($id),
            'category' => Category::get()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, Product $product)
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            $previousImage = $product->getRawOriginal('image');

            if ($previousImage) {
                Storage::delete($previousImage);
            }

            $image = $request->file('image');
            $imagePath = $image->storeAs('products', $image->hashName());
            $data['image'] = $imagePath;
        } else {
            unset($data['image']);
        }
        $product->update($data);
        return to_route('product.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $previousImage = $product->getRawOriginal('image');
        $product->delete();

        if ($previousImage) {
            Storage::delete($previousImage);
        }
        return to_route('product.index');
    }

    /**
     ** Kode berikut ini untuk generate kode produk otomatis berdasarkan kategori produk yang dipilih
     *  Jadi cara kerjanya adalah kita akan mengambil data produk terakhir berdasarkan kategori produk yang dipilih
     *  Lalu kita akan mengambil angka terakhir dari kode produk tersebut
     *  dan menambahkan 1 angka lagi untuk kode produk yang baru
     */
    public function getLastProductNumber($categoryId)
    {
        $lastProduct = Product::where('category_id', $categoryId)
            ->orderBy('created_at', 'desc')
            ->first();

        $lastNumber = 0;
        if ($lastProduct && preg_match('/-(\d{2})$/', $lastProduct->product_code, $matches)) {
            $lastNumber = (int) $matches[1];
        }

        return response()->json(['last_number' => $lastNumber]);
    }
}
