import { useMessage } from "../../context/MessageProvider";
import ContactHeader from "./ContactsHeader";
import SidePanel from "./SidePanel";
import ContactsFilter from "./ContactsFilter";
import ContactsList from "./ContactsList";
import { useEffect } from "react";
import { useMessageApis } from "../../customHooks/useMessageApis";
import { toast } from "react-toastify";

const Contacts = () => {


  const { associatedUser } = useMessage();
  const { getAsscociatedUsers } = useMessageApis();



  useEffect(() => {
    try {
      getAsscociatedUsers();
    } catch {
      toast.error("Failed to fetch contacts. Please try again later.")
    }
  }, []);

  

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="w-full px-2 md:px-3 py-6">
        <ContactHeader />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
          <SidePanel
          />
          <section className="space-y-4">
            <ContactsFilter />
            <ContactsList associatedUser={associatedUser} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
