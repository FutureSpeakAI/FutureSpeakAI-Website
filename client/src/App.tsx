import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import About from "@/pages/about";
import Framework from "@/pages/framework";
import AgentFriday from "@/pages/agent-friday";
import ClawSpec from "@/pages/claw-spec";
import Certification from "@/pages/certification";
import Declaration from "@/pages/declaration";
import Consulting from "@/pages/consulting";
import Writing from "@/pages/writing";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/framework" component={Framework} />
      <Route path="/framework/claw-spec" component={ClawSpec} />
      <Route path="/framework/agent-friday" component={AgentFriday} />
      <Route path="/framework/certification" component={Certification} />
      <Route path="/framework/declaration" component={Declaration} />
      <Route path="/consulting" component={Consulting} />
      <Route path="/about" component={About} />
      <Route path="/writing" component={Writing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
