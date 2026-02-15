import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
    Plus,
    Trash2,
    Edit3,
    Save,
    X,
    Megaphone,
    Calendar,
    FileText,
    AlertCircle,
    Loader2,
    CheckCircle,
    Clock,
    MapPin,
    User,
    GraduationCap,
    Upload,
    FileUp,
    ImageIcon,
    CreditCard,
    MessageSquare,
    Briefcase
} from 'lucide-react';
import { toast } from 'sonner';

type AdminTab = 'announcements' | 'timetable' | 'documents' | 'users' | 'fees' | 'complaints' | 'attendance' | 'careers';

export function AdminPanel() {
    const [activeTab, setActiveTab] = useState<AdminTab>('announcements');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Fee Form State
    const [feeSubTab, setFeeSubTab] = useState<'submissions' | 'structures'>('submissions');
    const [feeForm, setFeeForm] = useState({
        semester: '1st Semester',
        batch: '2024',
        amount: 145000,
        due_date: new Date().toISOString().split('T')[0]
    });

    // Announcement Form State
    const [announcementForm, setAnnouncementForm] = useState({
        title: '',
        message: '',
        category: 'academic',
        priority: 'medium',
        posted_by: 'Admin Office',
        semester: 'All',
        batch: 'All',
        section: 'All',
        department: 'All Departments'
    });

    // User Form State
    const [userForm, setUserForm] = useState({
        full_name: '',
        nutech_id: '',
        department: 'Computer Science',
        batch: '2024',
        section: 'A',
        semester: '1st Semester',
        role: 'student'
    });

    // Timetable/Document Form State
    const [docForm, setDocForm] = useState({
        title: '',
        description: '',
        category: 'timetable',
        sub_category: 'general', // 'general', 'midterm', 'final'
        semester: '1st Semester',
        batch: '2024',
        section: 'A',
        subject: '', // For subject-wise syllabus or lecture materials
        instructor: '', // For lecture materials
        file_url: '',
        file_type: ''
    });

    // Career Form State
    const [careerForm, setCareerForm] = useState({
        title: '',
        company: '',
        type: 'Job',
        description: '',
        apply_link: '',
        image_url: '',
        location: 'Remote',
        salary: ''
    });

    const semesters = ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'];
    const batches = ['2021', '2022', '2023', '2024', '2025', '2026'];
    const sections = ['A', 'B', 'C', 'D', 'All'];

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        let query;
        switch (activeTab) {
            case 'announcements':
                query = supabase.from('announcements').select('*').order('created_at', { ascending: false });
                break;
            case 'timetable':
                query = supabase.from('academic_documents').select('*').eq('category', 'timetable').order('created_at', { ascending: false });
                break;
            case 'documents':
                query = supabase.from('academic_documents').select('*').neq('category', 'timetable').order('created_at', { ascending: false });
                break;
            case 'users':
                query = supabase.from('student_profiles').select('*');
                break;
            case 'fees':
                if (feeSubTab === 'structures') {
                    query = supabase.from('fee_structures').select('*').order('created_at', { ascending: false });
                } else {
                    query = supabase.from('fee_submissions').select('*').order('created_at', { ascending: false });
                }
                break;
            case 'complaints':
                query = supabase.from('complaints').select('*').order('created_at', { ascending: false });
                break;
            case 'attendance':
                query = supabase.from('attendance').select('*').order('created_at', { ascending: false });
                break;
            case 'careers':
                query = supabase.from('careers').select('*').order('posted_at', { ascending: false });
                break;
        }

        if (query) {
            const { data: result, error } = await query;
            if (error) {
                toast.error('Failed to fetch data');
            } else {
                setData(result || []);
            }
        }
        setLoading(false);
    };

    const handleCreateFeeStructure = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('fee_structures').insert([feeForm]);
            if (error) {
                toast.error(`Error: ${error.message}`);
            } else {
                toast.success('Fee structure defined successfully!');
                setIsAdding(false);
                fetchData();
            }
        } catch (err: any) {
            toast.error(`Unexpected error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAttendanceImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const csvData = event.target?.result as string;
                const lines = csvData.split('\n').filter(line => line.trim());
                if (lines.length < 2) {
                    toast.error('CSV is empty or missing data');
                    setLoading(false);
                    return;
                }

                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                const rows = lines.slice(1).map(line => {
                    const values = line.split(',').map(v => v.trim());
                    const row: any = {};
                    headers.forEach((header, i) => {
                        row[header] = values[i];
                    });
                    return {
                        student_id: row.student_id,
                        student_name: row.student_name,
                        course_name: row.course_name,
                        attended_classes: parseInt(row.attended || '0'),
                        total_classes: parseInt(row.total || '0'),
                        semester: row.semester,
                        batch: row.batch,
                        section: row.section
                    };
                });

                const { error } = await supabase.from('attendance').upsert(rows);
                if (error) {
                    toast.error('Import failed: ' + error.message);
                } else {
                    toast.success(`Successfully imported ${rows.length} records!`);
                    setIsAdding(false);
                    fetchData();
                }
            } catch (err) {
                toast.error('Error parsing CSV file');
            }
            setLoading(false);
        };
        reader.readAsText(file);
    };

    const handleVerifyFee = async (id: string, status: 'verified' | 'rejected') => {
        setLoading(true);
        const { error } = await supabase.from('fee_submissions').update({ status }).eq('id', id);
        if (error) {
            toast.error('Status update failed');
        } else {
            toast.success(`Submission marked as ${status}`);
            fetchData();
        }
        setLoading(false);
    };

    const handleUpdateComplaintStatus = async (id: string, status: string, response: string) => {
        setLoading(true);
        const { error } = await supabase.from('complaints').update({ status, response }).eq('id', id);
        if (error) {
            toast.error('Failed to update complaint');
        } else {
            toast.success('Complaint status updated');
            fetchData();
        }
        setLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB');
            return;
        }

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${activeTab}/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('portal-docs')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('portal-docs')
                .getPublicUrl(filePath);

            setDocForm({
                ...docForm,
                file_url: publicUrl,
                file_type: fileExt || '',
                title: file.name
            });
            toast.success('File uploaded successfully!');
        } catch (err: any) {
            toast.error('Upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleCareerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `career-${Math.random()}.${fileExt}`;
            const filePath = `careers/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('portal-docs')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('portal-docs')
                .getPublicUrl(filePath);

            setCareerForm({
                ...careerForm,
                image_url: publicUrl
            });
            toast.success('Company logo uploaded!');
        } catch (err: any) {
            toast.error('Upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleCreateDocument = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!docForm.file_url) {
            toast.error('Please upload a file first');
            return;
        }

        setLoading(true);
        const { error } = await supabase.from('academic_documents').insert([docForm]);
        if (error) {
            toast.error('Error saving document: ' + error.message);
        } else {
            toast.success(`${docForm.category === 'timetable' ? 'Timetable' : 'Document'} posted successfully!`);
            setIsAdding(false);
            setDocForm({ ...docForm, file_url: '', title: '' });
            fetchData();
        }
        setLoading(false);
    };

    const handleCreateAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from('announcements').insert([announcementForm]);
        if (error) {
            toast.error('Error creating announcement');
        } else {
            toast.success('Announcement posted successfully!');
            setIsAdding(false);
            fetchData();
        }
        setLoading(false);
    };

    const handleCreateCareer = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from('careers').insert([careerForm]);
        if (error) {
            toast.error('Error posting career opportunity');
        } else {
            toast.success('Career opportunity posted successfully!');
            setIsAdding(false);
            setCareerForm({
                title: '', company: '', type: 'Job', description: '',
                apply_link: '', image_url: '', location: 'Remote', salary: ''
            });
            fetchData();
        }
        setLoading(false);
    };

    const handleDelete = async (id: string, table: string) => {
        if (!confirm('Are you sure you want to delete this?')) return;
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) {
            toast.error('Delete failed');
        } else {
            toast.success('Deleted successfully');
            fetchData();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <GraduationCap className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Admin Control Panel</h2>
                            <p className="text-gray-500 text-sm">Manage portal content and database values without code</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-gray-200/50 rounded-xl w-full overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 min-w-max p-1">
                    {[
                        { id: 'announcements', label: 'Announcements', icon: Megaphone },
                        { id: 'timetable', label: 'Timetable', icon: Calendar },
                        { id: 'documents', label: 'Academic Docs', icon: FileText },
                        { id: 'fees', label: 'Fees & Payments', icon: CreditCard },
                        { id: 'users', label: 'Students', icon: User },
                        { id: 'attendance', label: 'Attendance', icon: GraduationCap },
                        { id: 'complaints', label: 'Complaints', icon: MessageSquare },
                        { id: 'careers', label: 'Jobs & Internships', icon: Briefcase },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as AdminTab);
                                setIsAdding(false);
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${activeTab === tab.id
                                ? 'bg-white text-green-700 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-gray-800 capitalize flex items-center gap-2">
                            {activeTab.replace('-', ' ')} Management
                            {activeTab === 'fees' && (
                                <div className="flex bg-gray-100 rounded-lg p-0.5 ml-4">
                                    <button
                                        onClick={() => { setFeeSubTab('submissions'); fetchData(); }}
                                        className={`px-3 py-1 text-xs rounded-md transition-all ${feeSubTab === 'submissions' ? 'bg-white shadow-sm text-green-700 font-bold' : 'text-gray-500'}`}
                                    >Submissions</button>
                                    <button
                                        onClick={() => { setFeeSubTab('structures'); fetchData(); }}
                                        className={`px-3 py-1 text-xs rounded-md transition-all ${feeSubTab === 'structures' ? 'bg-white shadow-sm text-green-700 font-bold' : 'text-gray-500'}`}
                                    >Structures</button>
                                </div>
                            )}
                        </h3>
                    </div>
                    {!isAdding && ['announcements', 'timetable', 'documents', 'fees', 'attendance', 'users', 'careers'].includes(activeTab) && (
                        <button
                            onClick={() => {
                                setIsAdding(true);
                                if (activeTab === 'attendance') {
                                    document.getElementById('attendance-csv')?.click();
                                }
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-md"
                        >
                            {activeTab === 'attendance' ? <Upload className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            {activeTab === 'attendance' ? 'Import (CSV)' : `Add New`}
                        </button>
                    )}
                </div>

                <div className="p-6">
                    {loading && !isAdding ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <Loader2 className="w-12 h-12 animate-spin mb-4 text-green-600" />
                            <p className="animate-pulse">Fetching records...</p>
                        </div>
                    ) : isAdding ? (
                        <div className="max-w-4xl">
                            {activeTab === 'announcements' ? (
                                <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium mb-1">Topic / Title</label>
                                            <input
                                                required
                                                className="w-full border rounded-lg p-2.5"
                                                placeholder="e.g., Final Exam Policy Update"
                                                value={announcementForm.title}
                                                onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Target Semester</label>
                                            <select
                                                className="w-full border rounded-lg p-2.5"
                                                value={announcementForm.semester}
                                                onChange={e => setAnnouncementForm({ ...announcementForm, semester: e.target.value })}
                                            >
                                                <option value="All">All Semesters</option>
                                                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Target Batch</label>
                                            <select
                                                className="w-full border rounded-lg p-2.5"
                                                value={announcementForm.batch}
                                                onChange={e => setAnnouncementForm({ ...announcementForm, batch: e.target.value })}
                                            >
                                                <option value="All">All Batches</option>
                                                {batches.map(b => <option key={b} value={b}>{b}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium mb-1">Message Content</label>
                                            <textarea
                                                required
                                                rows={4}
                                                className="w-full border rounded-lg p-2.5"
                                                placeholder="Enter the announcement details..."
                                                value={announcementForm.message}
                                                onChange={e => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4 border-t">
                                        <button type="submit" className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold shadow-md">Post Now</button>
                                        <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium">Cancel</button>
                                    </div>
                                </form>
                            ) : activeTab === 'fees' ? (
                                <form onSubmit={handleCreateFeeStructure} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Academic Batch</label>
                                            <select
                                                className="w-full border rounded-lg p-2.5"
                                                value={feeForm.batch}
                                                onChange={e => setFeeForm({ ...feeForm, batch: e.target.value })}
                                            >
                                                {batches.map(b => <option key={b} value={b}>{b}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Standard Amount (PKR)</label>
                                            <input
                                                type="number"
                                                className="w-full border rounded-lg p-2.5"
                                                value={feeForm.amount}
                                                onChange={e => setFeeForm({ ...feeForm, amount: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Semester</label>
                                            <select
                                                className="w-full border rounded-lg p-2.5"
                                                value={feeForm.semester}
                                                onChange={e => setFeeForm({ ...feeForm, semester: e.target.value })}
                                            >
                                                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Due Date</label>
                                            <input
                                                type="date"
                                                className="w-full border rounded-lg p-2.5"
                                                value={feeForm.due_date}
                                                onChange={e => setFeeForm({ ...feeForm, due_date: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button type="submit" disabled={loading} className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold">
                                            {loading ? 'Processing...' : 'Define Structure'}
                                        </button>
                                        <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-100 px-6 py-2.5 rounded-lg font-medium">Cancel</button>
                                    </div>
                                </form>
                            ) : activeTab === 'careers' ? (
                                <form onSubmit={handleCreateCareer} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium mb-1">Position Title</label>
                                            <input
                                                required
                                                className="w-full border rounded-lg p-2.5"
                                                placeholder="e.g. Frontend Intern"
                                                value={careerForm.title}
                                                onChange={e => setCareerForm({ ...careerForm, title: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Company</label>
                                            <input
                                                required
                                                className="w-full border rounded-lg p-2.5"
                                                placeholder="e.g. Google"
                                                value={careerForm.company}
                                                onChange={e => setCareerForm({ ...careerForm, company: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Type</label>
                                            <select
                                                className="w-full border rounded-lg p-2.5"
                                                value={careerForm.type}
                                                onChange={e => setCareerForm({ ...careerForm, type: e.target.value as any })}
                                            >
                                                <option value="Job">Full-time Job</option>
                                                <option value="Internship">Internship</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Location</label>
                                            <input
                                                className="w-full border rounded-lg p-2.5"
                                                placeholder="e.g. Islamabad (Remote)"
                                                value={careerForm.location}
                                                onChange={e => setCareerForm({ ...careerForm, location: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Salary / Stipend</label>
                                            <input
                                                className="w-full border rounded-lg p-2.5"
                                                placeholder="e.g. 50k / month"
                                                value={careerForm.salary}
                                                onChange={e => setCareerForm({ ...careerForm, salary: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium mb-1">Company logo / Image</label>
                                            <div className="bg-gray-50 border-2 border-dashed rounded-xl p-4 text-center relative hover:bg-gray-100 transition-all cursor-pointer">
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    accept="image/*"
                                                    onChange={handleCareerImageUpload}
                                                    disabled={uploading}
                                                />
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="bg-white p-2 rounded-full shadow-sm text-blue-600">
                                                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> :
                                                            careerForm.image_url ? <CheckCircle className="w-5 h-5 text-green-600" /> : <ImageIcon className="w-5 h-5" />}
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-700">
                                                        {careerForm.image_url ? 'Logo Uploaded!' : 'Click to upload logo'}
                                                    </p>
                                                    {careerForm.image_url && (
                                                        <img src={careerForm.image_url} alt="Preview" className="w-8 h-8 rounded object-cover border" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium mb-1">Application Link</label>
                                            <input
                                                required
                                                className="w-full border rounded-lg p-2.5"
                                                placeholder="https://linkedin.com/jobs/..."
                                                value={careerForm.apply_link}
                                                onChange={e => setCareerForm({ ...careerForm, apply_link: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium mb-1">Description</label>
                                            <textarea
                                                required
                                                rows={4}
                                                className="w-full border rounded-lg p-2.5"
                                                placeholder="Briefly describe the role..."
                                                value={careerForm.description}
                                                onChange={e => setCareerForm({ ...careerForm, description: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4 border-t">
                                        <button type="submit" className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold shadow-md">Post Opportunity</button>
                                        <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium">Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleCreateDocument} className="space-y-6">
                                    <div className="bg-gray-50 border-2 border-dashed rounded-xl p-8 text-center relative">
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="bg-white p-4 rounded-full shadow-sm text-green-600">
                                                {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> :
                                                    docForm.file_url ? <CheckCircle className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                                            </div>
                                            <p className="font-bold">{docForm.file_url ? 'File Ready' : 'Upload Source File'}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Semester</label>
                                            <select
                                                className="w-full border rounded-lg p-2.5"
                                                value={docForm.semester}
                                                onChange={e => setDocForm({ ...docForm, semester: e.target.value })}
                                            >
                                                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Batch</label>
                                            <select
                                                className="w-full border rounded-lg p-2.5"
                                                value={docForm.batch}
                                                onChange={e => setDocForm({ ...docForm, batch: e.target.value })}
                                            >
                                                {batches.map(b => <option key={b} value={b}>{b}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4 border-t">
                                        <button type="submit" disabled={!docForm.file_url || loading} className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold">Publish</button>
                                        <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium">Cancel</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto -mx-6">
                            {data.length === 0 ? (
                                <div className="p-20 text-center text-gray-500">
                                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>No records found.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                            <th className="px-6 py-4">Descriptor</th>
                                            <th className="px-6 py-4">Details</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-all">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-900">
                                                            {activeTab === 'announcements' ? item.title :
                                                                activeTab === 'users' ? item.full_name :
                                                                    activeTab === 'attendance' ? item.student_name :
                                                                        activeTab === 'fees' ? (feeSubTab === 'structures' ? `${item.semester} Structure` : (item.full_name || item.nutech_id)) :
                                                                            activeTab === 'timetable' ? item.title :
                                                                                activeTab === 'careers' ? item.title :
                                                                                    activeTab === 'complaints' ? item.subject : item.title}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {activeTab === 'users' ? item.nutech_id :
                                                                activeTab === 'attendance' ? item.student_id :
                                                                    activeTab === 'fees' ? (feeSubTab === 'structures' ? `Batch: ${item.batch}` : `Amount: Rs. ${item.amount}`) :
                                                                        activeTab === 'complaints' ? `From: ${item.student_name || 'Anonymous'}` :
                                                                            item.created_at?.split('T')[0]}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-600">
                                                        {activeTab === 'announcements' ? (
                                                            <span className="line-clamp-1 italic text-gray-400">"{item.message}"</span>
                                                        ) : activeTab === 'careers' ? (
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-blue-600">{item.company}</span>
                                                                <span className="text-xs text-gray-500">{item.location} | {item.salary}</span>
                                                            </div>
                                                        ) : (activeTab === 'documents' || activeTab === 'timetable' || activeTab === 'fees') ? (
                                                            <div className="flex items-center gap-2">
                                                                {item.file_url ? (
                                                                    <a href={item.file_url} target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold text-xs uppercase">View Attachment</a>
                                                                ) : <span className="text-gray-400">No Attachment</span>}
                                                            </div>
                                                        ) : activeTab === 'complaints' ? (
                                                            <p className="line-clamp-1 italic text-gray-500">"{item.description}"</p>
                                                        ) : null}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {activeTab === 'complaints' && (
                                                            <button
                                                                onClick={() => {
                                                                    const n = prompt('Status (pending/in_progress/resolved):', item.status);
                                                                    const r = prompt('Response:', item.response || '');
                                                                    if (n) handleUpdateComplaintStatus(item.id, n, r || '');
                                                                }}
                                                                className="p-2 text-purple-600 bg-purple-50 rounded-lg"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {activeTab === 'fees' && feeSubTab === 'submissions' && item.status === 'pending' && (
                                                            <div className="flex gap-1">
                                                                <button onClick={() => handleVerifyFee(item.id, 'verified')} className="px-2 py-1 bg-green-600 text-white rounded text-[10px] font-bold">VERIFY</button>
                                                                <button onClick={() => handleVerifyFee(item.id, 'rejected')} className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold">REJECT</button>
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(item.id,
                                                                activeTab === 'announcements' ? 'announcements' :
                                                                    activeTab === 'timetable' ? 'academic_documents' :
                                                                        activeTab === 'documents' ? 'academic_documents' :
                                                                            activeTab === 'users' ? 'student_profiles' :
                                                                                activeTab === 'fees' ? (feeSubTab === 'structures' ? 'fee_structures' : 'fee_submissions') :
                                                                                    activeTab === 'attendance' ? 'attendance' :
                                                                                        activeTab === 'careers' ? 'careers' : ''
                                                            )}
                                                            className="p-2 text-red-600 bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <input type="file" id="attendance-csv" className="hidden" accept=".csv" onChange={handleAttendanceImport} />
        </div>
    );
}
