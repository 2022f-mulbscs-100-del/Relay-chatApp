
import SideBar from "./Component/SideBar";
import ErrorBoundary from "./ErrorHandler/ErrorHandler";
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    return (

        <>
            <div className="flex ">
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