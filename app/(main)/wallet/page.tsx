"use client";

import React, { useState } from "react";
import WalletView from "@/components/Wallet/WalletView";
import TransactionModal from "@/components/Modals/TransactionModal";
import UpdateBalanceModal from "@/components/Modals/UpdateBalanceModal";

export default function WalletPage() {
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedWalletName, setSelectedWalletName] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [defaultTxType, setDefaultTxType] = useState<"In" | "Out">("In");

  const handleAddTx = (name: string, type: "In" | "Out") => {
    setSelectedWalletName(name);
    setDefaultTxType(type);
    setIsTxModalOpen(true);
  };

  const handleUpdateBal = (wallet: any) => {
    setSelectedWallet(wallet);
    setIsUpdateModalOpen(true);
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-8">
      <WalletView 
        key={refreshKey}
        onAddTransaction={handleAddTx}
        onUpdateBalance={handleUpdateBal}
      />
      
      <TransactionModal 
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        walletName={selectedWalletName}
        initialType={defaultTxType}
        onSuccess={handleSuccess}
      />

      <UpdateBalanceModal 
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        wallet={selectedWallet}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
