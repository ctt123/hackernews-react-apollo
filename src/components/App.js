import React from 'react';
import CreateLink from './CreateLink';
import Header from './Header';
import LinkList from './LinkList';
import Login from './Login';
import Search from './Search';

import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
      <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Routes>
            <Route path="/" element={<LinkList/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route
                path="/create"
                element={<CreateLink/>}
            />
              <Route path="/search"element={<Search/>}/>
          </Routes>

        </div>
      </div>
  );
};

export default App;