import { Route, Routes } from 'react-router-dom';
import './App.css';
import MainLayout from './component/Layout';
import Login from './component/Login';
import MyProject from './component/Project';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import KeyBind from './component/KeyBind';
import Swal from 'sweetalert2';
import SignUp from './component/SignUp';

function App() {
  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const defaultCodes = {
    java: `
public class Main
{
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}
`,
    c_cpp: `
#include <stdio.h>

int main()
{
  printf("Hello World");
  return 0;
}
    `,
    python: `print('Hello World')`,
    javascript: `console.log('Hello World')`,
  };
  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState(defaultCodes.java);
  const [fileName, setFileName] = useState('Main');
  const [ext, setExt] = useState('java');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [shortcut, setShortcut] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const ctrlPressed = useRef(false);

  const handleSave = () => {
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
        setOutput(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
  const handleBeforeUnload = (event) => {
    if (code !== defaultCodes[language]) {
      const confirmationMessage =
        'You have unsaved changes. Are you sure you want to leave?';
      event.returnValue = confirmationMessage;
      return confirmationMessage;
    }
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

  const handleStop = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Operation canceled by the user.');
      setCancelTokenSource(null);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup: Cancel ongoing requests and remove event listeners
      if (cancelTokenSource) {
        cancelTokenSource.cancel('Operation canceled by the user.');
      }
    };
  }, [cancelTokenSource]);

  useEffect(() => {
    const token = localStorage.getItem('id');
    axios
      .get(process.env.REACT_APP_PORTURL + '/shortcut', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setShortcut(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (event.ctrlKey &&
          (shortcut.some((shortcut) => {
            if (event.key === 'Ctrl' || event.key === 'Alt') {
              return false;
            }
            return (
              shortcut.combination.toLowerCase().includes('Ctrl') &&
              shortcut.combination
                .toLowerCase()
                .endsWith(event.key.toLowerCase())
            );
          }) ||
            shortcut.some((shortcut) => {
              if (
                String.fromCharCode(event.keyCode) === 'Ctrl' ||
                String.fromCharCode(event.keyCode) === 'Alt'
              ) {
                return false;
              }
              return (
                shortcut.combination.toLowerCase().includes('Ctrl') &&
                shortcut.combination
                  .toLowerCase()
                  .endsWith(String.fromCharCode(event.keyCode).toLowerCase())
              );
            }))) ||
        (event.altKey &&
          (shortcut.some((shortcut) => {
            if (event.key === 'Ctrl' || event.key === 'Alt') {
              return false;
            }
            return (
              shortcut.combination.toLowerCase().includes('Alt') &&
              shortcut.combination
                .toLowerCase()
                .endsWith(event.key.toLowerCase())
            );
          }) ||
            shortcut.some((shortcut) => {
              if (
                String.fromCharCode(event.keyCode) === 'Ctrl' ||
                String.fromCharCode(event.keyCode) === 'Alt'
              ) {
                return false;
              }
              return (
                shortcut.combination.toLowerCase().includes('Alt') &&
                shortcut.combination
                  .toLowerCase()
                  .endsWith(String.fromCharCode(event.keyCode).toLowerCase())
              );
            })))
      ) {
        event.preventDefault();
        ctrlPressed.current = true;
        console.log('Matched', event.keyCode, event.key);
      }

      const keyPressed = event.key;
      const modifiers = [];

      if (event.ctrlKey) modifiers.push('Ctrl');
      if (event.altKey) modifiers.push('Alt');
      if (event.shiftKey) modifiers.push('Shift');

      const combination = [...modifiers, keyPressed].join(' + ');
      const matchedShortcut = shortcut.find(
        (shortcut) => shortcut.combination === combination,
      );

      if (matchedShortcut) {
        if (matchedShortcut.action === 'run') {
          handleRun();
        } else if (matchedShortcut.action === 'save') {
          handleSave();
        } else if (matchedShortcut.action === 'upload') {
          handleUpload();
        } else if (matchedShortcut.action === 'download') {
          handleDownload();
        } else if (matchedShortcut.action === 'stop') {
          handleStop();
        } else if (matchedShortcut.action === 'new') {
          window.location.reload();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line
  }, [shortcut]);

  const [activeTab, setActiveTab] = useState('input');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="App" style={{ height: '100vh' }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <MainLayout
              language={language}
              code={code}
              setLanguage={setLanguage}
              setCode={setCode}
              defaultCodes={defaultCodes}
              fileName={fileName}
              setFileName={setFileName}
              ext={ext}
              setExt={setExt}
              input={input}
              setInput={setInput}
              output={output}
              setOutput={setOutput}
              handleTabClick={handleTabClick}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          }
        />
        <Route
          path="/project"
          element={
            <MyProject
              language={language}
              code={code}
              setLanguage={setLanguage}
              setCode={setCode}
              ext={ext}
              setExt={setExt}
              fileName={fileName}
              setFileName={setFileName}
              input={input}
              setInput={setInput}
              output={output}
              setOutput={setOutput}
            />
          }
        />
        <Route
          path="/keybind"
          element={
            <KeyBind
              tableData={shortcut}
              setRefresh={setRefresh}
              refresh={refresh}
            />
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
