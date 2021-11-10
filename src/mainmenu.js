import React from 'react';
import { SlotMenu } from './slotmenu';
import { AppointmentList } from './appointmentlist'

const slotMenu = 'slotMenu';
const listAppointments = 'listAppointments';

class MainMenu extends React.Component {

    constructor(props) {
        super(props);
        const search = window.location.search;
        const userID = new URLSearchParams(search).get("userID");
        this.state = { user: null, userID: userID, error: 'loading...', currentSubmenu: ''};
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

    onSlots = () => {
        this.setState({currentSubmenu: slotMenu});
    }

    onAppointments = () => {
        this.setState({currentSubmenu: listAppointments});
    }

    render() {
        if (this.state.user === null) {
            return <div>{this.state.error}</div>;
        }

        var slotSubMenu = <span/>;
        if (this.state.currentSubmenu === slotMenu) {
            slotSubMenu = <SlotMenu userID={this.state.userID} />;
        }
        var appointmentSubMenu = <span/>;
        if (this.state.currentSubmenu === listAppointments) {
            appointmentSubMenu = <AppointmentList userID={this.state.userID} />;
        }

        return (
            <div className="fancy">
                <h1>Welcome {this.state.user.Name}</h1>
                <button className="button-7" type="button" onClick={this.onSlots} >Slots</button>
                {slotSubMenu}
                <br/>
                <button className="button-7" type="button" onClick={this.onAppointments} >Appointments</button>
                {appointmentSubMenu}
            </div>
        );
    }
}

export { MainMenu };