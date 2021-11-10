import React from 'react';
import { AppointmentTable } from './appointmenttable';

class AppointmentList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { error: 'loading...', appointments: [], services: [], users: []};
    }

    componentDidMount() {
        this.loadServices();
        this.loadUsers();
        this.loadAppointments();
    }

    loadServices = () => {
        const current = this;

        (async function () {
            var text = null;
            //const url = 'http://localhost:7071';
            const url = 'https://rasputintmfaserviceservice.azurewebsites.net';
            await fetch(url + '/api/GetService')
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
                current.setState({ services: text });
            }
        })();
    }

    loadUsers = () => {
        const current = this;

        (async function () {
            var text = null;
            //const url = 'http://localhost:7071';
            const url = 'https://rasputintmfauserservice.azurewebsites.net';
            await fetch(url + '/api/GetUser')
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
                current.setState({ users: text });
            }
        })();
    }

    loadAppointments = () => {
        const current = this;

        (async function () {
            var text = null;
            //const url = 'http://localhost:7075';
            const url = 'https://rasputintmfaappointmentservice.azurewebsites.net';
            await fetch(url + '/api/GetAppointment?slotUserID=' + current.props.userID)
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
                current.setState({ appointments: text });                
            }
        })();
    }


    onService = (serviceID) => {
        this.setState({serviceChoice: serviceID})
    }

    render() {        
        const data = this.state.appointments.map((appointment)=> {
            const service = this.state.services.find((service)=> { return service.ServiceID === appointment.ServiceID });
            if (service !== undefined)
                appointment.ServiceName = service.Name;
            const user = this.state.users.find((user)=> { return user.UserID === appointment.UserID });
            if (user !== undefined)
                appointment.UserName = user.Name;
            return appointment;
        });

        console.log("Data: ", data);
        return (
            <div className="fancy">
                <AppointmentTable appointments={data} />
                {this.state.error}
            </div>
        );
    }
}

export { AppointmentList };