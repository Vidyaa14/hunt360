if (process.env.NODE_ENV !== 'PRODUCTION') {
    const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

    setInterval(() => {
        const timestamp = new Date().toISOString();
        fetch(`${SERVER_URL}/health`)
            .then(res => {
                console.log(`[${timestamp}] :: Keep-alive ping sent. Status: ${res.status}`);
            })
            .catch(err => {
                console.error(`[${timestamp}] :: Keep-alive ping failed:`, err.message);
            });
    }, 1 * 60 * 1000);
}
