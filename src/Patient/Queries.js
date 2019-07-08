export const updatepatientQuery = (props, hits) => {
    const query =
        `
        unwind $search as search  
        match (p:patient {uuid: search.patientuuid})
        with search.updateddata as patientupdateddata, p
        set p=patientupdateddata
        return p
        `
        let isSubscribed = true 
        const neo4j_driver = props.neo4j
        const session = neo4j_driver.session()
        const objb = {search:{
            patientuuid: hits.uuid, 
            updateddata: hits
        }}
        const parameters = objb
        session 
        .run(query, parameters)
        .then(recs => {
            if (isSubscribed) {
            const response = {recs}
            console.log(response)
            }
        })
        .catch(function (error)
        {console.log(error); 
        session.close();});  
    return () => isSubscribed = false
}

export const getpatientinfoQuery = 
`
unwind $search as search 
match (p:patient {uuid: search.patientuuid})
return p
`

export const getmedicalhistoryQuery =
`
unwind $search as search 
match (p:patient {uuid: search.patientuuid})-[:attended]->(:visit)-[d:diagnosed {status: 'active'}]->(c:condition)
return c order by d.date desc limit 10
`

export const gettreatmentsQuery =
`
unwind $search as search 
match (p:patient)-[:attended]->(:visit)-[:prescribed]->(t:treatment) where p.uuid=search.patientuuid
return t order by t.start_date desc limit 10
`
// TODO: show only active treatments

export const getvisitsQuery = 
`
unwind $search as search 
match (p:patient {uuid: search.patientuuid})-[:attended]->(v:visit)
optional match (p:patient)-[:attended]->(v:visit)-[:diagnosed]->(c:condition)
optional match (p:patient)-[:attended]->(v:visit)-[:measured]->(vit:vitals)
return v.uuid, v.id, v.date, count(distinct c), count(distinct vit)
`

export const patientovervirewQuery = 
`
unwind $search as search 
match (p:patient {uuid: search.patientuuid})
return p
`

export const newpatientidQuery = 
`
unwind $search as search 
match (p:patient)
with p.id as id order by id desc
return id limit 1
`

export const addpatientQuery = (props, hits) => {
    const query =
        `
        unwind $search as search  
        with apoc.create.uuid() as newuuid, search.data as newpatientdata, toInt(search.id) as newid
        merge (p:patient {uuid: newuuid})
        set p = newpatientdata, p.id=newid
        `
        let isSubscribed = true
        const neo4j_driver = props.neo4j
        const session = neo4j_driver.session()
        const objb = {search:{
            data: hits,
            id: hits.id+1
        }}
        const parameters = objb
        session 
        .run(query, parameters)
        .then(recs => {
            if (isSubscribed) {
            const response = {recs}
            console.log(response.recs.records)
            }
        })
        .catch(function (error)
        {console.log(error); 
        session.close();});  
    return () => isSubscribed = false
}
