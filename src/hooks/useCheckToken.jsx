export function useCheckToken(response) {

    // Check if the response status is 401 (Unauthorized)
    if (response.status === 401) {
        return null;  // Return null to indicate an invalid response
    }

    // Otherwise, return the parsed JSON response
    return response.json();
}
