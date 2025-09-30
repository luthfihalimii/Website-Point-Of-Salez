<?php

namespace App\Http\Controllers;

use App\Http\Requests\CashSessionRequest;
use App\Http\Requests\CloseCashSessionRequest;
use App\Models\CashSession;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CashSessionController extends Controller
{
    public function index(): Response
    {
        $userId = auth()->id();

        $activeSession = CashSession::where('user_id', $userId)
            ->where('status', 'OPEN')
            ->latest('opened_at')
            ->first();

        $sessions = CashSession::with('user')
            ->where('user_id', $userId)
            ->orderByDesc('opened_at')
            ->paginate(20);

        return Inertia::render('CashSession/Index', [
            'activeSession' => $activeSession,
            'sessions' => $sessions,
        ]);
    }

    public function store(CashSessionRequest $request): RedirectResponse
    {
        $userId = $request->user()->id;

        $hasOpenSession = CashSession::where('user_id', $userId)
            ->where('status', 'OPEN')
            ->exists();

        if ($hasOpenSession) {
            return back()->withErrors(['session' => 'Masih ada sesi kasir yang aktif. Tutup terlebih dahulu.']);
        }

        CashSession::create([
            'user_id' => $userId,
            'opened_at' => now(),
            'opening_balance' => $request->validated()['opening_balance'],
            'expected_balance' => $request->validated()['opening_balance'],
            'notes' => $request->validated()['notes'] ?? null,
        ]);

        return back();
    }

    public function close(CloseCashSessionRequest $request, CashSession $cashSession): RedirectResponse
    {
        if ($cashSession->status !== 'OPEN') {
            return back()->withErrors(['session' => 'Sesi kasir sudah ditutup.']);
        }

        $closingData = $request->validated();

        $salesTotal = Transaction::sales()
            ->where('user_id', $cashSession->user_id)
            ->where('status', Transaction::STATUS_COMPLETED)
            ->whereBetween('transaction_date', [$cashSession->opened_at, now()])
            ->sum('total_amount');

        $expectedBalance = $cashSession->opening_balance + $salesTotal;
        $difference = $closingData['closing_balance'] - $expectedBalance;

        $cashSession->update([
            'closed_at' => now(),
            'status' => 'CLOSED',
            'cash_sales_total' => $closingData['cash_sales_total'],
            'closing_balance' => $closingData['closing_balance'],
            'expected_balance' => $expectedBalance,
            'difference' => $difference,
            'notes' => $closingData['notes'] ?? null,
        ]);

        return back();
    }
}
