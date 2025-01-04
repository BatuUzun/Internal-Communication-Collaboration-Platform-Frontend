  // components/SearchUserProfiles.jsx
  import React, { useState } from 'react';
  import { searchUserProfiles } from '../services/api';

  const SearchUserProfiles = () => {
    const [username, setUsername] = useState('');
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
      if (!username.trim()) {
        alert('Please enter a username');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await searchUserProfiles(username);
        setProfiles(data);
      } catch (err) {
        setError(err.message || 'An error occurred while searching profiles.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div>
        <h1>Search User Profiles</h1>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {profiles.length > 0 && (
          <div>
            <h2>Results</h2>
            <ul>
              {profiles.map((profile) => (
                <li key={profile.id}>
                  <img
                    src={profile.profileImage}
                    alt={`${profile.username}'s profile`} // Fixed: Using correct template literal syntax
                    width="50"
                  />
                  <span>{profile.username}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  export default SearchUserProfiles;
