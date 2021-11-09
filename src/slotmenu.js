import React from 'react';
import { SlotAdd } from './slotadd';
import { SlotList } from './slotlist';

const viewListSlots = 'viewslots';
const viewAddSlots = 'viewadd';

class SlotMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = { currentView: viewListSlots};
    }

    onAddSlots = () => {
        this.setState({currentSubmenu: viewAddSlots});
    }

    onListSlots = () => {
        this.setState({currentSubmenu: viewListSlots});
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

        var addSlotsView = <span/>;
        if (this.state.currentSubmenu === viewAddSlots) {
            addSlotsView = <SlotAdd userID={this.props.userID} />;
        }
        var listSlotsView = <span/>;
        if (this.state.currentSubmenu === viewListSlots) {
            listSlotsView = <SlotList userID={this.props.userID} />;
        }

        return (
            <div style={formStyle}>
                <span style={labelStyle}>Slot menu:</span>
                <input type="button" value="Add slots" style={buttonStyle} onClick={this.onAddSlots} />
                {addSlotsView}
                <input type="button" value="List slots" style={buttonStyle} onClick={this.onListSlots} />
                {listSlotsView}
            </div>
        );
    }
}

export { SlotMenu };