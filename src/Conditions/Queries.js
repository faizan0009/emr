export const searchconditionsQuery = 
`
unwind $search as search 
match (c:condition) where c.meddra_code=search.conditionmeddracode
return c
`