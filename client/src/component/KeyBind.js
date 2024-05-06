import React from 'react';
import './KeyBind.css';

function KeyBind({ tableData }) {
  return (
    <div className="full-page-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Shortcut Key</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length === 0 && (
            <tr>
              <td colSpan="2" className="text-center">
                No data found
              </td>
            </tr>
          )}
          {tableData.map((item, index) => (
            <tr key={index}>
              <td>{item.combination}</td>
              <td>{item.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KeyBind;
