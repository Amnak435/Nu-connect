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
    MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

type AdminTab = 'announcements' | 'timetable' | 'documents' | 'users' | 'fees' | 'complaints' | 'attendance';

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
        amount: 85000,
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
                // In fees mode, switch between submissions and defined structures
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
        console.log('Creating fee structure with data:', feeForm);

        try {
            const { error } = await supabase.from('fee_structures').insert([feeForm]);
            if (error) {
                console.error('Supabase error:', error);
                toast.error(`Error: ${error.message}`);
            } else {
                toast.success('Fee structure defined successfully!');
                setIsAdding(false);
                fetchData();
            }
        } catch (err: any) {
            console.error('Unexpected error:', err);
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

        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB');
            return;
        }

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${activeTab}/${fileName}`;

            // Upload the file to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('portal-docs')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get the public URL
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
            setDocForm({ ...docForm, file_url: '', title: '' }); // Reset
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

            {/* Tabs - Scrollable on Mobile */}
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
                {/* Toolbar */}
                <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <h3 className="font-bold text-gray-800 capitalize">{activeTab}</h3>
                        {activeTab === 'fees' && !isAdding && (
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => { setFeeSubTab('submissions'); fetchData(); }}
                                    className={`px-3 py-1 rounded-md text-xs font-semibold ${feeSubTab === 'submissions' ? 'bg-white shadow-sm text-green-700' : 'text-gray-500'}`}
                                >
                                    Submissions
                                </button>
                                <button
                                    onClick={() => { setFeeSubTab('structures'); fetchData(); }}
                                    className={`px-3 py-1 rounded-md text-xs font-semibold ${feeSubTab === 'structures' ? 'bg-white shadow-sm text-green-700' : 'text-gray-500'}`}
                                >
                                    Structures
                                </button>
                            </div>
                        )}
                    </div>
                    {!isAdding && ['announcements', 'timetable', 'documents', 'fees', 'attendance', 'users'].includes(activeTab) && (
                        <button
                            onClick={() => {
                                setIsAdding(true);
                                if (activeTab === 'fees') setFeeSubTab('structures'); // Switch to structures when adding
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            {activeTab === 'fees' ? 'Define Fee Structure' :
                                activeTab === 'attendance' ? 'Import Attendance' :
                                    activeTab === 'users' ? 'Add Student Profile' : 'Add New'}
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20">
                        <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
                        <p className="text-gray-500">Loading live data...</p>
                    </div>
                ) : isAdding ? (
                    <div className="p-4 sm:p-6 max-w-2xl">
                        {activeTab === 'announcements' ? (
                            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input
                                            required
                                            className="w-full border rounded-lg p-2.5"
                                            value={announcementForm.title}
                                            onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Category</label>
                                        <select
                                            className="w-full border rounded-lg p-2.5"
                                            value={announcementForm.category}
                                            onChange={e => setAnnouncementForm({ ...announcementForm, category: e.target.value })}
                                        >
                                            <option value="academic">Academic</option>
                                            <option value="exam">Exams</option>
                                            <option value="event">Event</option>
                                            <option value="fee">Fees</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Priority</label>
                                        <select
                                            className="w-full border rounded-lg p-2.5"
                                            value={announcementForm.priority}
                                            onChange={e => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div className="col-span-1">
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
                                    <div className="col-span-1">
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
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium mb-1">Target Section</label>
                                        <select
                                            className="w-full border rounded-lg p-2.5"
                                            value={announcementForm.section}
                                            onChange={e => setAnnouncementForm({ ...announcementForm, section: e.target.value })}
                                        >
                                            <option value="All">All Sections</option>
                                            {sections.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium mb-1">Target Department</label>
                                        <select
                                            className="w-full border rounded-lg p-2.5"
                                            value={announcementForm.department}
                                            onChange={e => setAnnouncementForm({ ...announcementForm, department: e.target.value })}
                                        >
                                            <option value="All Departments">All Departments</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Software Engineering">Software Engineering</option>
                                            <option value="Cyber Security">Cyber Security</option>
                                            <option value="Artificial Intelligence">Artificial Intelligence</option>
                                            <option value="Data Science">Data Science</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium mb-1">Posted By (Faculty Name)</label>
                                        <input
                                            required
                                            className="w-full border rounded-lg p-2.5"
                                            placeholder="e.g. Dr. Ahmed (CS Dept)"
                                            value={announcementForm.posted_by}
                                            onChange={e => setAnnouncementForm({ ...announcementForm, posted_by: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium mb-1">Message</label>
                                        <textarea
                                            required
                                            rows={4}
                                            className="w-full border rounded-lg p-2.5"
                                            value={announcementForm.message}
                                            onChange={e => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg">Post</button>
                                    <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-100 px-6 py-2 rounded-lg">Cancel</button>
                                </div>
                            </form>
                        ) : activeTab === 'fees' ? (
                            <form onSubmit={handleCreateFeeStructure} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">For Semester</label>
                                        <select
                                            className="w-full border rounded-lg p-2.5"
                                            value={feeForm.semester}
                                            onChange={e => setFeeForm({ ...feeForm, semester: e.target.value })}
                                        >
                                            {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">For Batch</label>
                                        <select
                                            className="w-full border rounded-lg p-2.5"
                                            value={feeForm.batch}
                                            onChange={e => setFeeForm({ ...feeForm, batch: e.target.value })}
                                        >
                                            {batches.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Amount (PKR)</label>
                                        <input
                                            type="number"
                                            className="w-full border rounded-lg p-2.5"
                                            value={feeForm.amount}
                                            onChange={e => setFeeForm({ ...feeForm, amount: parseInt(e.target.value) })}
                                        />
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
                                <div className="flex gap-3">
                                    <button type="submit" className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold">Define Structure</button>
                                    <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-100 px-6 py-2.5 rounded-lg font-medium">Cancel</button>
                                </div>
                            </form>
                        ) : activeTab === 'attendance' ? (
                            <div className="p-8 bg-white rounded-xl border-2 border-dashed border-gray-200 text-center">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileUp className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Bulk Import Attendance</h3>
                                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                    Upload a CSV file exported from Excel with columns: <br />
                                    <code className="text-[10px] bg-gray-100 p-1 rounded">student_id, student_name, course_name, attended, total, semester, batch, section</code>
                                </p>
                                <label className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-bold cursor-pointer hover:bg-green-700 transition-all shadow-lg">
                                    <Upload className="w-5 h-5" />
                                    {loading ? 'Processing...' : 'Select CSV File'}
                                    <input
                                        type="file"
                                        accept=".csv"
                                        className="hidden"
                                        onChange={handleAttendanceImport}
                                        disabled={loading}
                                    />
                                </label>
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="block mx-auto mt-4 text-gray-500 text-sm hover:underline"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleCreateDocument} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium mb-2 font-bold text-gray-700">
                                            {activeTab === 'timetable' ? 'Upload New Timetable (Image/PDF)' : 'Upload Academic Document'}
                                        </label>

                                        {/* File Upload Trigger */}
                                        <div className="relative group cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-8 text-center hover:border-green-500 hover:bg-green-50/50 transition-all">
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={handleFileUpload}
                                                accept="image/*,application/pdf"
                                            />
                                            {uploading ? (
                                                <div className="flex flex-col items-center">
                                                    <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-2" />
                                                    <p className="text-sm font-medium">Uploading file...</p>
                                                </div>
                                            ) : docForm.file_url ? (
                                                <div className="flex flex-col items-center">
                                                    <CheckCircle className="w-10 h-10 text-green-600 mb-2" />
                                                    <p className="text-sm font-medium text-green-700 truncate max-w-xs">{docForm.title}</p>
                                                    <p className="text-xs text-gray-500">File ready! Complete the details below.</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className="bg-green-50 p-4 rounded-full mb-3">
                                                        {activeTab === 'timetable' ? <ImageIcon className="w-8 h-8 text-green-600" /> : <FileUp className="w-8 h-8 text-green-600" />}
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-700">Click or drag to upload</p>
                                                    <p className="text-xs text-gray-500 mt-1">Supports images (JPG, PNG) or PDFs</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">For Semester</label>
                                        <select
                                            className="w-full border rounded-lg p-2.5"
                                            value={docForm.semester}
                                            onChange={e => setDocForm({ ...docForm, semester: e.target.value })}
                                        >
                                            {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">For Batch</label>
                                        <select
                                            className="w-full border rounded-lg p-2.5"
                                            value={docForm.batch}
                                            onChange={e => setDocForm({ ...docForm, batch: e.target.value })}
                                        >
                                            {batches.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Target Section</label>
                                        <select
                                            className="w-full border rounded-lg p-2.5"
                                            value={docForm.section}
                                            onChange={e => setDocForm({ ...docForm, section: e.target.value })}
                                        >
                                            {sections.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                                        </select>
                                    </div>

                                    {activeTab === 'documents' && (
                                        <div className={docForm.category === 'datesheet' || docForm.category === 'syllabus' ? 'col-span-1' : 'col-span-2'}>
                                            <label className="block text-sm font-medium mb-1">Document Category</label>
                                            <select
                                                className="w-full border rounded-lg p-2.5"
                                                value={docForm.category}
                                                onChange={e => setDocForm({ ...docForm, category: e.target.value })}
                                            >
                                                <option value="datesheet">Date Sheet</option>
                                                <option value="syllabus">Syllabus</option>
                                                <option value="handbook">Student Handbook</option>
                                                <option value="lecture">Lecture Material</option>
                                            </select>
                                        </div>
                                    )}

                                    {activeTab === 'documents' && docForm.category === 'lecture' && (
                                        <>
                                            <div className="col-span-1">
                                                <label className="block text-sm font-medium mb-1">Subject Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Data Structures"
                                                    className="w-full border rounded-lg p-2.5"
                                                    value={docForm.subject}
                                                    onChange={e => setDocForm({ ...docForm, subject: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label className="block text-sm font-medium mb-1">Instructor Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Dr. Sarah Ahmed"
                                                    className="w-full border rounded-lg p-2.5"
                                                    value={docForm.instructor}
                                                    onChange={e => setDocForm({ ...docForm, instructor: e.target.value })}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'documents' && docForm.category === 'datesheet' && (
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Exam Type</label>
                                            <select
                                                className="w-full border rounded-lg p-2.5"
                                                value={docForm.sub_category}
                                                onChange={e => setDocForm({ ...docForm, sub_category: e.target.value })}
                                            >
                                                <option value="midterm">Midterm Examination</option>
                                                <option value="final">Final Examination</option>
                                                <option value="general">Re-Exam / General</option>
                                            </select>
                                        </div>
                                    )}

                                    {activeTab === 'documents' && docForm.category === 'syllabus' && (
                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium mb-1">Subject Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Data Structures"
                                                className="w-full border rounded-lg p-2.5"
                                                value={docForm.subject}
                                                onChange={e => setDocForm({ ...docForm, subject: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                                        <textarea
                                            rows={2}
                                            className="w-full border rounded-lg p-2.5"
                                            placeholder="e.g., Midterm Timetable Spring 2026"
                                            value={docForm.description}
                                            onChange={e => setDocForm({ ...docForm, description: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading || uploading || !docForm.file_url}
                                        className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : `Publish ${activeTab === 'timetable' ? 'Timetable' : 'Document'}`}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setIsAdding(false); setDocForm({ ...docForm, file_url: '' }); }}
                                        className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                ) : (
                    <div className="p-0 overflow-x-auto">
                        {data.length === 0 ? (
                            <div className="p-20 text-center text-gray-500">
                                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>No records found in the database table.</p>
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
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-800">
                                                    {activeTab === 'announcements' ? item.title :
                                                        activeTab === 'users' ? item.full_name :
                                                            activeTab === 'attendance' ? item.student_name :
                                                                activeTab === 'fees' ? (feeSubTab === 'structures' ? `${item.semester} Structure` : (item.full_name || item.nutech_id)) :
                                                                    activeTab === 'timetable' ? item.subject :
                                                                        activeTab === 'complaints' ? item.subject : item.title}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {activeTab === 'users' ? item.nutech_id :
                                                        activeTab === 'attendance' ? item.student_id :
                                                            activeTab === 'fees' ? (feeSubTab === 'structures' ? `Batch: ${item.batch}` : `Amount: Rs. ${item.amount}`) :
                                                                activeTab === 'complaints' ? `From: ${item.student_name || 'Anonymous'}` :
                                                                    item.created_at?.split('T')[0]}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 max-w-md truncate">
                                                    {activeTab === 'announcements' ? item.message :
                                                        activeTab === 'users' ? `${item.department} | ${item.batch}` :
                                                            activeTab === 'documents' || activeTab === 'timetable' ? (
                                                                <div className="flex flex-col">
                                                                    <span className="font-semibold text-gray-700">{item.subject || item.title}</span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {item.semester} • {item.batch} • Sec {item.section}
                                                                    </span>
                                                                    <span className="text-[10px] uppercase tracking-wider text-green-600 font-bold mt-1">
                                                                        {item.category} {item.sub_category ? `(${item.sub_category})` : ''}
                                                                    </span>
                                                                </div>
                                                            ) :
                                                                activeTab === 'fees' ? (
                                                                    feeSubTab === 'structures' ? (
                                                                        <div className="flex items-center gap-4">
                                                                            <span className="font-bold text-green-700">Rs. {item.amount?.toLocaleString()}</span>
                                                                            <span className="text-xs text-gray-500">Due: {item.due_date}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center gap-3">
                                                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'verified' ? 'bg-green-100 text-green-700' :
                                                                                item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                                    'bg-yellow-100 text-yellow-700'
                                                                                }`}>
                                                                                {item.status || 'pending'}
                                                                            </span>
                                                                            <a href={item.file_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">View Proof</a>
                                                                        </div>
                                                                    )
                                                                ) :
                                                                    activeTab === 'complaints' ? (
                                                                        <div className="flex flex-col gap-1">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${item.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                                                                    item.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                                                        'bg-yellow-100 text-yellow-700'
                                                                                    }`}>
                                                                                    {item.status || 'pending'}
                                                                                </span>
                                                                                <span className="text-xs font-medium text-purple-600">{item.category}</span>
                                                                            </div>
                                                                            <p className="line-clamp-1">{item.description}</p>
                                                                            {item.response && <p className="text-[10px] text-green-600 font-medium italic">Resp: {item.response}</p>}
                                                                        </div>
                                                                    ) :
                                                                        activeTab === 'attendance' ? (
                                                                            <div className="flex items-center gap-4">
                                                                                <div className="flex-1 max-w-[150px]">
                                                                                    <div className="flex justify-between text-[10px] mb-1">
                                                                                        <span className="font-bold">{item.course_name}</span>
                                                                                        <span>{Math.round((item.attended_classes / item.total_classes) * 100)}%</span>
                                                                                    </div>
                                                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                                                        <div
                                                                                            className={`h-1.5 rounded-full ${item.attended_classes / item.total_classes < 0.75 ? 'bg-red-500' : 'bg-green-500'}`}
                                                                                            style={{ width: `${(item.attended_classes / item.total_classes) * 100}%` }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                                                                                    {item.attended_classes}/{item.total_classes} Classes
                                                                                </span>
                                                                            </div>
                                                                        ) :
                                                                            activeTab === 'timetable' ? `${item.day} at ${item.time_slot} in ${item.venue}` : item.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {activeTab === 'complaints' && (
                                                        <button
                                                            onClick={() => {
                                                                const newStatus = prompt('Enter new status (pending, in_progress, resolved):', item.status);
                                                                const resp = prompt('Enter response message:', item.response || '');
                                                                if (newStatus) handleUpdateComplaintStatus(item.id, newStatus, resp || '');
                                                            }}
                                                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                                                            title="Update Status"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {activeTab === 'fees' && feeSubTab === 'submissions' && item.status === 'pending' && (
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleVerifyFee(item.id, 'verified')}
                                                                className="p-1 px-2 bg-green-100 text-green-700 rounded text-[10px] font-bold"
                                                            >
                                                                Verify
                                                            </button>
                                                            <button
                                                                onClick={() => handleVerifyFee(item.id, 'rejected')}
                                                                className="p-1 px-2 bg-red-100 text-red-700 rounded text-[10px] font-bold"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                    {(activeTab !== 'fees' || feeSubTab === 'structures') && activeTab !== 'complaints' && (
                                                        <button
                                                            onClick={() => handleDelete(item.id,
                                                                activeTab === 'announcements' ? 'announcements' :
                                                                    activeTab === 'timetable' ? 'academic_documents' :
                                                                        activeTab === 'documents' ? 'academic_documents' :
                                                                            activeTab === 'users' ? 'student_profiles' :
                                                                                activeTab === 'fees' ? 'fee_structures' :
                                                                                    activeTab === 'attendance' ? 'attendance' : ''
                                                            )}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                )}
            </div>
        </div>
        </div >
    );
}
