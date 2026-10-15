const https = require('https');

const redirectUrl = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQH-KePw9acHtDHk3OMOyRN7nBiFa0TI57KjUzq4KFyWUEWcFm2XnKY1Y0wGwPjipE9jQIn3TQpuu4dhfRHxtUvNpS6nuxXkkWd8nsrtAh2dBnRc5tke4qvs-NzUPW5J3MsP2-EhXqzlMD4QYt31bcJuy4qBAVVSyammz5-jDAxfADA9bye2T7SviCZkURQ8pCBJ4__3bV9Wn7RS';

https.get(redirectUrl, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Location:', res.headers.location);
});
