import { Head, Link } from '@inertiajs/react';

const features = [
    {
        title: 'Kas Lebih Tertata',
        description:
            'Kelola transaksi penjualan dan pembelian dalam satu dasbor real-time lengkap dengan insight harian yang mudah dipahami.',
    },
    {
        title: 'Inventaris Anti Ribet',
        description:
            'Pantau stok produk, tetapkan stok minimum, dan terima peringatan otomatis sebelum kehabisan barang populer.',
    },
    {
        title: 'Analitik Cerdas',
        description:
            'Temukan pola penjualan terbaik dengan visualisasi data yang tajam untuk mendukung keputusan bisnis yang cepat.',
    },
];

const stats = [
    { label: 'Bisnis Terbantu', value: '1500+' },
    { label: 'Rerata Waktu Implementasi', value: '48 Jam' },
    { label: 'Tingkat Akurasi Stok', value: '99%' },
];

export default function Welcome() {
    return (
        <>
            <Head title="POS Modern" />
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-950 to-orange-600 text-white">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.3),transparent_55%)]" />
                <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-16 pt-8 sm:px-10">
                    <header className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="text-lg font-black uppercase tracking-[0.4em] text-orange-400 transition hover:text-orange-300"
                        >
                            KasirTefaRPL
                        </Link>
                        <nav className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-[0.3em] text-white/80 md:flex">
                            <a className="transition hover:text-white" href="#features">
                                Fitur
                            </a>
                            <a className="transition hover:text-white" href="#stories">
                                Cerita
                            </a>
                            <a className="transition hover:text-white" href="#cta">
                                Mulai
                            </a>
                        </nav>
                        <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em]">
                            <Link
                                href="/login"
                                className="rounded-full border border-white/30 px-4 py-2 transition hover:border-white hover:text-white"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="hidden rounded-full bg-orange-500 px-4 py-2 text-black shadow-lg shadow-orange-500/30 transition hover:bg-orange-400 md:inline-flex"
                            >
                                Daftar
                            </Link>
                        </div>
                    </header>

                    <main className="flex flex-1 flex-col justify-center gap-12 pt-16">
                        <section className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <p className="text-sm uppercase tracking-[0.5em] text-orange-300">Point of Sale Modern</p>
                                    <h1 className="font-serif text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                                        Kelola bisnis ritel Anda dengan gaya berani dan data yang presisi.
                                    </h1>
                                </div>
                                <p className="max-w-xl text-lg text-white/70">
                                    KasirTefaRPL membantu tim ritel merayakan performa terbaiknya melalui tampilan kasir yang intuitif,
                                    laporan hyper-detail, dan otomatisasi stok yang siap tumbuh bersama brand Anda.
                                </p>
                                <div className="flex flex-wrap gap-4" id="cta">
                                    <Link
                                        href="/register"
                                        className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-semibold uppercase tracking-[0.3em] text-black shadow-xl shadow-orange-500/40 transition hover:bg-orange-100"
                                    >
                                        Mulai Gratis
                                        <span className="text-xl transition group-hover:translate-x-1">→</span>
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white hover:text-white"
                                    >
                                        Demo Interaktif
                                    </Link>
                                </div>
                                <div className="grid gap-6 pt-6 sm:grid-cols-3">
                                    {stats.map((stat) => (
                                        <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                                            <p className="text-xs uppercase tracking-[0.35em] text-white/60">{stat.label}</p>
                                            <p className="mt-3 text-2xl font-black text-orange-200">{stat.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative h-full">
                                <div className="absolute -top-10 -right-6 hidden h-48 w-48 rounded-full bg-orange-500 blur-3xl sm:block" />
                                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-orange-900/50 backdrop-blur">
                                    <p className="text-sm uppercase tracking-[0.4em] text-orange-300">Performa</p>
                                    <h2 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-white">Satu platform, semua cabang</h2>
                                    <p className="mt-3 text-white/70">
                                        Sinkronisasi kasir, gudang, dan laporan keuangan dalam satu kontrol panel yang bergerak secepat tim Anda.
                                        Monitor real-time dari perangkat apa pun, kapan pun.
                                    </p>
                                    <div className="mt-8 grid gap-4 text-sm text-white/70">
                                        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                                            <span className="mt-1 h-3 w-3 rounded-full bg-orange-400" />
                                            <div>
                                                <p className="font-semibold uppercase tracking-[0.3em] text-white">Shift Tracking</p>
                                                <p className="text-white/60">Kelola sesi kasir, lacak kas masuk, dan tutup shift tanpa selisih.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                                            <span className="mt-1 h-3 w-3 rounded-full bg-orange-400" />
                                            <div>
                                                <p className="font-semibold uppercase tracking-[0.3em] text-white">Smart Restock</p>
                                                <p className="text-white/60">Prediksi kebutuhan stok dengan akurasi tinggi memakai trend penjualan.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                                            <span className="mt-1 h-3 w-3 rounded-full bg-orange-400" />
                                            <div>
                                                <p className="font-semibold uppercase tracking-[0.3em] text-white">Insight Instan</p>
                                                <p className="text-white/60">Dapatkan metrik kinerja penting dalam tampilan yang elegan.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="features" className="space-y-8">
                            <p className="text-sm uppercase tracking-[0.5em] text-orange-300">Kenapa KasirTefaRPL</p>
                            <h2 className="font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                Dirancang untuk brand yang ingin tumbuh cepat dan terukur.
                            </h2>
                            <div className="grid gap-6 md:grid-cols-3">
                                {features.map((feature) => (
                                    <div
                                        key={feature.title}
                                        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-orange-400/60 hover:bg-orange-500/10"
                                    >
                                        <div className="absolute inset-0 -translate-y-full bg-gradient-to-br from-orange-500/40 to-transparent opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100" />
                                        <div className="relative space-y-3">
                                            <h3 className="font-serif text-2xl font-bold tracking-tight text-white">{feature.title}</h3>
                                            <p className="text-sm leading-relaxed text-white/70">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section
                            id="stories"
                            className="rounded-3xl border border-white/10 bg-gradient-to-br from-black/70 via-black/50 to-orange-500/20 p-10 backdrop-blur"
                        >
                            <div className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
                                <div className="space-y-4">
                                    <p className="text-sm uppercase tracking-[0.5em] text-orange-300">Cerita Lapangan</p>
                                    <h2 className="font-serif text-3xl font-extrabold tracking-tight text-white">
                                        Tim kasir lebih percaya diri, owner makin cepat mengambil keputusan.
                                    </h2>
                                    <p className="text-white/70">
                                        "Sejak pakai KasirTefaRPL, stok kami selalu terpenuhi dan laporan harian tinggal sekali klik. Tim bisa fokus
                                        melayani pelanggan ketimbang sibuk dengan spreadsheet." — <span className="font-semibold text-orange-200">Dina, Founder POP Mart</span>
                                    </p>
                                </div>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
                                        <p className="text-xs uppercase tracking-[0.35em] text-orange-300">Omzet Naik</p>
                                        <p className="mt-3 text-3xl font-black text-white">27%</p>
                                        <p className="mt-2 text-sm text-white/60">Setelah 3 bulan implementasi pada 4 cabang ritel fashion.</p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
                                        <p className="text-xs uppercase tracking-[0.35em] text-orange-300">Waktu Tutup Shift</p>
                                        <p className="mt-3 text-3xl font-black text-white">-65%</p>
                                        <p className="mt-2 text-sm text-white/60">Pencocokan kas efisien dengan hitungan otomatis dan log audit.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>

                    <footer className="mt-16 border-t border-white/10 pt-8 text-sm text-white/50">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <p>&copy; {new Date().getFullYear()} KasirTefaRPL. Semua hak dilindungi.</p>
                            <div className="flex gap-4 uppercase tracking-[0.3em]">
                                <a href="#" className="transition hover:text-white">
                                    Kebijakan Privasi
                                </a>
                                <a href="#" className="transition hover:text-white">
                                    Syarat Layanan
                                </a>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
