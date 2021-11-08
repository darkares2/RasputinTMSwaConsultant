import React from 'react';
import { SlotMenu } from './slotmenu';

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

        var slotSubMenu = <span/>;
        if (this.state.currentSubmenu === slotMenu) {
            slotSubMenu = <SlotMenu userID={this.state.userID} />;
        }
        var appointmentSubMenu = <span/>;
        if (this.state.currentSubmenu === listAppointments) {
            appointmentSubMenu = <div />;
        }

        return (
            <div style={formStyle}>
                <span style={labelStyle}>Welcome {this.state.user.Name}</span>
                <input type="button" value="Slots" style={buttonStyle} onClick={this.onSlots} />
                {slotSubMenu}
                <input type="button" value="Appointments" style={buttonStyle} onClick={this.onAppointments} />
                {appointmentSubMenu}
            </div>
        );
    }
}

export { MainMenu };