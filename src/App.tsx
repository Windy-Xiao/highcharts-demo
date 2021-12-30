import React from 'react';
import {QueryClient, QueryClientProvider} from "react-query";
import Charts from "./pages/charts/Charts";

const queryClient = new QueryClient()

const App = ()=> {
  return (
    <QueryClientProvider client={queryClient}>
      <Charts/>
    </QueryClientProvider>
  );
}

export default App;
