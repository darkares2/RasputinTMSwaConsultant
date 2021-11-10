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
        var addSlotsView = <span/>;
        if (this.state.currentSubmenu === viewAddSlots) {
            addSlotsView = <SlotAdd userID={this.props.userID} />;
        }
        var listSlotsView = <span/>;
        if (this.state.currentSubmenu === viewListSlots) {
            listSlotsView = <SlotList userID={this.props.userID} />;
        }

        return (
            <div className="fancy">
                <h1>Slot menu:</h1>
                <button className="button-7" type="button" onClick={this.onAddSlots} >Add slots</button>
                {addSlotsView}
                <button className="button-7" type="button" onClick={this.onListSlots} >List slots</button>
                {listSlotsView}
            </div>
        );
    }
}

export { SlotMenu };