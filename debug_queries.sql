-- Verificar se existem propostas no banco
SELECT * FROM propostas;

-- Verificar se existem empresas
SELECT id, nome FROM empresas;

-- Verificar se existem resíduos
SELECT id, descricao, empresaId FROM residuos;
