import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex items-center justify-center px-4 transition-colors duration-200">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">Relay</p>
        <h1 className="text-3xl font-semibold mt-3">Page not found</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">The page you're looking for doesn't exist.</p>
        <button
          className="mt-5 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition"
          onClick={() => navigate("/")}
        >
          Go home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
