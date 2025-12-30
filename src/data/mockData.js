export const initialTransactions = [
    {
        id: '1',
        type: 'income',
        amount: 15000000,
        category: 'Gaji',
        date: new Date().toISOString().split('T')[0], // Today
        note: 'Gaji Bulanan'
    },
    {
        id: '2',
        type: 'expense',
        amount: 50000,
        category: 'Makan',
        date: new Date().toISOString().split('T')[0], // Today
        note: 'Makan Siang Nasi Padang'
    },
    {
        id: '3',
        type: 'expense',
        amount: 250000,
        category: 'Transport',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
        note: 'Isi Bensin Mobil'
    },
    {
        id: '4',
        type: 'expense',
        amount: 150000,
        category: 'Belanja',
        date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], // 2 days ago
        note: 'Belanja Bulanan Mart'
    },
    {
        id: '5',
        type: 'income',
        amount: 2500000,
        category: 'Freelance',
        date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        note: 'Proyek Web Design'
    },
    {
        id: '6',
        type: 'expense',
        amount: 500000,
        category: 'Hiburan',
        date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
        note: 'Nonton Bioskop & Makan'
    }
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
