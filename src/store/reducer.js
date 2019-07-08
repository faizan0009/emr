import * as actionTypes from './actionTypes'

const NEO4J_URI = "bolt://localhost:7687";
const NEO4J_USER = "neo4j";
const NEO4J_PASSWORD = "demo";

const neo4j = require('neo4j-driver').v1
let driver = neo4j.driver(NEO4J_URI , neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD), {disableLosslessIntegers: true})

const initialState = {
    width: 230,
    drawer: true,
    dbserver: driver,
    condition: undefined,
    patient: undefined,
    deletedcondition: undefined
  }

const reducer = (state = initialState, action) => {
    // eslint-disable-next-line default-case
    switch (action.type){
        case actionTypes.DrawerOpen : 
        return {
            ...state,
            drawer: action.val
        }
        case actionTypes.SELECTEDCONDITION :
        return {
            ...state,
            condition: action.val
        }
        case actionTypes.SELECTEDPATIENT :
        return {
            ...state,
            patient: action.val
        }
        case actionTypes.SELECTEDVISIT :
        return {
            ...state,
            visit: action.val
        }
        case actionTypes.DELETEDCONDITION :
            return {
                ...state,
                deletedcondition: action.val
            }
    }
    return state;
};

export default reducer