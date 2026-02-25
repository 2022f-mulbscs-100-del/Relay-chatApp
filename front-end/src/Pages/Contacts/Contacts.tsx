import { useMessage } from "../../context/MessageProvider";
import ContactHeader from "./ContactsHeader";
import SidePanel from "./SidePanel";
import ContactsFilter from "./ContactsFilter";
import ContactsList from "./ContactsList";
import { useEffect, useMemo, useState } from "react";
import { useMessageApis } from "../../customHooks/useMessageApis";
import { toast } from "react-toastify";
// import DoubleTapComponent from "../../Component/DoubleTapComponent";

const Contacts = () => {
  const { associatedUser } = useMessage();
  const { getAsscociatedUsers, loading: contactsLoading } = useMessageApis();
  const [selectedGroup, setSelectedGroup] = useState("All contacts");

  const normalizeCategory = (value?: string | null) =>
    (value ?? "").trim().toLowerCase();


  useEffect(() => {
    const fetchContacts = async () => {
      try {
        await getAsscociatedUsers();
      } catch {
        toast.error("Failed to fetch contacts. Please try again later.");
      }
    };
    fetchContacts();
  }, []);


  const filteredContacts = useMemo(() => {
    return associatedUser.filter((contact) => {
      if (selectedGroup === "All contacts") return true;
      return normalizeCategory(contact.category) === normalizeCategory(selectedGroup);
    })
  }, [associatedUser, selectedGroup]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="w-full px-2 md:px-3 py-6">
        <ContactHeader />
        {/* <DoubleTapComponent /> */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
          <SidePanel
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            associatedUser={associatedUser}
          />
          <section className="space-y-4">
            <ContactsFilter />
            <ContactsList associatedUser={filteredContacts} isLoading={contactsLoading} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
// idle pending connecting exit 