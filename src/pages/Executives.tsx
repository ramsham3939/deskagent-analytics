
import React from 'react';
import ExecutivesTable from '@/components/ExecutivesTable';
import { executives } from '@/utils/mockData';

const Executives = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Call Center Executives</h1>
        <p className="text-muted-foreground">
          Manage and monitor executive performance
        </p>
      </div>
      
      <ExecutivesTable executives={executives} />
    </div>
  );
};

export default Executives;
