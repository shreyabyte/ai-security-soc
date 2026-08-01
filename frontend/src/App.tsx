import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Layout } from './components/layout/Layout';

// Pages
import Overview from './pages/Overview';
import LiveLogs from './pages/LiveLogs';
import Alerts from './pages/Alerts';
import ThreatIntelligence from './pages/ThreatIntelligence';
import Servers from './pages/Servers';
import AIInvestigation from './pages/AIInvestigation';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center">
      <h1 className="text-4xl font-bold font-mono text-destructive mb-2">404</h1>
      <p className="text-muted-foreground uppercase tracking-widest">Sector Not Found</p>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Overview} />
        <Route path="/live-logs" component={LiveLogs} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/threat-intelligence" component={ThreatIntelligence} />
        <Route path="/servers" component={Servers} />
        <Route path="/ai-investigation" component={AIInvestigation} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/reports" component={Reports} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
      <Toaster theme="dark" position="bottom-right" className="font-sans" />
    </QueryClientProvider>
  );
}

export default App;