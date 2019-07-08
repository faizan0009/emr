import {today} from '../Utils/functions';

export const DeleteDiagnostic = (props) => {
    console.log(props)
    let isSubscribed = true
    const query =
        `
        unwind $search as search 
        match (v:visit {uuid: search.visituuid})-[d:diagnosed]->(c:condition) where ID(d)=toInt(search.diagnose)
        optional match (c)<-[:treats]-(t:treatment)
        detach delete t, d
        `
    const neo4j_driver = props.neo4j
    const session = neo4j_driver.session()
    const objb = {search:{visituuid: props.delete.visit.properties.uuid, diagnose: props.delete.diagnose.identity}}
    const parameters = objb
    if (isSubscribed) {
    session 
    .run(query, parameters)
    .catch(function (error)
    {console.log(error); 
    session.close();}); 
    }
    return () => isSubscribed = false 
}

export const EditDiagnostic = (props, options) => {
    let isSubscribed = true
    const query =
        `
        unwind $search as search 
        match (v:visit {uuid: search.visituuid})-[d:diagnosed]->(c:condition) where ID(d)=toInt(search.diagnose)
        set 
        d.status=search.status, 
        d.certainty=search.certainty,   
        d.description= search.description
        `
    const neo4j_driver = props.neo4j
    const session = neo4j_driver.session()
    const objb = {search:{
        visituuid: props.edit.visit.properties.uuid, 
        diagnose: props.edit.diagnose.identity,
        status: options.status,
        certainty: options.certainty,
        description: options.description
    }}
    const parameters = objb
    if (isSubscribed) {
    session 
    .run(query, parameters)
    .catch(function (error)
    {console.log(error); 
    session.close();});  
    }
return () => isSubscribed = false 
}

export const AddDiagnostic = (props, options, condition) => {
    let isSubscribed = true
    const query =
        `
        unwind $search as search 
        match (v:visit {uuid: search.visituuid}), (c:condition {meddra_code: search.condition})
        merge (v)-[d:diagnosed]->(c)
        set 
        d.status=search.status, 
        d.certainty=search.certainty,   
        d.description=search.description,
        d.date=search.today
        `
    const neo4j_driver = props.neo4j
    const session = neo4j_driver.session()
    const objb = {search:{
        visituuid: props.visit, 
        status: options.status,
        certainty: options.certainty,
        description: options.description,
        condition: condition.meddra_code,
        today: today
    }}
    const parameters = objb
    if (isSubscribed) {
    session 
    .run(query, parameters)
    .catch(function (error)
    {console.log(error); 
    session.close();});  
    }
    return () => isSubscribed = false 
}

export const editconditionQuery = 
`
unwind $search as search 
match (v:visit {uuid: search.visituuid})-[d:diagnosed]->(c:condition) 
return {diagnose: d, condition: c, visit: v}
`

export const editvisitQuery = 
`
unwind $search as search 
match (v:visit {uuid: search.visituuid})<-[:attended]-(p:patient)
return v, p
`

export const searchconditionQuery =
`
unwind $search as search 
with '(?i)'+search.condition+'.*' as searchterm
match (c:condition) where c.pt_name =~ searchterm
return {label: c.pt_name, id: ID(c), meddra_code: c.meddra_code, soc_name: c.soc_name, comment: c.comment} limit 3
`

export const getvisitinfoQuery = 

`
unwind $search as search 
match (v:visit {uuid: search.visituuid})
return v
`

export const EditDateQuery = (props, hits) => {
    let isSubscribed = true
    const query =
        `
        unwind $search as search 
        match (v:visit {uuid: search.visituuid})
        set v.date=search.newdate
        `
    const neo4j_driver = props.neo4j
    const session = neo4j_driver.session()
    const objb = {search:{
        visituuid: props.visit, 
        newdate: hits.date
    }}
    const parameters = objb
    if (isSubscribed) {
        session 
    .run(query, parameters)
    .catch(function (error)
    {console.log(error); 
    session.close();});  }
    return () => isSubscribed = false 
}

export const gettreatmentsQuery = 
`
unwind $search as search 
match (v:visit {uuid: search.visituuid})-[:prescribed]->(t:treatment)
optional match (t)-[:treats]->(c:condition)
return {treatment: t, condition: c}
`

export const searchdrugQuery =
`
unwind $search as search 
match (d:drug) where d.drug_name contains search.drug
return  d
limit 5
`

export const searchConditions = 
`
unwind $search as search 
match (v:visit {uuid: search.visituuid})-[:diagnosed]->(c:condition)
return c
`

export const AddTreatment = (props, drugtreatmentoptions, condition, drugtreatment, othertreatmentoptions) => {

    let isSubscribed = true
    const add_drug_query =
        `
        unwind $search as search 
        match (v:visit {uuid: search.visituuid})
        match (c:condition {meddra_code: search.condition})
        merge (v)-[:prescribed]->(t:treatment {drug_name: search.drug.drug_name})
        merge (t)-[:treats]->(c)
        set t=search.drugoptions, t.drug_name=search.drug.drug_name, t.form=search.drug.doseage_form, t.route=search.drug.route
        `
    const add_treatment_query =
        `
        unwind $search as search 
        match (v:visit {uuid: search.visituuid})
        match (c:condition {meddra_code: search.condition})
        merge (v)-[:prescribed]->(t:treatment {other_treatment: search.othertreatment.other_treatment})
        merge (t)-[:treats]->(c)
        set t=search.othertreatment
        `
    const neo4j_driver = props.neo4j
    const session = neo4j_driver.session()
    const objb = {search:{
        visituuid: props.visit,
        condition:  condition,
        drug: drugtreatment,
        drugoptions: drugtreatmentoptions,
        othertreatment: othertreatmentoptions         
    }}
    const parameters = objb
    if (isSubscribed) {
        session 
       .run((drugtreatment ? add_drug_query : add_treatment_query), parameters)
    .catch(function (error)
    {console.log(error); 
    session.close();});  }
    return () => isSubscribed = false 
}

export const DeleteTreatment = (props) => {
    let isSubscribed = true
    const query =
        `
        unwind $search as search 
        match (v:visit {uuid: search.visituuid})-[:prescribed]->(t:treatment) where ID(t)=toInt(search.treatment)
        detach delete t
        `
    const neo4j_driver = props.neo4j
    const session = neo4j_driver.session()
    const objb = {search:{visituuid: props.visit, treatment: props.delete.treatment.identity}}
    const parameters = objb
    if (isSubscribed) {
    session 
    .run(query, parameters)
    .catch(function (error)
    {console.log(error); 
    session.close();}); 
    }
    return () => isSubscribed = false 
}




