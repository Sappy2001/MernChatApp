import { ColorModeScript, theme } from "@chakra-ui/react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import { ChakraProvider } from "@chakra-ui/react";

import ChatPage from "./Pages/ChatPage";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ChatProvider from "./Context/chatProvider";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
const router = createBrowserRouter([
	{
		//initial path would be home evenif after "/" is empty
		path: "/",
		element: (
			<ChatProvider>
				<App />
			</ChatProvider>
		),
		children: [
			{
				path: "home",
				element: <HomePage />,
			},
			{
				path: "chats",
				element: <ChatPage />,
			},
		],
	},
]);

root.render(
	<>
		<ChakraProvider theme={theme}>
			<ColorModeScript />
			<RouterProvider router={router} />

			{/* not nesting it here because inside router chatProvider wraps:App compnt
      <ChatProvider>
          <App />
        </ChatProvider> */}
		</ChakraProvider>
	</>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
