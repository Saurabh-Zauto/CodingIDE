import React from 'react';
import { Layout } from 'antd';
import MySidebar from './Sidebar';
import MyProjectList from './ProjectList';
const { Sider } = Layout;

function MyProject({
  code,
  setCode,
  language,
  setLanguage,
  fileName,
  setFileName,
  ext,
  setExt,
  input,
  setInput,
  output,
  setOutput,
}) {
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
      <div style={{ width: '100%', height: '100%' }}>
        <MyProjectList
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={setLanguage}
          fileName={fileName}
          setFileName={setFileName}
          ext={ext}
          setExt={setExt}
          input={input}
          setInput={setInput}
          output={output}
          setOutput={setOutput}
        />
      </div>
    </Layout>
  );
}

export default MyProject;
