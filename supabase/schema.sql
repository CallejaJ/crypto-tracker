-- Schema completo para Memento Crypto Tracker

-- 1. Tabla de perfiles de usuario (extiende auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255),
  display_name VARCHAR(100),
  avatar_url TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Tabla de portfolios
CREATE TABLE public.portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) DEFAULT 'Main Portfolio',
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Tabla de holdings
CREATE TABLE public.holdings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  name VARCHAR(100) NOT NULL,
  amount DECIMAL(18, 8) NOT NULL CHECK (amount > 0),
  average_price DECIMAL(18, 2) NOT NULL CHECK (average_price > 0),
  purchase_date TIMESTAMP NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Tabla de transacciones
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  type VARCHAR(10) CHECK (type IN ('buy', 'sell')) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  amount DECIMAL(18, 8) NOT NULL CHECK (amount > 0),
  price DECIMAL(18, 2) NOT NULL CHECK (price > 0),
  fees DECIMAL(18, 2) DEFAULT 0 CHECK (fees >= 0),
  exchange VARCHAR(50),
  transaction_date TIMESTAMP NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Tabla de alertas de precios
CREATE TABLE public.price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(10) CHECK (type IN ('above', 'below')) NOT NULL,
  target_price DECIMAL(18, 2) NOT NULL CHECK (target_price > 0),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'triggered', 'dismissed')),
  created_at TIMESTAMP DEFAULT NOW(),
  triggered_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Tabla de configuraciones de usuario
CREATE TABLE public.user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme VARCHAR(10) DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  default_currency VARCHAR(3) DEFAULT 'USD',
  price_change_notifications BOOLEAN DEFAULT true,
  alert_notifications BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT false,
  sound_notifications BOOLEAN DEFAULT true,
  auto_refresh_interval INTEGER DEFAULT 30 CHECK (auto_refresh_interval >= 10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Tabla de historial de precios (opcional, para gráficos históricos)
CREATE TABLE public.price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol VARCHAR(10) NOT NULL,
  price DECIMAL(18, 2) NOT NULL,
  market_cap BIGINT,
  volume_24h BIGINT,
  change_24h DECIMAL(5, 2),
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- ÍNDICES para mejorar performance
CREATE INDEX idx_holdings_portfolio_id ON public.holdings(portfolio_id);
CREATE INDEX idx_holdings_symbol ON public.holdings(symbol);
CREATE INDEX idx_transactions_portfolio_id ON public.transactions(portfolio_id);
CREATE INDEX idx_transactions_symbol ON public.transactions(symbol);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX idx_price_alerts_user_id ON public.price_alerts(user_id);
CREATE INDEX idx_price_alerts_status ON public.price_alerts(status);
CREATE INDEX idx_price_history_symbol_date ON public.price_history(symbol, recorded_at);

-- TRIGGERS para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_holdings_updated_at BEFORE UPDATE ON public.holdings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_price_alerts_updated_at BEFORE UPDATE ON public.price_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- POLÍTICAS DE SEGURIDAD (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para portfolios
CREATE POLICY "Users can view own portfolios" ON public.portfolios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own portfolios" ON public.portfolios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own portfolios" ON public.portfolios FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own portfolios" ON public.portfolios FOR DELETE USING (auth.uid() = user_id);

-- Políticas para holdings
CREATE POLICY "Users can view own holdings" ON public.holdings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.portfolios WHERE portfolios.id = holdings.portfolio_id AND portfolios.user_id = auth.uid())
);
CREATE POLICY "Users can create own holdings" ON public.holdings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.portfolios WHERE portfolios.id = holdings.portfolio_id AND portfolios.user_id = auth.uid())
);
CREATE POLICY "Users can update own holdings" ON public.holdings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.portfolios WHERE portfolios.id = holdings.portfolio_id AND portfolios.user_id = auth.uid())
);
CREATE POLICY "Users can delete own holdings" ON public.holdings FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.portfolios WHERE portfolios.id = holdings.portfolio_id AND portfolios.user_id = auth.uid())
);

-- Políticas para transacciones
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.portfolios WHERE portfolios.id = transactions.portfolio_id AND portfolios.user_id = auth.uid())
);
CREATE POLICY "Users can create own transactions" ON public.transactions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.portfolios WHERE portfolios.id = transactions.portfolio_id AND portfolios.user_id = auth.uid())
);

-- Políticas para alertas
CREATE POLICY "Users can view own alerts" ON public.price_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own alerts" ON public.price_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON public.price_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON public.price_alerts FOR DELETE USING (auth.uid() = user_id);

-- Políticas para configuraciones
CREATE POLICY "Users can view own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

-- FUNCIÓN para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);
  
  INSERT INTO public.portfolios (user_id, name, is_default)
  VALUES (new.id, 'Main Portfolio', true);
  
  RETURN new;
END;
$$ language plpgsql security definer;

-- TRIGGER para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- DATOS DE EJEMPLO (opcional)
-- Insertar algunos datos de ejemplo para testing
-- INSERT INTO public.price_history (symbol, price, market_cap, volume_24h, change_24h) VALUES
-- ('BTC', 45000.00, 870000000000, 25000000000, 2.5),
-- ('ETH', 2800.00, 340000000000, 15000000000, 1.8),
-- ('SOL', 120.00, 52000000000, 2500000000, -0.5);