import React from 'react';
import { Route, Switch, Router, BrowserRouter} from 'react-router-dom'
import history from './history'

import Dashboard from '../Dashboard/Dashboard';
import Overview from '../Home/Overview';
import Patient from '../Patient/PatientOverview';
import Conditions from '../Conditions/ConditionsOverview';
import EditPatient from '../Patient/EditPatientInfo';
import VisitOverview from '../Visit/VisitOveview';

const isAuthenticated = () => (sessionStorage.setItem('isAuthenticated', true))

const MainRoutes = () => {
    isAuthenticated()
    return (
        <BrowserRouter>
            <Switch>
            <Router history={history} component={MainRoutes}>
                <Route exact path="/" render={(props) => <Overview {...props}/>}/>
                <Route exact path="/Dashboard" render={(props) => <Dashboard {...props}/>}/>
                <Route exact path="/Patients" render={(props) => <Patient {...props}/>} />
                <Route exact path="/Conditions" render={(props) => <Conditions {...props}/>} />
                <Route exact path="/EditPatient" render={(props) => <EditPatient {...props}/>} />
                <Route exact path="/EditVisit" render={(props) => <VisitOverview {...props}/>} />
            </Router>
            </Switch>
        </BrowserRouter>
    )
}
export default MainRoutes