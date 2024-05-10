import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logobg.png';
import './Login.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conformPassword, setConformPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (event) => {
    event.preventDefault();
    if (password === conformPassword) {
      axios
        .post(process.env.REACT_APP_PORTURL + '/auth/signup', {
          email,
          password,
        })
        .then((res) => {
          navigate('/login');
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    } else {
      alert('Passwords do not match');
      setPassword('');
      setConformPassword('');
      return;
    }
    setEmail('');
    setPassword('');
    setConformPassword('');
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
                <form onSubmit={handleSignUp}>
                  <center>
                    <h2>Sign Up</h2>
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
                        type="password"
                        id="form3Example4"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-outline mb-4">
                    <label
                      className="form-label w-100 text-start"
                      htmlFor="form3Example5"
                    >
                      Confirm Password
                    </label>
                    <div className="input-group">
                      <input
                        type="password"
                        id="form3Example5"
                        className="form-control"
                        value={conformPassword}
                        onChange={(e) => setConformPassword(e.target.value)}
                        required
                      />
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
                          Sign up
                        </button>
                      </div>
                    </div>
                  </div>
                  <a style={{ color: '#333333' }} href="/login">
                    Already have an account? Login
                  </a>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
