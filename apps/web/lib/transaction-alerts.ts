interface SeenTransaction {
  id: string;
  hash: string;
  chainId: string;
  seenAt: string;
}

class TransactionAlertsDB {
  private dbName = "1nbox-transaction-alerts";
  private version = 1;
  private storeName = "seen-transactions";

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: "id" });
          store.createIndex("hash", "hash", { unique: false });
          store.createIndex("chainId", "chainId", { unique: false });
        }
      };
    });
  }

  async markTransactionAsSeen(
    transactionId: string,
    hash: string,
    chainId: string
  ): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction([this.storeName], "readwrite");
    const store = transaction.objectStore(this.storeName);

    const seenTransaction: SeenTransaction = {
      id: transactionId,
      hash,
      chainId,
      seenAt: new Date().toISOString(),
    };

    await store.put(seenTransaction);
  }

  async markMultipleAsSeen(
    transactions: Array<{ id: string; hash: string; chainId: string }>
  ): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction([this.storeName], "readwrite");
    const store = transaction.objectStore(this.storeName);

    const promises = transactions.map((tx) => {
      const seenTransaction: SeenTransaction = {
        id: tx.id,
        hash: tx.hash,
        chainId: tx.chainId,
        seenAt: new Date().toISOString(),
      };
      return store.put(seenTransaction);
    });

    await Promise.all(promises);
  }

  async isTransactionSeen(transactionId: string): Promise<boolean> {
    const db = await this.openDB();
    const transaction = db.transaction([this.storeName], "readonly");
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(transactionId);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(!!request.result);
    });
  }

  async getSeenTransactions(): Promise<SeenTransaction[]> {
    const db = await this.openDB();
    const transaction = db.transaction([this.storeName], "readonly");
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async clearAllSeen(): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction([this.storeName], "readwrite");
    const store = transaction.objectStore(this.storeName);
    await store.clear();
  }
}

export const transactionAlertsDB = new TransactionAlertsDB();
