import React, { useState, useEffect } from 'react';
import { Layout, Modal, Select } from 'antd';
import MySidebar from './Sidebar';
import './KeyBind.css';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import Swal from 'sweetalert2';
import axios from 'axios';

const { Sider } = Layout;
const { Option } = Select;

function KeyBind({ tableData, refresh, setRefresh }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedValues, setSelectedValues] = useState({
    firstSelect: '',
    secondSelect: '',
    thirdSelect: '',
  });
  const [editIndex, setEditIndex] = useState(null); // State to track the index of the item being edited

  useEffect(() => {
    if (editIndex !== null) {
      const selectedItem = tableData[editIndex];
      setSelectedValues({
        firstSelect: selectedItem.combination.split(' ')[0],
        secondSelect: selectedItem.combination.split(' ')[2],
        thirdSelect: selectedItem.action,
      });
      setIsModalVisible(true);
    }
  }, [editIndex, tableData]);

  const siderStyle = {
    color: '#F0F0F0',
    backgroundColor: '#333333',
    borderRight: '1px solid black',
  };

  const openAdd = () => {
    setIsModalVisible(true);
    setEditIndex(null); // Reset editIndex when opening modal for adding new item
  };

  const handleAdd = () => {
    const { firstSelect, secondSelect, thirdSelect } = selectedValues;

    if (editIndex !== null) {
      const newItem = {
        combination: `${firstSelect} + ${secondSelect}`,
        action: thirdSelect,
      };
      const combinationExists = tableData.some(
        (item, index) =>
          index !== editIndex && item.combination === newItem.combination,
      );

      const actionExists = tableData.some(
        (item, index) => index !== editIndex && item.action === newItem.action,
      );

      if (combinationExists) {
        Swal.fire({
          icon: 'error',
          title: 'Combination already exists',
        });
        return;
      }

      if (actionExists) {
        Swal.fire({
          icon: 'error',
          title: 'Action already exists',
        });
        return;
      }

      const token = localStorage.getItem('id');

      axios
        .put(
          process.env.REACT_APP_PORTURL +
            '/shortcut/' +
            tableData[editIndex].id,
          newItem,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((res) => {
          setRefresh(!refresh);
          Swal.fire({
            icon: 'success',
            title: 'Key Bind updated successfully',
            iconColor: '#333333',
            confirmButtonColor: '#333333',
          });
          setIsModalVisible(false);
          setEditIndex(null);
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }

    const combinationExists = tableData.some(
      (item) => item.combination === `${firstSelect} + ${secondSelect}`,
    );

    const actionExists = tableData.some((item) => item.action === thirdSelect);

    if (combinationExists) {
      Swal.fire({
        icon: 'error',
        title: 'Combination already exists',
      });
      return;
    }

    if (actionExists) {
      Swal.fire({
        icon: 'error',
        title: 'Action already exists',
      });
      return;
    }

    const newItem = {
      combination: `${firstSelect} + ${secondSelect}`,
      action: thirdSelect,
    };
    const token = localStorage.getItem('id');

    axios
      .post(process.env.REACT_APP_PORTURL + '/shortcut', newItem, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRefresh(!refresh);
        Swal.fire({
          icon: 'success',
          title: 'Key Bind added successfully',
          iconColor: '#333333',
          confirmButtonColor: '#333333',
        });
        setIsModalVisible(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleModalCancel = () => {
    setSelectedValues({
      firstSelect: '',
      secondSelect: '',
      thirdSelect: '',
    });
    setIsModalVisible(false);
    setEditIndex(null); // Reset editIndex when closing modal
  };

  const handleSelectChange = (value, name) => {
    setSelectedValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      iconColor: '#333333',
      showCancelButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('id');
        axios
          .delete(process.env.REACT_APP_PORTURL + '/shortcut/' + id, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setRefresh(!refresh);
            Swal.fire({
              icon: 'success',
              title: 'Key Bind deleted successfully',
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  const handleEdit = (index) => {
    setEditIndex(index); // Set the index of the item being edited
  };

  return (
    <Layout style={{ overflow: 'hidden', width: '100%', height: '100vh' }}>
      <Sider width="15%" style={siderStyle}>
        <MySidebar />
      </Sider>
      <div className="full-page-container">
        <div
          style={{
            alignSelf: 'end',
            marginRight: '10%',
            marginBottom: '20px',
          }}
        >
          <button
            style={{
              color: 'white',
              backgroundColor: '#333333',
              height: '40px',
            }}
            onClick={openAdd}
            className="btn btn-primary"
          >
            <PlusCircleOutlined /> Add New
          </button>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Shortcut Key</th>
              <th>Action</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tableData.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center">
                  No data found
                </td>
              </tr>
            )}
            {tableData.map((item, index) => (
              <tr key={index}>
                <td>
                  {item?.combination &&
                    item.combination.slice(0, -1) +
                      item.combination.slice(-1).toUpperCase()}
                </td>
                <td>{item?.action?.toUpperCase()}</td>
                <td style={{ width: '100px' }}>
                  <div className="d-flex justify-content-around">
                    <div
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEdit(index)}
                    >
                      <EditOutlined />
                    </div>
                    <div
                      onClick={() => handleDelete(item.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <DeleteOutlined />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        open={isModalVisible}
        onOk={handleAdd}
        onCancel={handleModalCancel}
      >
        <div>
          <center>
            <h4>{editIndex !== null ? 'Edit' : 'Add New'} </h4>
          </center>
          <div className="d-flex gap-3 mt-4 m-2">
            <h6 className="mt-1">Combination:</h6>
            <Select
              style={{ width: 200 }}
              value={selectedValues.firstSelect}
              onChange={(value) => handleSelectChange(value, 'firstSelect')}
            >
              <Option value="Ctrl">Ctrl</Option>
              <Option value="Alt">Alt</Option>
              {/* Add more options as needed */}
            </Select>
            <p>+</p>
            <Select
              style={{ width: 200 }}
              value={selectedValues.secondSelect}
              onChange={(value) => handleSelectChange(value, 'secondSelect')}
            >
              {Array.from({ length: 26 }, (_, index) => {
                const letter = String.fromCharCode(65 + index); // Get letter from ASCII code
                return (
                  <Option
                    key={letter.toLowerCase()}
                    value={letter.toLowerCase()}
                  >
                    {letter}
                  </Option>
                );
              })}
            </Select>
          </div>
          <div className="d-flex gap-5 mt-4 m-2">
            <h6 className="mt-1">Action:</h6>
            <Select
              style={{ width: 150, marginLeft: '15px' }}
              value={selectedValues.thirdSelect}
              onChange={(value) => handleSelectChange(value, 'thirdSelect')}
            >
              <Option value="save">Save</Option>
              <Option value="run">Run</Option>
              <Option value="new">New</Option>
              <Option value="upload">Upload</Option>
              <Option value="download">Download</Option>
              <Option value="stop">Stop</Option>
              {/* Add more options as needed */}
            </Select>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

export default KeyBind;
