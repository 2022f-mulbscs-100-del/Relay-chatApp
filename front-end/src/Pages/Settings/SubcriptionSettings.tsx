import { FiCreditCard } from "react-icons/fi";

const SubscriptionSettings = () => {

    return (
        <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-colors duration-200">
            <div className="flex items-center gap-2 mb-4">
                <FiCreditCard className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Subscription</h2>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-600 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium">Pro plan</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Renews on Mar 15</div>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">Active</span>
                </div>
                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        Manage billing and invoices with Stripe.
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                            View invoices
                        </button>
                        <button className="px-3 py-1.5 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition">
                            Manage Stripe
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SubscriptionSettings;