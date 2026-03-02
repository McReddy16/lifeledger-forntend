import { useEffect, useState } from "react";
import { searchJournalEntries, getJournalMeta } from "../api/financeApi";
import { getDashboardTasks } from "../api/taskApi";
import ExpensePieChart from "../components/ExpensePieChart";
import TaskPerformanceCards from "../components/TaskPerformanceCards";
import "../styles/performance.css";

export default function Performance() {

  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadFinance();
    loadTasks();
  }, []);

  const loadFinance = async () => {
    const response = await searchJournalEntries({}, 0, 1000);
    const data = response.content || response;
    const metaData = await getJournalMeta();

    setTransactions(data);
    setMeta(metaData);
  };

  const loadTasks = async () => {
    const taskData = await getDashboardTasks({});
    setTasks(taskData);
  };

  if (!meta) return <p>Loading...</p>;

  return (
    <div className="performance-container">
      <h2 className="performance-title">PERFORMANCE ANALYTICS</h2>

      <div className="performance-top">
        <TaskPerformanceCards tasks={tasks} />
      </div>

      <div className="performance-bottom">
        <ExpensePieChart
          transactions={transactions}
          meta={meta}
        />
      </div>
    </div>
  );
}