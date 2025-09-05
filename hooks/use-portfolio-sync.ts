// hooks/use-portfolio-sync.ts
import { useState, useEffect, useCallback } from "react";
import { supabase, type Database } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

type Holdings = Database["public"]["Tables"]["holdings"]["Row"];
type Portfolios = Database["public"]["Tables"]["portfolios"]["Row"];
type Transactions = Database["public"]["Tables"]["transactions"]["Row"];
type PriceAlerts = Database["public"]["Tables"]["price_alerts"]["Row"];
type UserSettings = Database["public"]["Tables"]["user_settings"]["Row"];

export interface SyncedHolding {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  averagePrice: number;
  purchaseDate: Date;
  notes?: string;
  lastSynced: Date;
}

export interface SyncedTransaction {
  id: string;
  type: "buy" | "sell";
  symbol: string;
  amount: number;
  price: number;
  fees: number;
  exchange?: string;
  transactionDate: Date;
  notes?: string;
}

export interface SyncedAlert {
  id: string;
  symbol: string;
  name: string;
  type: "above" | "below";
  targetPrice: number;
  status: "active" | "triggered" | "dismissed";
  createdAt: Date;
  triggeredAt?: Date;
}

export interface PortfolioSyncState {
  user: User | null;
  session: Session | null;
  holdings: SyncedHolding[];
  transactions: SyncedTransaction[];
  alerts: SyncedAlert[];
  settings: UserSettings | null;
  portfolios: Portfolios[];
  currentPortfolio: Portfolios | null;
  isLoading: boolean;
  isSyncing: boolean;
  isOnline: boolean;
  lastSync: Date | null;
  syncQueue: any[];
}

export function usePortfolioSync() {
  const [state, setState] = useState<PortfolioSyncState>({
    user: null,
    session: null,
    holdings: [],
    transactions: [],
    alerts: [],
    settings: null,
    portfolios: [],
    currentPortfolio: null,
    isLoading: true,
    isSyncing: false,
    isOnline: navigator.onLine,
    lastSync: null,
    syncQueue: [],
  });

  // Detectar estado de conexión
  useEffect(() => {
    const handleOnline = () =>
      setState((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setState((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Configurar autenticación
  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
      }));
    });

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
      }));

      if (event === "SIGNED_IN" && session?.user) {
        await loadUserData(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setState((prev) => ({
          ...prev,
          holdings: [],
          transactions: [],
          alerts: [],
          settings: null,
          portfolios: [],
          currentPortfolio: null,
        }));
        loadLocalData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Cargar datos cuando cambia el usuario o el estado online
  useEffect(() => {
    if (state.user && state.isOnline) {
      loadUserData(state.user.id);
    } else if (!state.user) {
      loadLocalData();
    }
    setState((prev) => ({ ...prev, isLoading: false }));
  }, [state.user, state.isOnline]);

  // Procesar cola de sincronización cuando vuelve la conexión
  useEffect(() => {
    if (state.isOnline && state.user && state.syncQueue.length > 0) {
      processSyncQueue();
    }
  }, [state.isOnline, state.user]);

  const loadUserData = async (userId: string) => {
    try {
      setState((prev) => ({ ...prev, isSyncing: true }));

      // Cargar portfolios del usuario
      const { data: portfolios, error: portfoliosError } = await supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", userId)
        .order("created_at");

      if (portfoliosError) throw portfoliosError;

      const defaultPortfolio =
        portfolios?.find((p) => p.is_default) || portfolios?.[0];

      if (defaultPortfolio) {
        // Cargar holdings del portfolio por defecto
        const { data: holdingsData, error: holdingsError } = await supabase
          .from("holdings")
          .select("*")
          .eq("portfolio_id", defaultPortfolio.id);

        if (holdingsError) throw holdingsError;

        // Cargar transacciones
        const { data: transactionsData, error: transactionsError } =
          await supabase
            .from("transactions")
            .select("*")
            .eq("portfolio_id", defaultPortfolio.id)
            .order("transaction_date", { ascending: false });

        if (transactionsError) throw transactionsError;

        // Cargar alertas
        const { data: alertsData, error: alertsError } = await supabase
          .from("price_alerts")
          .select("*")
          .eq("user_id", userId);

        if (alertsError) throw alertsError;

        // Cargar configuraciones
        const { data: settingsData, error: settingsError } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (settingsError && settingsError.code !== "PGRST116")
          throw settingsError;

        // Mapear datos
        const holdings: SyncedHolding[] =
          holdingsData?.map((h) => ({
            id: h.id,
            symbol: h.symbol,
            name: h.name,
            amount: parseFloat(h.amount),
            averagePrice: parseFloat(h.average_price),
            purchaseDate: new Date(h.purchase_date),
            notes: h.notes || undefined,
            lastSynced: new Date(),
          })) || [];

        const transactions: SyncedTransaction[] =
          transactionsData?.map((t) => ({
            id: t.id,
            type: t.type,
            symbol: t.symbol,
            amount: parseFloat(t.amount),
            price: parseFloat(t.price),
            fees: parseFloat(t.fees),
            exchange: t.exchange || undefined,
            transactionDate: new Date(t.transaction_date),
            notes: t.notes || undefined,
          })) || [];

        const alerts: SyncedAlert[] =
          alertsData?.map((a) => ({
            id: a.id,
            symbol: a.symbol,
            name: a.name,
            type: a.type,
            targetPrice: parseFloat(a.target_price),
            status: a.status,
            createdAt: new Date(a.created_at),
            triggeredAt: a.triggered_at ? new Date(a.triggered_at) : undefined,
          })) || [];

        setState((prev) => ({
          ...prev,
          holdings,
          transactions,
          alerts,
          settings: settingsData,
          portfolios: portfolios || [],
          currentPortfolio: defaultPortfolio,
          lastSync: new Date(),
        }));

        // Guardar backup local
        saveLocalBackup({ holdings, transactions, alerts });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      loadLocalData(); // Fallback a datos locales
    } finally {
      setState((prev) => ({ ...prev, isSyncing: false }));
    }
  };

  const loadLocalData = () => {
    try {
      const backup = localStorage.getItem("memento-portfolio-backup");
      if (backup) {
        const parsed = JSON.parse(backup);
        setState((prev) => ({
          ...prev,
          holdings:
            parsed.holdings?.map((h: any) => ({
              ...h,
              purchaseDate: new Date(h.purchaseDate),
              lastSynced: new Date(h.lastSynced),
            })) || [],
          transactions:
            parsed.transactions?.map((t: any) => ({
              ...t,
              transactionDate: new Date(t.transactionDate),
            })) || [],
          alerts:
            parsed.alerts?.map((a: any) => ({
              ...a,
              createdAt: new Date(a.createdAt),
              triggeredAt: a.triggeredAt ? new Date(a.triggeredAt) : undefined,
            })) || [],
        }));
      }
    } catch (error) {
      console.error("Error loading local data:", error);
    }
  };

  const saveLocalBackup = (data: any) => {
    try {
      localStorage.setItem("memento-portfolio-backup", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving local backup:", error);
    }
  };

  const addToSyncQueue = (action: string, data: any) => {
    setState((prev) => ({
      ...prev,
      syncQueue: [...prev.syncQueue, { action, data, timestamp: new Date() }],
    }));
    // Guardar cola en localStorage
    try {
      const queue = [
        ...state.syncQueue,
        { action, data, timestamp: new Date() },
      ];
      localStorage.setItem("memento-sync-queue", JSON.stringify(queue));
    } catch (error) {
      console.error("Error saving sync queue:", error);
    }
  };

  const processSyncQueue = async () => {
    if (!state.user || !state.isOnline || state.syncQueue.length === 0) return;

    try {
      setState((prev) => ({ ...prev, isSyncing: true }));

      for (const item of state.syncQueue) {
        switch (item.action) {
          case "add_holding":
            await addHoldingToServer(item.data);
            break;
          case "update_holding":
            await updateHoldingOnServer(item.data.id, item.data.updates);
            break;
          case "delete_holding":
            await deleteHoldingFromServer(item.data.id);
            break;
          case "add_transaction":
            await addTransactionToServer(item.data);
            break;
          case "add_alert":
            await addAlertToServer(item.data);
            break;
          // Agregar más acciones según sea necesario
        }
      }

      setState((prev) => ({
        ...prev,
        syncQueue: [],
        lastSync: new Date(),
      }));

      localStorage.removeItem("memento-sync-queue");
    } catch (error) {
      console.error("Error processing sync queue:", error);
    } finally {
      setState((prev) => ({ ...prev, isSyncing: false }));
    }
  };

  const addHolding = async (
    holding: Omit<SyncedHolding, "id" | "lastSynced">
  ) => {
    const newHolding: SyncedHolding = {
      ...holding,
      id: crypto.randomUUID(),
      lastSynced: new Date(),
    };

    // Agregar localmente primero
    setState((prev) => ({
      ...prev,
      holdings: [...prev.holdings, newHolding],
    }));

    // Sincronizar con servidor si está disponible
    if (state.user && state.isOnline && state.currentPortfolio) {
      try {
        await addHoldingToServer(newHolding);
        setState((prev) => ({ ...prev, lastSync: new Date() }));
      } catch (error) {
        console.error("Error syncing holding:", error);
        addToSyncQueue("add_holding", newHolding);
      }
    } else {
      addToSyncQueue("add_holding", newHolding);
    }
  };

  const addHoldingToServer = async (holding: SyncedHolding) => {
    if (!state.currentPortfolio) throw new Error("No portfolio selected");

    const { error } = await supabase.from("holdings").insert({
      portfolio_id: state.currentPortfolio.id,
      symbol: holding.symbol,
      name: holding.name,
      amount: holding.amount.toString(),
      average_price: holding.averagePrice.toString(),
      purchase_date: holding.purchaseDate.toISOString(),
      notes: holding.notes,
    });

    if (error) throw error;
  };

  const updateHolding = async (id: string, updates: Partial<SyncedHolding>) => {
    // Actualizar localmente primero
    setState((prev) => ({
      ...prev,
      holdings: prev.holdings.map((h) =>
        h.id === id ? { ...h, ...updates, lastSynced: new Date() } : h
      ),
    }));

    // Sincronizar con servidor
    if (state.user && state.isOnline) {
      try {
        await updateHoldingOnServer(id, updates);
        setState((prev) => ({ ...prev, lastSync: new Date() }));
      } catch (error) {
        console.error("Error syncing holding update:", error);
        addToSyncQueue("update_holding", { id, updates });
      }
    } else {
      addToSyncQueue("update_holding", { id, updates });
    }
  };

  const updateHoldingOnServer = async (
    id: string,
    updates: Partial<SyncedHolding>
  ) => {
    const dbUpdates: any = {};
    if (updates.symbol) dbUpdates.symbol = updates.symbol;
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.amount !== undefined)
      dbUpdates.amount = updates.amount.toString();
    if (updates.averagePrice !== undefined)
      dbUpdates.average_price = updates.averagePrice.toString();
    if (updates.purchaseDate)
      dbUpdates.purchase_date = updates.purchaseDate.toISOString();
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    const { error } = await supabase
      .from("holdings")
      .update(dbUpdates)
      .eq("id", id);

    if (error) throw error;
  };

  const deleteHolding = async (id: string) => {
    // Eliminar localmente primero
    setState((prev) => ({
      ...prev,
      holdings: prev.holdings.filter((h) => h.id !== id),
    }));

    // Sincronizar con servidor
    if (state.user && state.isOnline) {
      try {
        await deleteHoldingFromServer(id);
        setState((prev) => ({ ...prev, lastSync: new Date() }));
      } catch (error) {
        console.error("Error syncing holding deletion:", error);
        addToSyncQueue("delete_holding", { id });
      }
    } else {
      addToSyncQueue("delete_holding", { id });
    }
  };

  const deleteHoldingFromServer = async (id: string) => {
    const { error } = await supabase.from("holdings").delete().eq("id", id);

    if (error) throw error;
  };

  const addTransaction = async (transaction: Omit<SyncedTransaction, "id">) => {
    const newTransaction: SyncedTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };

    // Agregar localmente primero
    setState((prev) => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions],
    }));

    // Sincronizar con servidor
    if (state.user && state.isOnline && state.currentPortfolio) {
      try {
        await addTransactionToServer(newTransaction);
        setState((prev) => ({ ...prev, lastSync: new Date() }));
      } catch (error) {
        console.error("Error syncing transaction:", error);
        addToSyncQueue("add_transaction", newTransaction);
      }
    } else {
      addToSyncQueue("add_transaction", newTransaction);
    }
  };

  const addTransactionToServer = async (transaction: SyncedTransaction) => {
    if (!state.currentPortfolio) throw new Error("No portfolio selected");

    const { error } = await supabase.from("transactions").insert({
      portfolio_id: state.currentPortfolio.id,
      type: transaction.type,
      symbol: transaction.symbol,
      amount: transaction.amount.toString(),
      price: transaction.price.toString(),
      fees: transaction.fees.toString(),
      exchange: transaction.exchange,
      transaction_date: transaction.transactionDate.toISOString(),
      notes: transaction.notes,
    });

    if (error) throw error;
  };

  const addAlert = async (alert: Omit<SyncedAlert, "id" | "createdAt">) => {
    const newAlert: SyncedAlert = {
      ...alert,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    // Agregar localmente primero
    setState((prev) => ({
      ...prev,
      alerts: [...prev.alerts, newAlert],
    }));

    // Sincronizar con servidor
    if (state.user && state.isOnline) {
      try {
        await addAlertToServer(newAlert);
        setState((prev) => ({ ...prev, lastSync: new Date() }));
      } catch (error) {
        console.error("Error syncing alert:", error);
        addToSyncQueue("add_alert", newAlert);
      }
    } else {
      addToSyncQueue("add_alert", newAlert);
    }
  };

  const addAlertToServer = async (alert: SyncedAlert) => {
    if (!state.user) throw new Error("User not authenticated");

    const { error } = await supabase.from("price_alerts").insert({
      user_id: state.user.id,
      symbol: alert.symbol,
      name: alert.name,
      type: alert.type,
      target_price: alert.targetPrice.toString(),
      status: alert.status,
    });

    if (error) throw error;
  };

  const updateAlert = async (id: string, updates: Partial<SyncedAlert>) => {
    // Actualizar localmente primero
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));

    // Sincronizar con servidor
    if (state.user && state.isOnline) {
      try {
        const dbUpdates: any = {};
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.triggeredAt)
          dbUpdates.triggered_at = updates.triggeredAt.toISOString();

        const { error } = await supabase
          .from("price_alerts")
          .update(dbUpdates)
          .eq("id", id);

        if (error) throw error;
        setState((prev) => ({ ...prev, lastSync: new Date() }));
      } catch (error) {
        console.error("Error syncing alert update:", error);
        addToSyncQueue("update_alert", { id, updates });
      }
    } else {
      addToSyncQueue("update_alert", { id, updates });
    }
  };

  // Funciones de autenticación
  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split("@")[0],
        },
      },
    });

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  // Funciones de utilidad
  const exportData = () => {
    const exportData = {
      holdings: state.holdings,
      transactions: state.transactions,
      alerts: state.alerts,
      exportDate: new Date().toISOString(),
      version: "2.0",
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `memento-portfolio-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const importData = async (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);

          // Validar estructura de datos
          if (!imported.holdings || !Array.isArray(imported.holdings)) {
            throw new Error("Invalid import format");
          }

          // Procesar holdings importados
          for (const holding of imported.holdings) {
            await addHolding({
              symbol: holding.symbol,
              name: holding.name,
              amount: holding.amount,
              averagePrice: holding.averagePrice,
              purchaseDate: new Date(holding.purchaseDate),
              notes: holding.notes,
            });
          }

          // Procesar transacciones si existen
          if (imported.transactions && Array.isArray(imported.transactions)) {
            for (const transaction of imported.transactions) {
              await addTransaction({
                type: transaction.type,
                symbol: transaction.symbol,
                amount: transaction.amount,
                price: transaction.price,
                fees: transaction.fees || 0,
                exchange: transaction.exchange,
                transactionDate: new Date(transaction.transactionDate),
                notes: transaction.notes,
              });
            }
          }

          // Procesar alertas si existen
          if (imported.alerts && Array.isArray(imported.alerts)) {
            for (const alert of imported.alerts) {
              await addAlert({
                symbol: alert.symbol,
                name: alert.name,
                type: alert.type,
                targetPrice: alert.targetPrice,
                status: alert.status,
              });
            }
          }

          resolve(true);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  const getTotalPortfolioValue = useCallback(
    (currentPrices: Record<string, number>) => {
      return state.holdings.reduce((total, holding) => {
        const currentPrice =
          currentPrices[holding.symbol] || holding.averagePrice;
        return total + holding.amount * currentPrice;
      }, 0);
    },
    [state.holdings]
  );

  const getPortfolioPerformance = useCallback(
    (currentPrices: Record<string, number>) => {
      const totalInvested = state.holdings.reduce((total, holding) => {
        return total + holding.amount * holding.averagePrice;
      }, 0);

      const currentValue = getTotalPortfolioValue(currentPrices);
      const totalGainLoss = currentValue - totalInvested;
      const totalGainLossPercentage =
        totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

      return {
        totalInvested,
        currentValue,
        totalGainLoss,
        totalGainLossPercentage,
      };
    },
    [state.holdings, getTotalPortfolioValue]
  );

  return {
    // Estado
    ...state,

    // Funciones de holdings
    addHolding,
    updateHolding,
    deleteHolding,

    // Funciones de transacciones
    addTransaction,

    // Funciones de alertas
    addAlert,
    updateAlert,

    // Funciones de autenticación
    signUp,
    signIn,
    signOut,
    resetPassword,

    // Funciones de utilidad
    exportData,
    importData,
    getTotalPortfolioValue,
    getPortfolioPerformance,
    processSyncQueue,
  };
}
