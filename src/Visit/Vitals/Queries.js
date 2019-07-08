export const getVitalsQuery = 
`
unwind $search as search
match (v:visit {uuid: search.visituuid})-[:measured]->(vi:vitals)
with vi order by keys(vi) asc
with 
apoc.map.fromValues ([
'00_Temperature_(C)', vi.temperature_celsius,
'01_Pulse_(Bpm)', vi.pulse_bpm,
'02_Respiratory_Rate_(bpm)', vi.respiratory_rate_bpm,
'03_BP_(Systolic)', [vi.s_blood_pressure_high, '/', vi.s_blood_pressure_low],
'04_BP_(Diastolic)', [vi.d_blood_pressure_high, '/',vi.d_blood_pressure_low],
'05_SpO2_(%)', vi.SpO2,
'06_Weight_(Kg)', vi.weight_kg,
'07_Height_(cm)', vi.height_cm,
'08_Head_Circum_(cm)', vi.head_circ_cm,
'09_BMI', vi.bmi]) as map
return apoc.map.sortedProperties(map)
`