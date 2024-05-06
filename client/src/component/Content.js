import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github_dark';
import 'ace-builds/src-noconflict/theme-chrome';
import React, { useRef } from 'react';

function MyContent({
  fileName,
  setFileName,
  ext,
  setExt,
  language,
  code,
  setCode,
  theme,
}) {
  const fileNameRef = useRef(null);

  const handleFileNameChange = () => {
    const newFileName = fileNameRef.current.innerText;
    if (newFileName.length === 0) {
      setFileName('Untitled');
    } else {
      setFileName(newFileName);
    }
  };

  const handleFileNameKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fileNameRef.current.blur();
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="text-start">
        <div
          style={{
            background: 'white',
            color: 'black',
            padding: '0 10px',
            borderRadius: '5px 5px 0px 0px',
            width: 'fit-content',
          }}
        >
          <span
            ref={fileNameRef}
            onBlur={handleFileNameChange}
            onKeyPress={handleFileNameKeyPress}
            contentEditable
            suppressContentEditableWarning
            style={{ border: 'none', outline: 'none', cursor: 'text' }}
          >
            {fileName}
          </span>
          <span>.{ext}</span>
        </div>
      </div>
      <AceEditor
        setOptions={{
          useWorker: false,
        }}
        mode={language}
        theme={theme === 'dark' ? 'github_dark' : 'chrome'}
        onChange={(newCode) => setCode(newCode)}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
        value={code}
        fontSize={14}
        height="95%"
        width="100%"
      />
    </div>
  );
}

export default MyContent;
