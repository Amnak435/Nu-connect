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
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Careers & Internships 🚀</h2>
                    <p className="text-blue-100 max-w-2xl">
                        Explore the latest opportunities from top companies. Launch your career or find your next internship directly through NUConnect.
                    </p>
                </div>
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search roles or companies..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    {['All', 'Job', 'Internship'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type as any)}
                            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === type
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-500">Finding opportunities...</p>
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-100">
                    <Briefcase className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800">No opportunities found</h3>
                    <p className="text-gray-500">Check back later for new postings!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredJobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col h-full">
                            {/* Image Section */}
                            <div className="h-48 relative overflow-hidden bg-gray-100">
                                {job.image_url ? (
                                    <img src={job.image_url} alt={job.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ImageIcon className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${job.type === 'Internship' ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'
                                        }`}>
                                        {job.type}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{job.title}</h3>
                                    <p className="text-blue-600 font-bold text-sm tracking-wide">{job.company}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                        <span>{job.salary || 'Competitive'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>{new Date(job.posted_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                    {job.description}
                                </p>

                                <a
                                    href={job.apply_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95"
                                >
                                    Apply Now
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
