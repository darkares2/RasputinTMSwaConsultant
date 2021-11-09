import React from 'react';
import DateTimePicker from 'react-datetime-picker';
import Select, { ActionMeta, OnChangeValue} from 'react-select'
import makeAnimated from 'react-select/animated';

class SlotAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state = { error: '', timeslot: new Date(), services: [], selectedServices: [] };
    }

    componentDidMount() {
        this.loadServices();
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

    onChange = (
        newValue: OnChangeValue<any, true>,
        actionMeta: ActionMeta<any>
      ) => {
        const valueList = newValue.map((s) => { return s.value });
        console.group('Value Changed');
        console.log(newValue);
        console.log(valueList);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
        
        this.setState({selectedServices: valueList});
      };

    handleSubmit = event => {
        event.preventDefault();
        const current = this;
  
          (async function () {      
            var text = null;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userID: current.props.userID, timeslot: current.state.timeslot, serviceIDs: current.state.selectedServices })
            };
            //const url = 'http://localhost:7073';
            const url = 'https://rasputintmfaslotservice.azurewebsites.net';
            await fetch(url + '/api/CreateSlot', requestOptions)
                  .then(response => { 
                    console.log("Response: ", response);
                    if (response.status >= 400 && response.status < 600) {
                      current.setState({ error: response.statusText});
                    }
                    return response.json(); 
                  } )
                  .then(json => { text = json; } )
                  .catch(error => { console.log("Error: ", error); });
                  if (text !== null) {
                      current.setState({ error: ''});
                      console.log(text);
                      current.setState({timeslot: new Date()});
                  }
          })();
      }
  
    render() {
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


        const services = this.state.services.map((service) => { return { value: service.ServiceID, label: service.Name} } );
        const animatedComponents = makeAnimated();

        return (
            <form style={formStyle} onSubmit={this.handleSubmit}>
            <label style={labelStyle}>
              Timeslot:
              <DateTimePicker onChange={(value) => this.setState({timeslot: value}) } value={this.state.timeslot} locale="da-DK" />
            </label>
            <label style={labelStyle}>
              Services:
              <Select options={services}
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                onChange={this.onChange}
               />
            </label>
            <span>{this.state.error}</span>
            <input type="submit" value="Submit" style={buttonStyle} />
          </form>
          );
    }
}

export { SlotAdd };