import React from 'react';


class SlotTable extends React.Component {
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
        return (
            <table className="styled-table">
              <caption>Available slots</caption>
              <thead>
                <tr>
                  <th>Timeslot</th>
                  <th>Consultant</th>
                  <th>Services</th>
                </tr>
              </thead>
              <tbody>
                {this.props.slots.map(slot => (
                  <tr key={slot.SlotID}>
                    <td>{this.convertUTCToLocalTime(slot.Timeslot).toLocaleString("da-DK")}</td>
                    <td>{slot.UserID}</td>
                    <td>{slot.ServiceNames}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
    }
}

export { SlotTable };