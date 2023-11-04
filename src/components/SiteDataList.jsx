import React, { useState, useEffect } from "react";
import "./electrician.css";
const SiteDataList = () => {
  const [siteData, setSiteData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [count, setCount] = useState(1);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/sitedata")
      .then((response) => response.json())
      .then((data) => {
        setSiteData(data);
        const combined = data.map((site) => ({ ...site, dateInput: "" }));
        setCombinedData(combined);
      })
      .catch((error) => console.error("Error fetching site data:", error));
  }, []);

  const handleDateInputChange = (index, date) => {
    const updatedCombinedData = [...combinedData];
    updatedCombinedData[index].dateInput = date;
    setCombinedData(updatedCombinedData);
  };

  const sendCombinedDataToBackend = () => {
    fetch("http://localhost:5000/api/updatesites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(combinedData),
    })
      .then((response) => response.json())
      .then((responseData) => {
       
        setData(responseData);
        setCount(2);
      })
      .catch((error) =>
        console.error("Error sending data to the backend:", error)
      );
  };
  return (
    <div>
      <h2>Sites Data</h2>
      {count == 1 ? (
        <button onClick={sendCombinedDataToBackend}>Auto Complete</button>
      ) : (
        <button onClick={() => setCount(1)}>back</button>
      )}
      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>City</th>
            <th>Assigned Electrician</th>
            <th>Installation Date</th>
            <th>Grievance</th>
            <th>Date Input</th>
          </tr>
        </thead>
        {count == 1 ? (
          <tbody>
            {combinedData.map((site, index) => (
              <tr key={index}>
                <td>{site.name}</td>
                <td>{site.phone}</td>
                <td>{site.city}</td>
                <td>{site.AssignedElectrician}</td>
                <td>{site.InstallationDate}</td>
                <td>{site.grievance ? "Yes" : "No"}</td>
                <td>
                  <input
                    type="date"
                    value={site.dateInput || ""}
                    onChange={(e) =>
                      handleDateInputChange(index, e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            {data.map((site, index) => (
              <tr key={index}>
                <td>{site.name}</td>
                <td>{site.phone}</td>
                <td>{site.city}</td>
                <td>
                  {site.AssignedElectritian &&
                  site.AssignedElectritian.length > 0 ? (
                    <ul>
                      {site.AssignedElectritian.map((electrician, eIndex) => (
                        <li key={eIndex}>
                          Electrician: {electrician.name}, Date:{" "}
                          {electrician.date}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No Assigned Electrician"
                  )}
                </td>
                <td>{site.InstallationDate}</td>

                <td>{site.grievance ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default SiteDataList;
