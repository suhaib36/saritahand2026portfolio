import React, { useState, useEffect, useMemo } from 'react';
import {
  Mail,
  Phone,
  Search,
  Filter,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  X,
  MessageSquare,
  Bookmark,
  Calendar,
} from 'lucide-react';
import {
  adminGetAllEnquiries,
  adminUpdateEnquiryStatus,
  adminDeleteEnquiry,
} from '../../services/catalogService';

export default function AdminEnquiries({ onEnquiriesCountChange }) {
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'new' | 'contacted' | 'in_progress' | 'completed'
  const [sortBy, setSortBy] = useState('newest');

  // Detail Modal & Delete Target
  const [activeEnquiry, setActiveEnquiry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadEnquiries = async () => {
    setIsLoading(true);
    setErrorNotice(null);
    try {
      const data = await adminGetAllEnquiries();
      setEnquiries(data);
      const newCount = data.filter((e) => e.status === 'new').length;
      onEnquiriesCountChange?.(newCount);
    } catch (err) {
      setErrorNotice(err.message || 'Error loading enquiries from Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      if (statusFilter !== 'All' && e.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matches =
          e.customerName?.toLowerCase().includes(q) ||
          e.customerEmail?.toLowerCase().includes(q) ||
          e.customerPhone?.toLowerCase().includes(q) ||
          e.productName?.toLowerCase().includes(q) ||
          e.message?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      return 0;
    });
  }, [enquiries, searchQuery, statusFilter, sortBy]);

  const handleStatusChange = async (enquiryId, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      await adminUpdateEnquiryStatus(enquiryId, newStatus);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
      );
      if (activeEnquiry && activeEnquiry.id === enquiryId) {
        setActiveEnquiry((prev) => ({ ...prev, status: newStatus }));
      }
      const newCount = enquiries.filter(
        (e) => (e.id === enquiryId ? newStatus === 'new' : e.status === 'new')
      ).length;
      onEnquiriesCountChange?.(newCount);
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminDeleteEnquiry(deleteTarget.id);
      setEnquiries((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      if (activeEnquiry?.id === deleteTarget.id) {
        setActiveEnquiry(null);
      }
      setDeleteTarget(null);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>New</span>
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-300">
            <span>Contacted</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-300">
            <span>In Progress</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Completed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-stone-100 text-stone-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DED0]">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
            Client Relations
          </span>
          <h1 className="font-serif text-3xl text-stone-900 font-normal">
            Enquiry Management ({enquiries.length})
          </h1>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Every submission is preserved in Supabase and alerted to <strong>suhaib.ishrat36@gmail.com</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadEnquiries}
            disabled={isLoading}
            className="p-2 border border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-white transition-colors"
            title="Reload enquiries"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {errorNotice && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{errorNotice}</span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-[#E8DED0] flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, phone, or product..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900 font-sans"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Tabs/Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF8F5] border border-[#E8DED0] text-xs font-sans text-stone-800 focus:outline-hidden"
          >
            <option value="All">All Statuses ({enquiries.length})</option>
            <option value="new">New ({enquiries.filter((e) => e.status === 'new').length})</option>
            <option value="contacted">Contacted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-[#FAF8F5] border border-[#E8DED0] text-xs font-sans text-stone-800 focus:outline-hidden"
          >
            <option value="newest">Newest Submissions First</option>
            <option value="oldest">Oldest Submissions First</option>
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white border border-[#E8DED0] shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-xs font-sans text-stone-500">
            Loading customer enquiries from Supabase...
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-16 text-center text-xs font-sans text-stone-500 space-y-3">
            <Mail className="w-8 h-8 mx-auto text-stone-300" />
            <p className="font-serif text-lg text-stone-700">No customer enquiries found</p>
            <p className="text-xs text-stone-500">
              When customers inquire about products on the public website, their submissions will be recorded here immediately.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8DED0] text-[10px] uppercase tracking-widest text-stone-500">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Product / Context</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredEnquiries.map((enq) => (
                  <tr
                    key={enq.id}
                    onClick={() => setActiveEnquiry(enq)}
                    className="hover:bg-[#FAF8F5]/80 cursor-pointer transition-colors"
                  >
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900 text-sm">{enq.customerName}</div>
                      <div className="text-[10px] uppercase font-sans tracking-wider text-[#A2644B]">
                        {enq.enquiryType || 'General Consultation'}
                      </div>
                    </td>

                    {/* Product */}
                    <td className="py-3.5 px-4">
                      <div className="font-serif text-stone-900 text-sm truncate max-w-xs font-medium">
                        {enq.productName}
                      </div>
                      <div className="text-stone-500 text-[11px] truncate max-w-xs italic line-clamp-1">
                        "{enq.message}"
                      </div>
                    </td>

                    {/* Contact Info with direct links */}
                    <td className="py-3.5 px-4 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-[#A2644B] shrink-0" />
                        <a
                          href={`mailto:${enq.customerEmail}?subject=Re: Sarita Handa Enquiry - ${enq.productName}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:underline text-stone-800 truncate max-w-[170px]"
                          title="Click to compose reply"
                        >
                          {enq.customerEmail}
                        </a>
                      </div>

                      {enq.customerPhone && enq.customerPhone !== 'Not provided' && (
                        <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                          <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                          <a
                            href={`tel:${enq.customerPhone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:underline"
                            title="Click to call"
                          >
                            {enq.customerPhone}
                          </a>
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                      {enq.createdAt ? (
                        <>
                          <div>{new Date(enq.createdAt).toLocaleDateString()}</div>
                          <div className="text-[10px] text-stone-400">{new Date(enq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </>
                      ) : (
                        '—'
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={enq.status || 'new'}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        className="text-[11px] font-sans px-2.5 py-1 bg-white border border-[#E8DED0] focus:outline-hidden font-medium rounded-none"
                      >
                        <option value="new">● New</option>
                        <option value="contacted">● Contacted</option>
                        <option value="in_progress">● In Progress</option>
                        <option value="completed">● Completed</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setActiveEnquiry(enq)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                          title="View Full Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(enq)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enquiry Detail Modal */}
      {activeEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-xs"
          onClick={() => setActiveEnquiry(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#FAF8F5] border border-[#C5A880]/50 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#1C1917] text-white p-6 flex items-center justify-between border-b border-[#C5A880]/30">
              <div>
                <div className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#C5A880]">
                  Enquiry ID: {activeEnquiry.id?.slice(0, 8)}
                </div>
                <h2 className="font-serif text-2xl font-normal">
                  {activeEnquiry.productName}
                </h2>
              </div>
              <button
                onClick={() => setActiveEnquiry(null)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Status Selector Banner */}
              <div className="bg-white p-4 border border-[#E8DED0] flex items-center justify-between">
                <span className="text-xs uppercase font-sans tracking-wider text-stone-600 font-semibold">
                  Current Lead Status:
                </span>
                <select
                  value={activeEnquiry.status || 'new'}
                  onChange={(e) => handleStatusChange(activeEnquiry.id, e.target.value)}
                  className="text-xs font-sans font-bold uppercase tracking-wider px-3 py-1.5 bg-[#FAF8F5] border border-[#C5A880] focus:outline-hidden"
                >
                  <option value="new">● New (Unprocessed)</option>
                  <option value="contacted">● Contacted Client</option>
                  <option value="in_progress">● In Progress / Quoting</option>
                  <option value="completed">● Completed / Closed</option>
                </select>
              </div>

              {/* Customer Information Grid */}
              <div className="bg-white p-6 border border-[#E8DED0] space-y-4">
                <h3 className="font-serif text-lg text-stone-900 border-b border-stone-100 pb-2">
                  Customer & Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                      Full Name
                    </span>
                    <span className="font-medium text-sm text-stone-900">{activeEnquiry.customerName}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                      Submitted Date & Time
                    </span>
                    <span className="text-stone-800">
                      {activeEnquiry.createdAt ? new Date(activeEnquiry.createdAt).toLocaleString() : 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                      Email Address
                    </span>
                    <a
                      href={`mailto:${activeEnquiry.customerEmail}?subject=Re: Sarita Handa Enquiry - ${activeEnquiry.productName}`}
                      className="text-[#A2644B] underline font-medium"
                    >
                      {activeEnquiry.customerEmail}
                    </a>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                      Phone Number
                    </span>
                    <a href={`tel:${activeEnquiry.customerPhone}`} className="text-stone-900 font-medium hover:underline">
                      {activeEnquiry.customerPhone || 'Not provided'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Message Box */}
              <div className="bg-white p-6 border border-[#E8DED0] space-y-2">
                <h3 className="font-serif text-lg text-stone-900 border-b border-stone-100 pb-2">
                  Customer Message / Specifications
                </h3>
                <p className="text-xs sm:text-sm font-sans text-stone-800 leading-relaxed whitespace-pre-line bg-[#FAF8F5] p-4 border border-[#E8DED0]/60">
                  {activeEnquiry.message}
                </p>
              </div>

              {/* Shortlist details if multiple items */}
              {activeEnquiry.shortlist && activeEnquiry.shortlist.length > 0 && (
                <div className="bg-white p-6 border border-[#E8DED0] space-y-3">
                  <h3 className="font-serif text-lg text-stone-900 border-b border-stone-100 pb-2">
                    Shortlisted Creations ({activeEnquiry.shortlist.length})
                  </h3>
                  <div className="divide-y divide-stone-100">
                    {activeEnquiry.shortlist.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs font-sans">
                        <span className="font-medium text-stone-900">{item.name}</span>
                        <span className="text-[11px] text-stone-500 uppercase">{item.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200">
                <button
                  onClick={() => setDeleteTarget(activeEnquiry)}
                  className="text-xs uppercase font-sans tracking-wider text-rose-600 hover:text-rose-800"
                >
                  Delete Enquiry Record
                </button>

                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${activeEnquiry.customerEmail}?subject=Sarita Handa Concierge: ${activeEnquiry.productName}&body=Dear ${activeEnquiry.customerName},%0D%0A%0D%0AThank you for contacting Sarita Handa regarding ${activeEnquiry.productName}.%0D%0A%0D%0A`}
                    className="px-5 py-2.5 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1C1917] transition-all flex items-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Email Reply</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-md bg-white p-6 space-y-4 border border-stone-300 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-xl text-stone-900">Delete Enquiry Record?</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete the enquiry from{' '}
              <strong className="text-stone-900">"{deleteTarget.customerName}"</strong> regarding "{deleteTarget.productName}"?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-stone-300 text-xs uppercase font-sans tracking-wider text-stone-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-rose-600 text-white text-xs uppercase font-sans tracking-widest hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
