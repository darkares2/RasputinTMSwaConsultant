import React from 'react';
import { SessionTable } from './sessiontable';
import { Session } from './session';


class Appointment extends React.Component {

    constructor(props) {
        super(props);
        this.state = { error: 'loading...', sessions: [], appointment: null, openSession: undefined};
    }

    componentDidUpdate(prevProps) {
        if (this.props.openAppointment !== prevProps.openAppointment) {
            const appointment = this.props.appointments.find((appointment)=> { return appointment.AppointmentID === this.props.openAppointment });
            this.setState({sessions: [], openSession: undefined , appointment: appointment});
            this.loadSessions(appointment.UserID);
        }
    }

    loadSessions = (userID) => {
        const current = this;

        (async function () {
            var text = null;
            const url = 'https://rasputintmfasessionservice.azurewebsites.net';
            await fetch(url + '/api/GetSession?UserID=' + userID)
                .then(response => {
                    console.log("Response: ", response);
                    if (response.status >= 400 && response.status < 600) {
                        current.setState({ error: response.statusText });
                    }
                    return response.json();
                })
                .then(json => { text = json; })
                .catch(error => { console.log("Error: ", error); });
            if (text !== null) {
                current.setState({ error: '' });                
                console.log(text);
                const sessions = text.map((session)=> {
                    var user = current.props.users.find((user)=> { return user.UserID === session.UserID });
                    if (user !== undefined)
                        session.UserName = user.Name;
                    user = current.props.users.find((user)=> { return user.UserID === session.ConsultantID });
                    if (user !== undefined)
                        session.SlotUserName = user.Name;
                    return session;
                });
            
                current.setState({ sessions: sessions });
            }
        })();
    }

    onEnterSession = (sessionID) => {
        this.setState({openSession: sessionID})
    }

    onCreateSession = () => {
        const current = this;
        current.setState({ error: 'Creating session...' });                

        (async function () {
            var text = null;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ UserID: current.state.appointment.UserID, ConsultantID: current.state.appointment.SlotUserID })
            };
            const url = 'https://rasputintmfasessionservice.azurewebsites.net';
            await fetch(url + '/api/CreateSession', requestOptions)
                .then(response => {
                    console.log("Response: ", response);
                    if (response.status >= 400 && response.status < 600) {
                        current.setState({ error: response.statusText });
                    }
                    return response.json();
                })
                .then(json => { text = json; })
                .catch(error => { console.log("Error: ", error); });
            if (text !== null) {
                current.setState({ error: '' });                
                console.log(text);
                var sessions = current.state.sessions;
                sessions.push(text);
                current.setState({openSession: text.SessionID, sessions: sessions})
            }
        })();
    }

    onCloseSession = (sessionID) => {
        const current = this;
        current.setState({ error: 'Closing session...', openSession: undefined });                

        (async function () {
            var text = null;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ SessionID: sessionID })
            };
            const url = 'https://rasputintmfasessionservice.azurewebsites.net';
            await fetch(url + '/api/CloseSession', requestOptions)
                .then(response => {
                    console.log("Response: ", response);
                    if (response.status >= 400 && response.status < 600) {
                        current.setState({ error: response.statusText });
                    }
                    return response.json();
                })
                .then(json => { text = json; })
                .catch(error => { console.log("Error: ", error); });
            if (text !== null) {
                current.setState({ error: '' });                
                console.log(text);
                current.loadSessions(current.state.appointment.UserID);
            }
        })();
    }

    render() {        
        if (this.props.openAppointment === null || this.state.appointment === null)
            return null;


        return (
            <div className="fancy">
                <div>Appointment: {this.props.openAppointment}</div>
                <div>Session: {this.state.openSession}</div>
                <div>User: {this.state.appointment.UserName}</div>
                <SessionTable sessions={this.state.sessions} onEnterSession={this.onEnterSession} onCreateSession={this.onCreateSession} onCloseSession={this.onCloseSession} currentSession={this.state.openSession} />
                <Session openSession={this.state.openSession} userID={this.state.appointment.SlotUserID} users={this.props.users} />
                {this.state.error}
            </div>
        );
    }
}

export { Appointment };