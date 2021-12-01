import React from 'react';


class SessionTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {disabled: false};
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

  render() {
    if (this.props.sessions === undefined)
      return null;
    return (
      <div>
        <table className="styled-table">
          <caption>Available sessions</caption>
          <thead>
            <tr>
              <th>Oprettet</th>
              <th>User</th>
              <th>Consultant</th>
            </tr>
          </thead>
          <tbody>
            {this.props.sessions.map(session => {
              var buttonText = 'Active';
              if (this.props.currentSession === undefined || this.props.currentSession !== session.SessionID)
                buttonText = <button className="button-7" type="button" onClick={ () => this.props.onEnterSession(session.SessionID)} >Enter session</button>;
              return (
              <tr key={session.SessionID}>
                <td>{this.convertUTCToLocalTime(session.Timestamp).toLocaleString("da-DK")}</td>
                <td>{session.UserName}</td>
                <td>{session.SlotUserName}</td>
                <td>{buttonText}</td>
              </tr>
            )})}
          </tbody>
        </table>
        <button className="button-7" type="button" onClick={ () => this.props.onCreateSession()} >New session</button>
        </div>
      );
  }
}

export { SessionTable };