import { useState, useEffect, useCallback, useMemo } from "react";
import { transactionAlertsDB } from "@/lib/transaction-alerts";
import { ProcessedTransaction } from "@/lib/types";

export const useTransactionAlerts = (transactions: ProcessedTransaction[]) => {
  const [unseenTransactionIds, setUnseenTransactionIds] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);

  // Check which transactions are unseen
  const checkUnseenTransactions = useCallback(async () => {
    if (!transactions?.length) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const unseenIds = new Set<string>();

      // Check each transaction against IndexedDB
      await Promise.all(
        transactions.map(async (transaction) => {
          const isSeen = await transactionAlertsDB.isTransactionSeen(
            transaction.id
          );
          if (!isSeen) {
            unseenIds.add(transaction.id);
          }
        })
      );

      setUnseenTransactionIds(unseenIds);
    } catch (error) {
      console.error("Error checking unseen transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [transactions]);

  // Mark a single transaction as seen
  const markTransactionAsSeen = useCallback(
    async (transaction: ProcessedTransaction) => {
      try {
        await transactionAlertsDB.markTransactionAsSeen(
          transaction.id,
          transaction.hash,
          transaction.chainId.toString()
        );

        setUnseenTransactionIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(transaction.id);
          return newSet;
        });
      } catch (error) {
        console.error("Error marking transaction as seen:", error);
      }
    },
    []
  );

  // Mark all transactions as seen
  const markAllAsSeen = useCallback(async () => {
    if (!transactions?.length) return;

    try {
      const transactionsToMark = transactions.map((tx) => ({
        id: tx.id,
        hash: tx.hash,
        chainId: tx.chainId.toString(),
      }));

      await transactionAlertsDB.markMultipleAsSeen(transactionsToMark);
      setUnseenTransactionIds(new Set());
    } catch (error) {
      console.error("Error marking all transactions as seen:", error);
    }
  }, [transactions]);

  // Check if a specific transaction is unseen
  const isTransactionUnseen = useCallback(
    (transactionId: string) => {
      return unseenTransactionIds.has(transactionId);
    },
    [unseenTransactionIds]
  );

  // Get count of unseen transactions
  const unseenCount = unseenTransactionIds.size;

  // Initial check when transactions change
  useEffect(() => {
    checkUnseenTransactions();
  }, [checkUnseenTransactions]);

  const transactionIds = useMemo(
    () => transactions?.map((tx) => tx.id).join(",") || "",
    [transactions]
  );

  useEffect(() => {
    checkUnseenTransactions();
  }, [transactionIds, checkUnseenTransactions]);

  return {
    unseenTransactionIds,
    unseenCount,
    isLoading,
    isTransactionUnseen,
    markTransactionAsSeen,
    markAllAsSeen,
    refreshUnseenStatus: checkUnseenTransactions,
  };
};
