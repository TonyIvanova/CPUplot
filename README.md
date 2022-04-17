# CPUplot
## About The App
This app displays plot for average CPU usage of AWS instance. 


### Built With
* [Node.js](https://nodejs.org/)
* [React.js](https://reactjs.org/)
* [Express.js](https://expressjs.com/)
* [AWS SDK](https://aws.amazon.com/sdk-for-javascript/)
* [Charts.js React](https://www.npmjs.com/package/react-chartjs-2)

## Getting Started

1. Install server and client dependencies;
```sh 
cd client
npm install
cd ../server
npm install 
```
2. create and configure .env file 
```js
ACCESSKEYID={Access Key ID}
SECRETACCESSKEY={Secret Access Key}
REGION={AWS region}
```
3. spin up the server from server repository

``` js
node start 
```
4. run client side from client repository 
``` 
npm start 
```
