import React, { useEffect, useState } from 'react';
import './overflow.css';
import { FaSearch, FaEdit, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function MyProjectList({
  code,
  setCode,
  language,
  setLanguage,
  fileName,
  setFileName,
  ext,
  setExt,
}) {
  const [projects, setProjects] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('id');
    axios
      .get(process.env.REACT_APP_PORTURL + '/file', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data) {
          setProjects(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [refresh]);

  const handleEdit = (id) => {
    Swal.fire({
      title: 'Enter project name',
      input: 'text',
      inputValue: projects.find((project) => project.id === id).projectName,
      inputPlaceholder: 'Enter project name',
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Project name cannot be empty';
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const projectName = result.value;
        axios
          .put(
            process.env.REACT_APP_PORTURL + '/file/' + id,
            { projectName },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('id')}`,
              },
            },
          )
          .then((res) => {
            Swal.fire('Project Name updated!', '', 'success');
            console.log(res);
            setRefresh(!refresh);
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this part. This action cannot be undone.',
      icon: 'warning',
      iconColor: '#333333',
      showCancelButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(process.env.REACT_APP_PORTURL + '/file/' + id, {
            headers: { Authorization: `Bearer ${localStorage.getItem('id')}` },
          })
          .then((response) => {
            Swal.fire('Deleted!', 'Project deleted successfully.', 'success');
            console.log(response);
            setRefresh(!refresh);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  };

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpen = (project) => {
    setCode(project.code);
    setFileName(
      project.fileName.substring(0, project.fileName.lastIndexOf('.')),
    );
    setExt(project.fileName.split('.').slice(-1)[0]);
    if (project.fileName.split('.').slice(-1)[0] === 'java') {
      setLanguage('java');
    } else if (project.fileName.split('.').slice(-1)[0] === 'py') {
      setLanguage('python');
    } else if (project.fileName.split('.').slice(-1)[0] === 'cpp') {
      setLanguage('c_cpp');
    } else {
      setLanguage('javascript');
    }
    navigate('/');
  };

  return (
    <div className="project-list-container">
      <div className="title-bar">
        <h2 className="header">My Projects</h2>
        <div className="search-bar">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search..."
          />
          <FaSearch className="search-icon" />
        </div>
      </div>
      <div className="project-list">
        {/* Mapping through the list of projects and rendering each project */}
        {filteredProjects.map((project, index) => (
          <div key={index} className="project-row">
            <span style={{ cursor: 'pointer' }} className="project-name">
              {project.projectName}
            </span>{' '}
            <div className="icons">
              <FaEdit
                onClick={() => handleEdit(project.id)}
                className="edit-icon"
              />{' '}
              {/* Edit icon */}
              <FaTrash
                onClick={() => handleDelete(project.id)}
                className="delete-icon"
              />{' '}
              {/* Delete icon */}
              <FaExternalLinkAlt
                onClick={() => handleOpen(project)}
                className="open-icon"
              />{' '}
              {/* Open icon */}
            </div>
          </div>
        ))}
        {filteredProjects.length === 0 && (
          <div className="no-projects">No projects found.</div>
        )}
      </div>
    </div>
  );
}

export default MyProjectList;
