import React from 'react';
import DateTimePicker from 'react-datetime-picker';
import Select, { ActionMeta, OnChangeValue} from 'react-select'
import makeAnimated from 'react-select/animated';

class SlotAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state = { error: '', timeslot: new Date(Date.now() + (3600 * 1000 * 24 * 7)), services: [], selectedServices: [], disabled: false };
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
        if (this.state.disabled) {
            return;
        }
        this.setState({disabled: true});
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
                    current.setState({disabled: false});
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
                      current.setState({timeslot: new Date(Date.now() + (3600 * 1000 * 24 * 7))});
                      alert("New slot added");
                  }
          })();
      }
  
    render() {
        const services = this.state.services.map((service) => { return { value: service.ServiceID, label: service.Name} } );
        const animatedComponents = makeAnimated();

        return (
            <form className="fancy" onSubmit={this.handleSubmit}>
            <label>
              Timeslot:
              <DateTimePicker onChange={(value) => this.setState({timeslot: value}) } value={this.state.timeslot} locale="da-DK" />
            </label>
            <br/>
            <label>
              Services:
              <Select options={services}
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                onChange={this.onChange}
               />
            </label>
            <span>{this.state.error}</span>
            <button className="button-7" type="submit" disabled={this.state.disabled} >{this.state.disabled ? 'Adding...' : 'Add'}</button>
          </form>
          );
    }
}

export { SlotAdd };