export const lastPatientsQuery =
`
unwind $search as search  
match (p:patient)-[:attended]->(v:visit)
return {patient: p, visit: v} order by v.date desc limit 50
`