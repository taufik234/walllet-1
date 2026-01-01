export const initialTransactions = [
    {
        id: '1',
        type: 'income',
        amount: 15000000,
        category: 'Gaji',
        date: new Date().toISOString().split('T')[0], // Today
        note: 'Gaji Bulanan',
        wallet: 'bank'
    },
    {
        id: '2',
        type: 'expense',
        amount: 50000,
        category: 'Makan',
        date: new Date().toISOString().split('T')[0], // Today
        note: 'Makan Siang Nasi Padang',
        wallet: 'cash'
    },
    {
        id: '3',
        type: 'expense',
        amount: 250000,
        category: 'Transport',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
        note: 'Isi Bensin Mobil',
        wallet: 'ewallet'
    },
    {
        id: '4',
        type: 'expense',
        amount: 150000,
        category: 'Belanja',
        date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], // 2 days ago
        note: 'Belanja Bulanan Mart',
        wallet: 'cash'
    },
    {
        id: '5',
        type: 'income',
        amount: 2500000,
        category: 'Freelance',
        date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        note: 'Proyek Web Design',
        wallet: 'bank'
    },
    {
        id: '6',
        type: 'expense',
        amount: 500000,
        category: 'Hiburan',
        date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
        note: 'Nonton Bioskop & Makan',
        wallet: 'ewallet'
    },
    // Added for pagination testing
    { id: '7', type: 'expense', amount: 15000, category: 'makan', date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0], note: 'Kopi Pagi', wallet: 'cash' },
    { id: '8', type: 'expense', amount: 20000, category: 'transport', date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0], note: 'Ojek ke Kantor', wallet: 'ewallet' },
    { id: '9', type: 'expense', amount: 120000, category: 'belanja', date: new Date(Date.now() - 86400000 * 6).toISOString().split('T')[0], note: 'Beli Token Listrik', wallet: 'bank' },
    { id: '10', type: 'expense', amount: 35000, category: 'makan', date: new Date(Date.now() - 86400000 * 6).toISOString().split('T')[0], note: 'Makan Malam', wallet: 'cash' },
    { id: '11', type: 'expense', amount: 50000, category: 'hiburan', date: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0], note: 'Langganan Streaming', wallet: 'ewallet' },
    { id: '12', type: 'income', amount: 500000, category: 'bonus', date: new Date(Date.now() - 86400000 * 8).toISOString().split('T')[0], note: 'Bonus Project', wallet: 'bank' },
    { id: '13', type: 'expense', amount: 15000, category: 'transport', date: new Date(Date.now() - 86400000 * 9).toISOString().split('T')[0], note: 'Parkir', wallet: 'cash' },
    { id: '14', type: 'expense', amount: 200000, category: 'kesehatan', date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0], note: 'Vitamin', wallet: 'cash' },
    { id: '15', type: 'expense', amount: 75000, category: 'makan', date: new Date(Date.now() - 86400000 * 11).toISOString().split('T')[0], note: 'Traktir Teman', wallet: 'ewallet' },
    { id: '16', type: 'expense', amount: 500000, category: 'belanja', date: new Date(Date.now() - 86400000 * 12).toISOString().split('T')[0], note: 'Baju Baru', wallet: 'bank' }
];

export const WALLETS = [
    { id: 'cash', label: 'Tunai', icon: 'Wallet' },
    { id: 'bank', label: 'Bank', icon: 'CreditCard' },
    { id: 'ewallet', label: 'E-Wallet', icon: 'Smartphone' }
];

export const CATEGORIES = {
    income: [
        { id: 'gaji', label: 'Gaji', icon: 'Wallet' },
        { id: 'freelance', label: 'Freelance', icon: 'Laptop' },
        { id: 'investasi', label: 'Investasi', icon: 'TrendingUp' },
        { id: 'bonus', label: 'Bonus', icon: 'Gift' },
        { id: 'lainnya', label: 'Lainnya', icon: 'MoreHorizontal' }
    ],
    expense: [
        { id: 'makan', label: 'Makan', icon: 'Utensils' },
        { id: 'transport', label: 'Transport', icon: 'Car' },
        { id: 'belanja', label: 'Belanja', icon: 'ShoppingBag' },
        { id: 'hiburan', label: 'Hiburan', icon: 'Film' },
        { id: 'tagihan', label: 'Tagihan', icon: 'FileText' },
        { id: 'kesehatan', label: 'Kesehatan', icon: 'Heart' },
        { id: 'pendidikan', label: 'Pendidikan', icon: 'Book' },
        { id: 'lainnya', label: 'Lainnya', icon: 'MoreHorizontal' }
    ]
};
