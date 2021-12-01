import React from 'react';


class NotesTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {disabled: false, note: ''};
  }

  convertUTCToLocalTime = (dateString) => {
    let date = new Date(dateString);
    const milliseconds = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    );
    const localTime = new Date(milliseconds);
    return localTime;
  };

  handleChange = (event) => {
    this.setState({note: event.target.value});
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.props.onCreateNote(this.state.note); this.setState({note: ''});
    }
  }

  render() {
    if (this.props.notes === undefined || this.props.notes === null)
      return null;
    return (
      <div>
        <table className="styled-table">
          <caption>Available notes</caption>
          <thead>
            <tr>
              <th>Oprettet</th>
              <th>User</th>
              <th>Consultant</th>
            </tr>
          </thead>
          <tbody>
            {this.props.notes.map(notes => {
              return (
              <tr key={notes.NoteID}>
                <td>{this.convertUTCToLocalTime(notes.Timestamp).toLocaleString("da-DK")}</td>
                <td>{notes.Notes}</td>
                <td>{notes.UserName}</td>
              </tr>
            )})}
          </tbody>
        </table>
        <input type="textarea" autoFocus 
          placeholder="Enter note" style={{width: "370px"}}
          name="textValue"
          value={this.state.note}
          onChange={this.handleChange} onKeyDown={this._handleKeyDown}
        />
        <button className="button-7" type="button" onClick={ () => { this.props.onCreateNote(this.state.note); this.setState({note: ''}); } } >Add new note</button>
        </div>
      );
  }
}

export { NotesTable };