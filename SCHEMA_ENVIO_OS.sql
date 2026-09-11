-- ============================================================
-- Campos de envio nas Ordens de Serviço
-- Rode no SQL Editor do Supabase (https://supabase.w3controle.com.br)
-- ============================================================

ALTER TABLE public.ordens_servico
  ADD COLUMN IF NOT EXISTS numero_rastreio TEXT,
  ADD COLUMN IF NOT EXISTS valor_frete NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS data_envio DATE,
  ADD COLUMN IF NOT EXISTS status_envio TEXT;

CREATE INDEX IF NOT EXISTS idx_ordens_servico_numero_rastreio
  ON public.ordens_servico(numero_rastreio);
