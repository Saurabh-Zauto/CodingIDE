import React, { useEffect, useState } from 'react';
import './Header.css';
import Swal from 'sweetalert2';
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  MoonOutlined,
  PlayCircleOutlined,
  SaveOutlined,
  StopOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Select } from 'antd';
import axios from 'axios';

function MyHeader({
  defaultCodes,
  language,
  theme,
  setLanguage,
  setTheme,
  code,
  setCode,
  setExt,
  fileName,
  ext,
  input,
  setInput,
  output,
  setOutput,
  handleTabClick,
}) {
  const [cancelTokenSource, setCancelTokenSource] = useState(null);

  useEffect(() => {
    return () => {
      // Cleanup: Cancel ongoing requests and remove event listeners
      if (cancelTokenSource) {
        cancelTokenSource.cancel('Operation canceled by the user.');
      }
    };
  }, [cancelTokenSource]);

  const handleStop = () => {
    // Cancel ongoing requests
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Operation canceled by the user.');
      setCancelTokenSource(null); // Reset cancel token source
    }
  };

  const handleBeforeUnload = (event) => {
    if (code !== defaultCodes[language]) {
      const confirmationMessage =
        'You have unsaved changes. Are you sure you want to leave?';
      event.returnValue = confirmationMessage;
      return confirmationMessage;
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [code, defaultCodes]);

  const handleLanguageChange = (value) => {
    if (value === 'java') {
      setCode(defaultCodes.java);
      setLanguage('java');
      setExt('java');
    } else if (value === 'python') {
      setCode(defaultCodes.python);
      setLanguage('python');
      setExt('py');
    } else if (value === 'c_cpp') {
      setCode(defaultCodes.c_cpp);
      setLanguage('c_cpp');
      setExt('cpp');
    } else {
      setCode(defaultCodes.javascript);
      setLanguage('javascript');
      setExt('js');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    language === 'java'
      ? (a.download = 'Main.java')
      : language === 'python'
        ? (a.download = 'code.py')
        : language === 'c_cpp'
          ? (a.download = 'code.cpp')
          : (a.download = 'code.js');
    a.click();
    URL.revokeObjectURL(url);
    let timerInterval;
    Swal.fire({
      icon: 'success',
      iconColor: '#333333',
      title: 'File Downloaded Successfully',
      confirmButtonColor: '#333333',
      timer: 1500,
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
  };

  const handleUpload = () => {
    handleBeforeUnload();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.java, .py, .cpp, .js, .txt';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
        let timerInterval;
        Swal.fire({
          icon: 'success',
          iconColor: '#333333',
          title: 'File Uploaded Successfully',
          confirmButtonColor: '#333333',
          timer: 1500,
          willClose: () => {
            clearInterval(timerInterval);
          },
        });
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleSave = () => {
    Swal.fire({
      title: 'Enter project name',
      input: 'text',
      inputLabel: 'Project Name',
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
        processSave(projectName);
      }
    });
  };

  const processSave = (projectName) => {
    const token = localStorage.getItem('id');
    axios
      .post(
        process.env.REACT_APP_PORTURL + '/file',
        {
          projectName,
          fileName: fileName + '.' + ext,
          code,
          token,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        let timerInterval;
        Swal.fire({
          icon: 'success',
          iconColor: '#333333',
          title: 'File Saved Successfully',
          confirmButtonColor: '#333333',
          timer: 1500,
          willClose: () => {
            clearInterval(timerInterval);
          },
        });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRun = () => {
    setOutput('');
    handleTabClick('output');
    const source = axios.CancelToken.source(); // Create a new cancel token source
    setCancelTokenSource(source);

    axios
      .post(process.env.REACT_APP_PORTURL + '/code', {
        code,
        language,
        fileName,
        input,
      })
      .then((res) => {
        console.log(res.data);
        setOutput(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          gap: '10px',
        }}
      >
        <button onClick={handleRun} className="btn btn-success">
          <PlayCircleOutlined />
          {'   '} Run
        </button>
        <button onClick={handleStop} className="btn btn-danger">
          <StopOutlined />
          {'   '} Stop
        </button>
        <button onClick={handleSave} className="btn btn-primary">
          <SaveOutlined />
          {'   '} Save
        </button>
        <button onClick={handleDownload} className="btn btn-download">
          <CloudDownloadOutlined />
          {'   '}Download
        </button>
        <button onClick={handleUpload} className="btn btn-upload">
          <CloudUploadOutlined />
          {'   '}Upload
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '10px',
        }}
      >
        <div>
          <Select
            defaultValue={language}
            style={{ width: 200 }}
            onChange={handleLanguageChange}
            options={[
              { value: 'java', label: 'Java' },
              { value: 'c_cpp', label: 'C++' },
              { value: 'python', label: 'Python' },
              { value: 'javascript', label: 'JavaScript' },
            ]}
          />
        </div>
        {/* <div
          style={{ display: 'grid', placeItems: 'center' }}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'dark' ? (
            <SunOutlined style={{ fontSize: '25px' }} />
          ) : (
            <MoonOutlined style={{ fontSize: '25px' }} />
          )}
        </div> */}
      </div>
    </div>
  );
}

export default MyHeader;
