# Express and react boilerplate

How to get started serving a react app through express. I plan on using this to try and implement express-session later.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Based on my SSO-server boilerplate

The /server directory is for serving the react bundle, generate it using the `build` command found in /package.json and then running the express server only by moving to the /server directory and using `npm run start`.

For development you need to use the webpack dev server for now so run `npm run start` from /server/package.json and then `npm run start` from /package.json which the latter will start the webpack dev server and prompt you to pick another port (because /server is already running on port 3000), pick yes and disregard this alternate port (likely 3001) and instead use the express port 3000 instead - Express handles the primary routing and provides an API to perform requests on behalf of the react app when API authentication is required and you cant put the key on the client. React router dom will take care of the rest of the web app routing within react which is bundled with react when its built.

The reason for this double port workaround is because we want the webpack dev server to watch the react files during development and im too lazy to eject it and implement nodemon instead (its just easier to do it this way).

TLDR: run express and WDS **separately** in development on different ports by running them individually. In production run just Express start in development after building the bundle.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
