import React from 'react';
import { Layout } from 'antd';
import MySidebar from './Sidebar';
import './KeyBind.css';

const { Sider } = Layout;
function KeyBind({ tableData }) {
  const siderStyle = {
    color: '#F0F0F0',
    backgroundColor: '#333333',
    borderRight: '1px solid black',
  };
  return (
    <Layout style={{ overflow: 'hidden', width: '100%', height: '100vh' }}>
      <Sider width="15%" style={siderStyle}>
        <MySidebar />
      </Sider>
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
    </Layout>
  );
}

export default KeyBind;
