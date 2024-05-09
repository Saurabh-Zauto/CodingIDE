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

  const ctrlRPressed = useRef(false);
  const ctrlSPressed = useRef(false);

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

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_PORTURL + '/shortcut')
      .then((res) => {
        setShortcut(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && (event.key === 'r' || event.keyCode === 82)) {
        ctrlRPressed.current = true;
        event.preventDefault();
      } else if (event.ctrlKey && (event.key === 's' || event.keyCode === 83)) {
        ctrlSPressed.current = true;
        event.preventDefault();
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
        if (matchedShortcut.action === 'Save' && ctrlSPressed.current) {
          handleSave();
          ctrlSPressed.current = false;
          return;
        } else if (matchedShortcut.action === 'Run' && ctrlRPressed.current) {
          handleRun();
          ctrlRPressed.current = false;
          return;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSave, handleRun, shortcut]);

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
          element={<KeyBind tableData={shortcut} />}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
