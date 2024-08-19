import React, { useState, useEffect } from 'react';

function Request() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:8080/api/create');
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading && <p>Loading data...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && (
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default Request;

