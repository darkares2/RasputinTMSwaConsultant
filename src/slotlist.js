import React from 'react';
import {SlotTable} from './slottable';

class SlotList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { error: '', timeslot: new Date(), services: [], slots: [] };
        window.React = require('react');
    }

    componentDidMount() {
        this.loadServices();
        this.loadSlots();
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

    loadSlots = () => {
        const current = this;

        (async function () {
            var text = null;
            //const url = 'http://localhost:7073';
            const url = 'https://rasputintmfaslotservice.azurewebsites.net';
            await fetch(url + '/api/GetSlot?UserID=' + current.props.userID)
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
                current.setState({ slots: text });                
            }
        })();
    }

    render() {
        const tableStyle = {
            margin: 'auto',
            padding: '10px',
            border: '1px solid #c9c9c9',
            borderRadius: '5px',
            fontSize: '10px',
            background: '#f5f5f5',
            width: '800px',
            position: 'relative',
            left: '-400px',
            display: 'block'
        };
        const iconStyle = {
            color: '#aaa',
            paddingLeft: '5px',
            paddingRight: '5px'
          };

          const columns = [
            {
                header: 'SlotID',
                key: 'SlotID',
                defaultSorting: 'ASC',
                headerStyle: { backgroundColor: '#20DAB9', width: '200px' },
                dataProps: { className: 'align-right' }
              },
              {
              header: 'UserID',
              key: 'UserID',
              headerStyle: { backgroundColor: '#20DAB9', width: '200px' },
            },
            {
              header: 'Timeslot',
              key: 'Timeslot',
              defaultSorting: 'DESC',
              headerStyle: { backgroundColor: '#20DAB9', width: '200px' },
              headerProps: { className: 'align-left' },
            },
            {
              header: 'Services',
              key: 'ServiceNames',
              headerStyle: { backgroundColor: '#20DAB9', width: '200px' },
              sortable: false
            }
          ];

        const data = this.state.slots.map((slot)=> {
            const serviceIDs = slot.ServiceIDs.split(',');
            if (serviceIDs.length > 0) {
                console.log("ServicIDs: ", serviceIDs);
                const services = serviceIDs.map((id)=> { return this.state.services.find((service)=> { return service.ServiceID === id })});
                console.log("Services: ", services);
                slot.ServiceNames = services.map((service)=> { if (service === undefined) return ''; else return service.Name; }).join(',');
            }
            return slot;
        });
        console.log("Data: ", data);

        return (
            <SlotTable slots={data} />
        );
    }
}

export { SlotList };