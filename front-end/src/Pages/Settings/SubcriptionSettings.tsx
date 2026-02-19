import { FiCreditCard } from "react-icons/fi";

const SubscriptionSettings = () => {

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <FiCreditCard className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-700">Subscription</h2>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium">Pro plan</div>
                        <div className="text-xs text-slate-500">Renews on Mar 15</div>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">Active</span>
                </div>
                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="text-sm text-slate-600">
                        Manage billing and invoices with Stripe.
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
                            View invoices
                        </button>
                        <button className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition">
                            Manage Stripe
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SubscriptionSettings;