<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerRequest;
use App\Models\Partner;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PartnerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Partner/Index', [
            'partners' => Partner::orderBy('type')->orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Partner/Create');
    }

    public function store(PartnerRequest $request): RedirectResponse
    {
        Partner::create($request->validated());

        return to_route('partner.index');
    }

    public function edit(Partner $partner): Response
    {
        return Inertia::render('Partner/Edit', [
            'partner' => $partner,
        ]);
    }

    public function update(PartnerRequest $request, Partner $partner): RedirectResponse
    {
        $partner->update($request->validated());

        return to_route('partner.index');
    }

    public function destroy(Partner $partner): RedirectResponse
    {
        $partner->delete();

        return back();
    }
}
