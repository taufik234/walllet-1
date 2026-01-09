import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Helper to format currency for export
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};

export const exportToExcel = (transactions, filename = 'laporan-keuangan') => {
    // Format data for Excel
    const data = transactions.map(t => ({
        Tanggal: format(new Date(t.date), 'dd MMMM yyyy', { locale: id }),
        Kategori: t.category?.name || 'Lainnya',
        Catatan: t.note || '-',
        Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        Dompet: t.wallet?.name || 'Tunai',
        Jumlah: Number(t.amount)
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");

    // Save file
    XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToPDF = (transactions, periodLabel = 'Laporan Keuangan', summary = {}) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(periodLabel, 14, 22);

    doc.setFontSize(11);
    doc.text(`Dicetak pada: ${format(new Date(), 'dd MMMM yyyy HH:mm', { locale: id })}`, 14, 30);

    // Summary Section if provided
    let startY = 40;
    if (summary.totalIncome !== undefined) {
        doc.text(`Total Pemasukan: ${formatCurrency(summary.totalIncome)}`, 14, startY);
        startY += 7;
        doc.text(`Total Pengeluaran: ${formatCurrency(summary.totalExpense)}`, 14, startY);
        startY += 7;
        doc.text(`Sisa Saldo: ${formatCurrency(summary.totalIncome - summary.totalExpense)}`, 14, startY);
        startY += 10;
    }

    // Table
    const tableColumn = ["Tanggal", "Kategori", "Catatan", "Tipe", "Dompet", "Jumlah"];
    const tableRows = transactions.map(t => [
        format(new Date(t.date), 'dd/MM/yyyy'),
        t.category?.name || '-',
        t.note || '-',
        t.type === 'income' ? 'Masuk' : 'Keluar',
        t.wallet?.name || '-',
        formatCurrency(t.amount)
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: startY,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [79, 70, 229] } // Indigo color
    });

    doc.save('laporan-keuangan.pdf');
};
