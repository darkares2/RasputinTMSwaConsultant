import React from 'react';

const scheduleMenu = 'scheduleMenu';
const listAppointments = 'listAppointments';

class MainMenu extends React.Component {

    constructor(props) {
        super(props);
        const search = window.location.search;
        const userID = new URLSearchParams(search).get("userID");
        this.state = { user: null, userID: userID, error: 'loading...', currentSubmenu: '', serviceList: [], appointmentList: [] };
    }

    componentDidMount() {
        this.loadUser();
    }

    loadUser = () => {
        const current = this;

        (async function () {
            var text = null;
            //const url = 'http://localhost:7071';
            const url = 'https://rasputintmfauserservice.azurewebsites.net';
            await fetch(url + '/api/GetUser?userID=' + current.state.userID)
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
                current.setState({ user: text });
            }
        })();
    }

    onScheduleAppointment = () => {
        this.setState({currentSubmenu: scheduleMenu, serviceList: [{name: 'Hals'}, {name: 'Generelt'}]})
    }

    onListAppointments = () => {
        this.setState({currentSubmenu: listAppointments, appointmentList: [{name: 'Hals'}, {name: 'Generelt'}]})
    }

    onClickScheduleService = (event, serviceName) => {
        alert("Service chosen: " + serviceName);
    }

    render() {
        if (this.state.user === null) {
            return <div>{this.state.error}</div>;
        }

        const formStyle = {
            margin: 'auto',
            padding: '10px',
            border: '1px solid #c9c9c9',
            borderRadius: '5px',
            background: '#f5f5f5',
            width: '220px',
            display: 'block'
        };
        const labelStyle = {
            margin: '10px 0 5px 0',
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: '15px',
        };
        const inputStyle = {
            margin: '5px 0 10px 0',
            padding: '5px',
            border: '1px solid #bfbfbf',
            borderRadius: '3px',
            boxSizing: 'border-box',
            width: '100%'
        };
        const buttonStyle = {
            margin: '10px 0 0 0',
            padding: '7px 10px',
            border: '1px solid #efffff',
            borderRadius: '3px',
            background: '#3085d6',
            width: '100%',
            fontSize: '15px',
            color: 'white',
            display: 'block'
        };

        var scheduleSubMenu = <span/>;
        if (this.state.currentSubmenu === scheduleMenu) {
            const items = this.state.serviceList.map(service => (
                <button style={buttonStyle} onClick={e=>{ this.onClickScheduleService(e, service.name); }} key={service.name}>
                  {service.name}
                </button>
              ));
            scheduleSubMenu = <div style={formStyle}>{items}</div>;
        }
        var appointmentListSubMenu = <span/>;
        if (this.state.currentSubmenu === listAppointments) {
            const items = this.state.appointmentList.map(appointment => (
                <button style={buttonStyle} onClick={e=>{ this.onClickScheduleService(e, appointment.name); }} key={appointment.name}>
                  {appointment.name}
                </button>
              ));
              appointmentListSubMenu = <div style={formStyle}>{items}</div>;
        }

        return (
            <div style={formStyle}>
                <span style={labelStyle}>Welcome {this.state.user.Name}</span>
                <input type="button" value="Schedule new appointment" style={buttonStyle} onClick={this.onScheduleAppointment} />
                {scheduleSubMenu}
                <input type="button" value="List appointments" style={buttonStyle} onClick={this.onListAppointments} />
                {appointmentListSubMenu}
            </div>
        );
    }
}

export { MainMenu };