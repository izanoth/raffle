import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { Checkout } from './pages/Checkout/index.jsx';
import { Success } from './pages/Success/index.jsx';
import { Login } from './pages/Admin/Login.jsx';
import { Panel } from './pages/Admin/Panel.jsx';
import { Hasher } from './pages/Admin/Hasher.jsx';
import { List } from './pages/Admin/List.jsx';
import { NotFound } from './pages/_404.jsx';
import '@styles';

export function App() {
	return (
		<LocationProvider>
			<Header />
			<main>
				<Router>
					<Route path="/" component={Home} />
					<Route path="/checkout" component={Checkout} />
					<Route path="/success" component={Success} />
					<Route path="/admin" component={Login} />
					<Route path="/admin/panel" component={Panel} />
					<Route path="/admin/hasher" component={Hasher} />
					<Route path="/admin/list" component={List} />
					<Route default component={NotFound} />
				</Router>
			</main>
		</LocationProvider>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}
