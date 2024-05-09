import React, { useEffect, useState } from 'react';
import logo from '../logobg.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faFolderOpen,
  faFolderPlus,
  faKeyboard,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function MySidebar() {
  const [login, setLogin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('id');
    if (token) {
      setLogin(true);
    }
  }, []);

  const handleNew = () => {
    navigate('/');
    window.location.reload();
  };

  const handleProject = () => {
    const token = localStorage.getItem('id');
    if (!token) {
      Swal.fire({
        icon: 'error',
        iconColor: '#333333',
        title: 'Please Login First',
        confirmButtonColor: '#333333',
      });
      return;
    }
    navigate('/project');
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <img
        onClick={() => {
          navigate('/');
        }}
        style={{ width: '100%' }}
        className="mt-5"
        src={logo}
        alt="logo"
      />
      <div
        className="d-flex justify-content-center"
        style={{ height: '100%', marginTop: '100px' }}
      >
        <div style={{ listStyle: 'none', textAlign: 'start' }}>
          <li
            style={{ cursor: 'pointer' }}
            className="cursor-pointer fs-6 mt-3"
            onClick={handleNew}
          >
            <FontAwesomeIcon className="me-2" icon={faFolderPlus} />
            <span className="fs-5">New Project</span>
          </li>
          <li
            style={{ cursor: 'pointer' }}
            className="cursor-pointer fs-6 mt-3"
            onClick={handleProject}
          >
            <FontAwesomeIcon className="me-2" icon={faFolderOpen} />
            <span className="fs-5">My Project</span>
          </li>
          <li
            style={{ cursor: 'pointer' }}
            className="cursor-pointer fs-6 mt-3"
            onClick={() => {
              navigate('/keybind');
            }}
          >
            <FontAwesomeIcon className="me-2" icon={faKeyboard} />
            <span className="fs-5">Key Binding</span>
          </li>
          {!login ? (
            <li
              onClick={() => {
                navigate('/login');
              }}
              style={{ cursor: 'pointer' }}
              className="fs-6 mt-3"
            >
              <FontAwesomeIcon className="me-2" icon={faArrowRightToBracket} />
              <span className="fs-5">Login / Sign up</span>
            </li>
          ) : (
            <li
              onClick={() => {
                localStorage.clear();
                navigate('/');
              }}
              style={{ cursor: 'pointer' }}
              className="cursor-pointer fs-6 mt-3"
            >
              <FontAwesomeIcon
                className="me-2"
                icon={faArrowRightFromBracket}
              />
              <span className="fs-5">Logout</span>
            </li>
          )}
        </div>
      </div>
    </div>
  );
}

export default MySidebar;
