import { FiCalendar, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { useUser } from "../../context/UserProvider";
import { normalizeDate } from "../../utlis/NormalizeDate";

const ContactCard = () => {

    const { user } = useUser();
    return (

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors duration-200">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Contact</h2>
            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                    <FiMail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <div>
                        <div className="text-slate-500 dark:text-slate-400">Email</div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">{user?.email}</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <FiPhone className="w-4 h-4 text-slate-500" />
                    <div>
                        <div className="text-slate-500 dark:text-slate-400">Phone</div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">{user?.phone}</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <FiMapPin className="w-4 h-4 text-slate-500" />
                    <div>
                        <div className="text-slate-500 dark:text-slate-400">Location</div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">{user?.location}</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <FiCalendar className="w-4 h-4 text-slate-500" />
                    <div>
                        <div className="text-slate-500 dark:text-slate-400">Joined</div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">{normalizeDate(user?.createdAt || '').toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default ContactCard;