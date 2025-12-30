import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import AddTransactionModal from '../shared/AddTransactionModal';
import { useTransactions } from '../../context/TransactionContext';

export default function Layout() {
    const { isModalOpen, closeModal, openModal, editingTransaction } = useTransactions();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
            <Sidebar onOpenAdd={() => openModal()} />

            <main className="lg:pl-64 min-h-screen pb-20 lg:pb-0">
                <div className="max-w-5xl mx-auto p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>

            <BottomNav onOpenAdd={() => openModal()} />

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={closeModal}
                editData={editingTransaction}
            />
        </div>
    );
}
