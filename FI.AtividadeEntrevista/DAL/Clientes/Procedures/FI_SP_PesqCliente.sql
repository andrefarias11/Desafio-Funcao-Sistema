CREATE OR ALTER PROC FI_SP_PesqCliente
    @iniciarEm INT,
    @quantidade INT,
    @campoOrdenacao VARCHAR(200),
    @crescente BIT
AS
BEGIN
    DECLARE @SQL NVARCHAR(MAX);
    DECLARE @ORDER VARCHAR(50);

    IF (@campoOrdenacao = 'EMAIL')
        SET @ORDER = 'EMAIL';
    ELSE
        SET @ORDER = 'NOME';

    IF (@crescente = 0)
        SET @ORDER = @ORDER + ' DESC';
    ELSE
        SET @ORDER = @ORDER + ' ASC';

    SET @SQL = N'
    SELECT ID, NOME, SOBRENOME, NACIONALIDADE, CEP, ESTADO, CIDADE, LOGRADOURO, EMAIL, TELEFONE, CPF
    FROM (
        SELECT ROW_NUMBER() OVER (ORDER BY ' + @ORDER + ') AS Row, 
               ID, NOME, SOBRENOME, NACIONALIDADE, CEP, ESTADO, CIDADE, LOGRADOURO, EMAIL, TELEFONE, CPF
        FROM CLIENTES WITH(NOLOCK)
    ) AS ClientesWithRowNumbers
    WHERE Row > @iniciarEm AND Row <= (@iniciarEm + @quantidade)';

    EXEC sp_executesql @SQL, 
        N'@iniciarEm INT, @quantidade INT', 
        @iniciarEm = @iniciarEm, 
        @quantidade = @quantidade;

    -- Essa parte fica como está, para retornar o total de registros:
    SELECT * FROM CLIENTES WITH(NOLOCK);
END