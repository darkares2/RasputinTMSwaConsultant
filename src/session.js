import React from 'react';
import { NotesTable } from './notestable';

class Session extends React.Component {

    constructor(props) {
        super(props);
        this.state = { error: '', notes: undefined};
    }

    componentDidUpdate(prevProps) {
        if (this.props.openSession !== prevProps.openSession) {
            this.setState({notes: []});
            if (this.props.openSession !== undefined)
                this.loadNotes(this.props.openSession);
        }
    }

    loadNotes = (sessionID) => {
        const current = this;
        current.setState({ notes: undefined });
        current.setState({ error: 'Loading notes...' });                

        (async function () {
            var text = null;
            const url = 'https://rasputintmfanotesservice.azurewebsites.net';
            await fetch(url + '/api/GetNote?SessionID=' + sessionID)
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
                const notes = text.map((note)=> {
                    var user = current.props.users.find((user)=> { return user.UserID === note.UserID });
                    if (user !== undefined)
                        note.UserName = user.Name;
                    return note;
                });
                current.setState({ notes: notes });
            }
        })();
    }

    onCreateNote = (note) => {
        const current = this;

        (async function () {
            var text = null;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ SessionID: current.props.openSession, Notes: note, UserID: current.props.userID })
            };
            const url = 'https://rasputintmfanotesservice.azurewebsites.net';
            await fetch(url + '/api/CreateNote', requestOptions)
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
                var notes = current.state.notes;
                var user = current.props.users.find((user)=> { return user.UserID === text.UserID });
                if (user !== undefined)
                    text.UserName = user.Name;
                notes.push(text);
                current.setState({openSession: text.SessionID, notes: notes})
            }
        })();

    }
    
    render() {        
        if (this.props.openSession === null || this.props.openSession === undefined)
            return null;


        return (
            <div className="fancy">
                <div>Session: {this.props.openSession}</div>
                <NotesTable notes={this.state.notes} onCreateNote={this.onCreateNote} />
                {this.state.error}
            </div>
        );
    }
}

export { Session };