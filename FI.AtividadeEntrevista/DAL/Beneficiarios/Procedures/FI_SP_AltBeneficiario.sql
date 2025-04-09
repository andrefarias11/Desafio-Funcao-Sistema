CREATE OR ALTER PROC FI_SP_AltBeneficiario    
    @ID          BIGINT,    
    @CPF         VARCHAR(14),    
    @NOME        VARCHAR(50),    
    @IDCLIENTE   BIGINT    
AS    
BEGIN
    SET NOCOUNT ON;

    UPDATE BENEFICIARIOS
    SET 
        CPF = @CPF,
        NOME = @NOME,
        IDCLIENTE = @IDCLIENTE
    WHERE ID = @ID
END