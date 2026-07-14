"use client";

import { useState } from "react";
import WalletSection from "./WalletSection";
import WalletModal from "./WalletModal";
import WithdrawModal from "./WithdrawModal";

export default function Wallet() {
    const [walletOpen, setWalletOpen] = useState(false);
    const [withdrawOpen, setWithdrawOpen] = useState(false);

    return (
        <>
            <WalletSection
                onAddMoney={() => setWalletOpen(true)}
                onWithdraw={() => setWithdrawOpen(true)}
            />

            <WalletModal
                open={walletOpen}
                onClose={() => setWalletOpen(false)}
            />

            <WithdrawModal
                open={withdrawOpen}
                onClose={() => setWithdrawOpen(false)}
            />
        </>
    );
}