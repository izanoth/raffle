import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';
import { Analytics } from '@vercel/analytics/react';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { Checkout } from './pages/Checkout/index.jsx';
import { Success } from './pages/Success/index.jsx';
import { Login } from './pages/Admin/Login.jsx';
import { Panel } from './pages/Admin/Panel.jsx';
import { Hasher } from './pages/Admin/Hasher.jsx';
import { List } from './pages/Admin/List.jsx';
import { SuccessPreview } from './pages/Admin/SuccessPreview.jsx';
import { Raffles } from './pages/Admin/Raffles.jsx';
import { Maintenance } from './pages/Maintenance.jsx';
import { Finished } from './pages/Finished.jsx';
import { NotFound } from './pages/_404.jsx';
import { useState, useEffect } from 'preact/hooks';
import '@styles';

export function App() {
	const [appState, setAppState] = useState({
		loading: true,
		maintenance: false,
		hasActiveRaffle: false,
		hasFinishedRaffle: false
	});

	useEffect(() => {
		const checkState = async () => {
			try {
				const response = await fetch('/api/app-state');
				const data = await response.json();
				setAppState({
					loading: false,
					maintenance: data.maintenance,
					hasActiveRaffle: data.hasActiveRaffle,
					hasFinishedRaffle: data.hasFinishedRaffle
				});
			} catch (e) {
				console.error('Failed to check app state');
				setAppState(prev => ({ ...prev, loading: false }));
			}
		};
		checkState();
	}, []);

	if (appState.loading) return null;

	// Global redirect logic for non-admin routes
	const isAtAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
	
	if (!isAtAdmin) {
		if (appState.maintenance) return <Maintenance />;
		
		// If no active raffle, decide between Finished or Maintenance
		if (!appState.hasActiveRaffle) {
			if (appState.hasFinishedRaffle) {
				// We allow the router to handle /finished, 
				// but if they are at /, we'll show Finished
				if (typeof window !== 'undefined' && window.location.pathname === '/') {
					return <Finished />;
				}
			} else {
				// No active, no finished -> show maintenance anyway or a "Coming Soon"
				return <Maintenance />;
			}
		}
	}

	return (
		<LocationProvider>
			<Header />
			<main>
				<Router>
					<Route path="/" component={Home} />
					<Route path="/checkout" component={Checkout} />
					<Route path="/success" component={Success} />
					<Route path="/finished" component={Finished} />
					<Route path="/admin" component={Login} />
					<Route path="/admin/panel" component={Panel} />
					<Route path="/admin/hasher" component={Hasher} />
					<Route path="/admin/list" component={List} />
					<Route path="/admin/success-preview" component={SuccessPreview} />
					<Route path="/admin/raffles" component={Raffles} />
					<Route default component={NotFound} />
				</Router>
			</main>
			<Analytics />
		</LocationProvider>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}
