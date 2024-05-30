const axios = require('axios');

// Function to fetch profile data from the API
async function fetchProfileData(token) {
  try {
    // Define the API endpoint URL
    const apiUrl = 'https://backend-gethub-kot54pmj3q-et.a.run.app/api/profile';

    // Set up the Axios request configuration
    const config = {
      headers: {
        Authorization: `Bearer ${token}` // Include the access token in the Authorization header
      }
    };

    // Make a GET request to the API endpoint with Axios
    const response = await axios.get(apiUrl, config);

    // Return the data from the response
    return response.data;
  } catch (error) {
    // Handle any errors
    console.error('Error fetching profile data:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Token obtained after login
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNmMxYTBiOC02MzdkLTRiOTUtYTgyMS05YTk3OTQzOTE2YmYiLCJpYXQiOjE3MTY5NzkwNDYsImV4cCI6MTc0ODUxNTA0Nn0.ZawVrIm_NdG9ZblD2aMeHn0vFLV5RNYu_TrK0lrHCj0';

// Call the function to fetch profile data
const data = fetchProfileData(accessToken)
  .then(profileData => {
    // Handle the profile data
    console.log('Profile data:', profileData);
  })
  .catch(error => {
    // Handle any errors that occurred during fetching
    console.error('Error fetching profile data:', error);
  });


console.log(data)