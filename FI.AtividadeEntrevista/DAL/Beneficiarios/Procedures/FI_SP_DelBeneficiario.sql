﻿CREATE OR ALTER PROC FI_SP_DelBeneficiario  
    @ID          BIGINT
AS  
BEGIN  
	SET NOCOUNT ON;
	DELETE FROM BENEFICIARIOS WHERE Id = @ID  
END