import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import MyContent from './Content';
import MyHeader from './Header';
import MySidebar from './Sidebar';
import MyFooter from './Footer';

const { Header, Footer, Sider, Content } = Layout;

const contentStyle = {
  color: '#fff',
  backgroundColor: '#333333',
  height: '55%',
  margin: '0px',
  padding: '0px',
};

function MainLayout({
  defaultCodes,
  language,
  setLanguage,
  code,
  setCode,
  fileName,
  setFileName,
  ext,
  setExt,
  input,
  setInput,
  output,
  setOutput,
  activeTab,
  setActiveTab,
  handleTabClick,
}) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    setTheme(prefersDarkMode ? 'dark' : 'light');
  }, []);

  const headerStyle = {
    color: '#fff',
    padding: '10px',
    backgroundColor: '#333333',
  };
  const siderStyle = {
    color: '#F0F0F0',
    backgroundColor: '#333333',
    borderRight: '1px solid black',
  };
  const footerStyle = {
    color: '#fff',
    height: '35%',
    backgroundColor: '#333333',
    padding: '0',
  };

  return (
    <div>
      <Layout style={{ overflow: 'hidden', width: '100%', height: '100vh' }}>
        <Sider width="15%" style={siderStyle}>
          <MySidebar />
        </Sider>
        <Layout>
          <Header style={headerStyle}>
            <MyHeader
              defaultCodes={defaultCodes}
              language={language}
              setLanguage={setLanguage}
              theme={theme}
              setTheme={setTheme}
              setCode={setCode}
              code={code}
              setExt={setExt}
              fileName={fileName}
              ext={ext}
              input={input}
              setInput={setInput}
              output={output}
              setOutput={setOutput}
              handleTabClick={handleTabClick}
            />
          </Header>
          <Content style={contentStyle}>
            <MyContent
              fileName={fileName}
              setFileName={setFileName}
              ext={ext}
              setExt={setExt}
              language={language}
              code={code}
              setCode={setCode}
              theme={theme}
              input={input}
              setInput={setInput}
              output={output}
              setOutput={setOutput}
            />
          </Content>
          <Footer style={footerStyle}>
            <MyFooter
              input={input}
              setInput={setInput}
              output={output}
              setOutput={setOutput}
              activeTab={activeTab}
              handleTabClick={handleTabClick}
            />
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default MainLayout;
