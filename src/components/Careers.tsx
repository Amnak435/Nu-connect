import { useState, useEffect } from 'react';
import { Briefcase, ExternalLink, MapPin, DollarSign, Clock, Search, Filter, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Job {
    id: string;
    title: string;
    company: string;
    type: 'Job' | 'Internship';
    description: string;
    apply_link: string;
    image_url: string;
    location: string;
    salary: string;
    posted_at: string;
}

export function Careers() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'All' | 'Job' | 'Internship'>('All');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('careers')
                .select('*')
                .order('posted_at', { ascending: false });

            if (error) throw error;
            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || job.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div
                className="rounded-2xl p-8 text-white shadow-xl relative overflow-hidden ring-1 ring-white/10"
                style={{ background: 'linear-gradient(135deg, #1e40af 0%, #312e81 100%)', backgroundColor: '#1e40af' }}
            >
                <div className="relative z-10">
                    <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Careers & Internships 🚀</h2>
                    <p className="text-blue-50 font-medium max-w-2xl text-lg opacity-90">
                        Explore the latest opportunities from top companies. Launch your career or find your next internship directly through NUConnect.
                    </p>
                </div>
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 font-bold" />
                    <input
                        type="text"
                        placeholder="Search roles or companies..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                    {['All', 'Job', 'Internship'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type as any)}
                            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${filterType === type
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'text-gray-600 hover:bg-white hover:shadow-sm'
                                }`}
                            style={filterType === type ? { backgroundColor: '#2563eb', color: '#ffffff' } : {}}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-50 shadow-inner">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium font-mono text-xs uppercase tracking-widest">Scanning Opportunities</p>
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-100 shadow-sm">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Briefcase className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800 mb-2">No roles match your search</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your filters or checking back tomorrow for fresh postings!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredJobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full card-hover">
                            {/* Image Section */}
                            <div className="h-52 relative overflow-hidden bg-gray-50 border-b border-gray-50">
                                {job.image_url ? (
                                    <img src={job.image_url} alt={job.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                                        <ImageIcon className="w-16 h-16" />
                                    </div>
                                )}
                                <div className="absolute top-5 left-5 flex gap-2">
                                    <span
                                        className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl text-white backdrop-blur-md"
                                        style={{ backgroundColor: job.type === 'Internship' ? '#f59e0b' : '#3b82f6' }}
                                    >
                                        {job.type}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors tracking-tight leading-tight uppercase font-heading">{job.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-0.5 bg-blue-600 rounded-full" />
                                        <p className="text-blue-600 font-black text-sm uppercase tracking-widest">{job.company}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <MapPin className="w-4 h-4 text-red-500" />
                                        </div>
                                        <span className="text-sm font-bold">{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <DollarSign className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="text-sm font-bold">{job.salary || 'Competitive'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-500 col-span-2">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Clock className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wide">Posted: {new Date(job.posted_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm line-clamp-4 mb-8 flex-1 leading-relaxed font-medium italic border-l-4 border-gray-100 pl-4 bg-gray-50/30 py-2 rounded-r-xl">
                                    "{job.description}"
                                </p>

                                <a
                                    href={job.apply_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-4 text-white font-black rounded-2xl transition-all shadow-xl hover:shadow-green-500/30 active:scale-[0.97] group/btn border-b-4 border-green-800"
                                    style={{ background: 'linear-gradient(to right, #16a34a, #15803d)', backgroundColor: '#16a34a' }}
                                >
                                    APPLY NOW
                                    <ExternalLink className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
