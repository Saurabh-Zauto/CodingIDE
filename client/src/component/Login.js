import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../logobg.png';
import './Login.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    axios
      .post(process.env.REACT_APP_PORTURL + '/auth/signin', { email, password })
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem('id', res.data.token);
          navigate('/');
          window.location.reload();
        } else {
          alert('Invalid Credentials');
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setEmail('');
    setPassword('');
  };

  return (
    <section className="background-radial-gradient">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
        className="p-5"
      >
        <div className="row gx-lg-5 align-items-center">
          <div
            onClick={() => navigate('/')}
            className="col-lg-6 mb-lg-0"
            style={{ zIndex: 10, cursor: 'pointer' }}
          >
            <img src={logo} className="w-50" alt="" />
            <h2
              className="mt-2 display-5 fw-bold ls-tight"
              style={{ color: '#B9B9B9' }}
            >
              An Online Coding Platform
            </h2>
          </div>

          <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
            <div
              id="radius-shape-1"
              className="position-absolute rounded-circle shadow-5-strong"
            ></div>
            <div
              id="radius-shape-2"
              className="position-absolute shadow-5-strong"
            ></div>

            <div className="card bg-glass">
              <div className="card-body px-4 py-5 px-md-5">
                <form onSubmit={handleLogin}>
                  <center>
                    <h2>Login</h2>
                  </center>
                  <div className="form-outline mb-4 ms-0">
                    <label
                      className="form-label w-100 text-start"
                      htmlFor="form3Example3"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      id="form3Example3"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <label
                      className="form-label w-100 text-start"
                      htmlFor="form3Example4"
                    >
                      Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="form3Example4"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        className="btn"
                        style={{ background: '#333333', color: 'white' }}
                        type="button"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="container">
                    <div className="row justify-content-center">
                      <div className="col-auto">
                        <button
                          type="submit"
                          style={{ background: '#333333', color: 'white' }}
                          className="btn btn-block mb-4"
                        >
                          Login
                        </button>
                      </div>
                    </div>
                  </div>
                  <a style={{ color: '#333333' }} href="/signup">
                    Don't have an account? Sign up
                  </a>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
