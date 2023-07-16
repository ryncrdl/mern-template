import { useEffect, useState } from 'react';
import { Roles } from '../../config/Roles';
import { selectUsers, useAddNewUserMutation } from './usersApiSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const USER_REGEX = /^[a-z]{3,20}$/;
const PASS_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const UserAdd = () => {
  const [addNewNote, { isLoading, isError, error }] = useAddNewUserMutation();
  const users = useSelector(selectUsers);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [retypePassword, setRetypePassword] = useState('');
  const [role, setRole] = useState('');

  const onSaveNewUser = async (e) => {
    e.preventDefault();

    if (canSave && !isLoading && !invalidUsername) {
      await addNewNote({ username, password, role });
      navigate('/dash/users');
    }
  };

  const options = Object.values(Roles).map((role) => (
    <option key={role} value={role}>
      {role}
    </option>
  ));

  let invalidUsername;
  if (users) {
    users.map((user) =>
      user.username === username
        ? (invalidUsername = (
            <p key={username} className="errMessage">
              {username} is already exists
            </p>
          ))
        : null
    );
  }

  const canSave =
    [
      username,
      validUsername,
      password,
      password === retypePassword,
      role,
    ].every(Boolean) &&
    !isError &&
    !invalidUsername;

  useEffect(() => {
    if (USER_REGEX.test(username)) {
      setValidUsername(true);
    } else {
      setValidUsername(false);
    }

    if (PASS_REGEX.test(password)) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }
  }, [username, password]);

  return (
    <main className="user_add">
      <h1 className="user_add_title">Add User</h1>

      {isLoading && <div className="dots"></div>}
      {isError && <p className="errMessage">{error?.data?.message}</p>}
      {!isLoading && !isError && (
        <form onSubmit={(e) => onSaveNewUser(e)}>
          <div className="input_field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              autoComplete="off"
            />
            {!validUsername && (
              <p className="errMessage">3 - 20 Length & Small Letter Only</p>
            )}
            {invalidUsername}
          </div>
          <div className="input_field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              autoComplete="off"
            />
            {!validPassword && <p className="errMessage">4 - 12 Length</p>}
          </div>
          <div className="input_field">
            <label htmlFor="retype_password">Retype Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              id="retype_password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.currentTarget.value)}
              autoComplete="off"
            />
            {password !== retypePassword && (
              <p className="errMessage">Password doesn't match.</p>
            )}
          </div>
          <div className="input_field">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.currentTarget.value)}
            >
              <option value="">Select Role</option>
              {options}
            </select>
          </div>
          <button
            type="submit"
            disabled={!canSave}
            style={!canSave ? { background: 'var(--color-6)' } : null}
          >
            Save
          </button>
        </form>
      )}
    </main>
  );
};

export default UserAdd;
