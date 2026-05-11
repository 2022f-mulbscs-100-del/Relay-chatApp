
import SideBar from "./Component/SideBar";
import ErrorBoundary from "./ErrorHandler/ErrorHandler";
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    return (

        <>
            <div className="flex bg-white dark:bg-slate-900 min-h-screen transition-colors duration-200">
                <ErrorBoundary>
                    <SideBar />
                </ErrorBoundary>
                <div className="flex-1 pl-[80px]">
                    {children}
                </div>

            </div>
        </>
    );
};

export default LayoutWrapper;