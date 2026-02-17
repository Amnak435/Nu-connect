import { useState, useEffect } from 'react';
import { Calendar, ExternalLink, MapPin, Heart, Users, Search, Filter, Loader2, Image as ImageIcon, Calendar as CalendarIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface UniversityEvent {
    id: string;
    title: string;
    caption: string;
    event_link: string;
    image_url: string;
    event_date: string;
    visibility_type: 'everyone' | 'specific';
    target_batch: string;
    target_section: string;
    target_semester: string;
    posted_at: string;
    likes_count?: number;
    user_has_liked?: boolean;
}

interface UniversityEventsProps {
    user?: any;
}

export function UniversityEvents({ user }: UniversityEventsProps) {
    const [events, setEvents] = useState<UniversityEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'past'>('all');

    useEffect(() => {
        fetchEvents();
    }, [user]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            // Fetch events
            const { data: eventsData, error: eventsError } = await supabase
                .from('university_events')
                .select('*')
                .order('posted_at', { ascending: false });

            if (eventsError) throw eventsError;

            // Filter events based on visibility
            const filteredEvents = (eventsData || []).filter(event => {
                if (event.visibility_type === 'everyone') return true;

                // Check if event is targeted to user's specific group
                if (user) {
                    const batchMatch = !event.target_batch || event.target_batch === 'All' || event.target_batch === user.batch;
                    const sectionMatch = !event.target_section || event.target_section === 'All' || event.target_section === user.section;
                    const semesterMatch = !event.target_semester || event.target_semester === 'All' || event.target_semester === user.semester;
                    return batchMatch && sectionMatch && semesterMatch;
                }

                return false;
            });

            // Fetch likes for each event
            const eventsWithLikes = await Promise.all(
                filteredEvents.map(async (event) => {
                    // Get likes count
                    const { count } = await supabase
                        .from('event_likes')
                        .select('*', { count: 'exact', head: true })
                        .eq('event_id', event.id);

                    // Check if current user has liked
                    let userHasLiked = false;
                    if (user?.id) {
                        const { data: likeData } = await supabase
                            .from('event_likes')
                            .select('id')
                            .eq('event_id', event.id)
                            .eq('user_id', user.id)
                            .single();
                        userHasLiked = !!likeData;
                    }

                    return {
                        ...event,
                        likes_count: count || 0,
                        user_has_liked: userHasLiked
                    };
                })
            );

            setEvents(eventsWithLikes);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (eventId: string, isLiked: boolean) => {
        if (!user?.id) {
            toast.error('Please log in to like events');
            return;
        }

        try {
            if (isLiked) {
                // Unlike
                const { error } = await supabase
                    .from('event_likes')
                    .delete()
                    .eq('event_id', eventId)
                    .eq('user_id', user.id);

                if (error) throw error;
                toast.success('Like removed');
            } else {
                // Like
                const { error } = await supabase
                    .from('event_likes')
                    .insert([{ event_id: eventId, user_id: user.id }]);

                if (error) throw error;
                toast.success('Event liked! ❤️');
            }

            // Refresh events to update like counts
            fetchEvents();
        } catch (error: any) {
            console.error('Error toggling like:', error);
            toast.error('Failed to update like');
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.caption?.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterType === 'upcoming') {
            return matchesSearch && event.event_date && new Date(event.event_date) > new Date();
        } else if (filterType === 'past') {
            return matchesSearch && event.event_date && new Date(event.event_date) <= new Date();
        }

        return matchesSearch;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div
                className="rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden ring-1 ring-white/10"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)', backgroundColor: '#7c3aed' }}
            >
                <div className="relative z-10">
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">University Events 🎉</h2>
                    <p className="text-purple-50 font-medium max-w-2xl text-base md:text-lg opacity-90">
                        Stay updated with the latest happenings at campus. Discover events, workshops, seminars, and activities from NUTECH.
                    </p>
                </div>
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 font-bold pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                    {['all', 'upcoming', 'past'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type as any)}
                            className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-lg text-sm font-bold transition-all capitalize ${filterType === type
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                : 'text-gray-600 hover:bg-white hover:shadow-sm'
                                }`}
                            style={filterType === type ? { backgroundColor: '#7c3aed', color: '#ffffff' } : {}}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-50 shadow-inner">
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium font-mono text-xs uppercase tracking-widest">Loading Events</p>
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-100 shadow-sm">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800 mb-2">No events found</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">Check back later for exciting campus events and activities!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredEvents.map((event) => (
                        <div key={event.id} className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full card-hover">
                            {/* Image Section */}
                            <div className="h-64 relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 border-b border-gray-100 flex items-center justify-center cursor-zoom-in group/img">
                                {event.image_url ? (
                                    <img
                                        src={event.image_url}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                                        onClick={() => window.open(event.image_url, '_blank')}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-purple-200">
                                        <ImageIcon className="w-16 h-16" />
                                    </div>
                                )}
                                {/* Event Date Badge */}
                                {event.event_date && (
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-lg border border-gray-100 z-10">
                                        <div className="text-center min-w-[3.5rem]">
                                            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                                                {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}
                                            </p>
                                            <p className="text-2xl font-black text-gray-900 leading-none mt-0.5">
                                                {new Date(event.event_date).getDate()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-purple-600 transition-colors tracking-tight leading-tight uppercase font-heading">
                                        {event.title}
                                    </h3>

                                    {/* Visibility Badge */}
                                    {event.visibility_type === 'specific' && (
                                        <div className="flex items-center gap-2 mb-3">
                                            <Users className="w-4 h-4 text-purple-500" />
                                            <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">
                                                {event.target_batch && event.target_batch !== 'All' && `Batch ${event.target_batch}`}
                                                {event.target_section && event.target_section !== 'All' && ` • Section ${event.target_section}`}
                                                {event.target_semester && event.target_semester !== 'All' && ` • ${event.target_semester}`}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {event.caption && (
                                    <p className="text-gray-600 text-sm line-clamp-4 mb-6 flex-1 leading-relaxed font-medium border-l-4 border-purple-100 pl-4 bg-purple-50/30 py-3 rounded-r-xl">
                                        {event.caption}
                                    </p>
                                )}

                                {/* Event Date Info */}
                                {event.event_date && (
                                    <div className="flex items-center gap-3 text-gray-600 mb-6 bg-gray-50/50 p-3 rounded-xl">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <CalendarIcon className="w-4 h-4 text-purple-500" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">
                                                {new Date(event.event_date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(event.event_date).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3">
                                    {/* Like Button */}
                                    <button
                                        onClick={() => handleLike(event.id, event.user_has_liked || false)}
                                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all font-bold border-2 ${event.user_has_liked
                                            ? 'bg-pink-50 border-pink-500 text-pink-600 hover:bg-pink-100'
                                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Heart
                                            className={`w-5 h-5 transition-all ${event.user_has_liked ? 'fill-pink-500 text-pink-500' : ''}`}
                                        />
                                        <span>{event.likes_count || 0}</span>
                                    </button>

                                    {/* Link Button */}
                                    {event.event_link && (
                                        <a
                                            href={event.event_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-3 py-3 text-white font-black rounded-xl transition-all shadow-xl hover:shadow-purple-500/30 active:scale-[0.97] group/btn border-b-4 border-purple-800"
                                            style={{ background: 'linear-gradient(to right, #7c3aed, #5b21b6)', backgroundColor: '#7c3aed' }}
                                        >
                                            LEARN MORE
                                            <ExternalLink className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                        </a>
                                    )}
                                </div>

                                {/* Posted Date */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-400 font-medium">
                                        Posted on {new Date(event.posted_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
