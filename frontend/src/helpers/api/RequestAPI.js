export const fetchAPI = async(url, method, token, body) => {

    var options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: null
    }

    if (body)
        options.body = JSON.stringify(body);

    const res = await fetch(`${ process.env.REACT_APP_API_URL }/api/v1/${ url }`, options);

    console.log(`[API] [${ new Date().toLocaleString(navigator.language,  { hour: '2-digit', minute:'2-digit', second:'2-digit' })}] [${ method }] /${ url } (${ res.status })`)
    const json = await res.json();

    if (json.error)
        throw new Error(json.message);

    return json;
}