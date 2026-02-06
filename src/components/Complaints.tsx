import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Send, MessageSquare, Loader2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '../lib/supabase';

interface ComplaintProps {
    user: any;
}

export function Complaints({ user }: ComplaintProps) {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('complaints')
            .select('*')
            .eq('student_id', user.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setComplaints(data);
        }
        setLoading(false);
    };

    const [formData, setFormData] = useState({
        title: '',
        category: 'Administrative',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const { error } = await supabase.from('complaints').insert([{
            student_id: user.id,
            student_name: user.full_name,
            subject: formData.title,
            category: formData.category,
            description: formData.description,
            status: 'pending'
        }]);

        if (error) {
            toast.error("Submission failed.");
        } else {
            setFormData({ title: '', category: 'Administrative', description: '' });
            toast.success("Complaint submitted successfully.");
            fetchComplaints();
        }
        setSubmitting(false);
    };

    const getStatusInfo = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'resolved':
                return { label: 'Resolved', color: 'bg-green-500 hover:bg-green-600', icon: <CheckCircle className="w-3 h-3" /> };
            case 'in_progress':
                return { label: 'In Progress', color: 'bg-blue-500 hover:bg-blue-600', icon: <Clock className="w-3 h-3" /> };
            case 'fixed':
                return { label: 'Fixed', color: 'bg-green-600 hover:bg-green-700', icon: <CheckCircle className="w-3 h-3" /> };
            default:
                return { label: 'Pending', color: 'bg-yellow-500 hover:bg-yellow-600', icon: <AlertCircle className="w-3 h-3" /> };
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Student Complaints</h2>
                    <p className="text-muted-foreground">Submit and track your complaints and suggestions.</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* New Complaint Form */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>New Complaint</CardTitle>
                            <CardDescription>We will get back to you shortly.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Academic">Academic</SelectItem>
                                            <SelectItem value="Administrative">Administrative</SelectItem>
                                            <SelectItem value="Facilities">Facilities</SelectItem>
                                            <SelectItem value="IT Support">IT Support</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="title">Subject</Label>
                                    <Input
                                        id="title"
                                        placeholder="Brief title of the issue"
                                        value={formData.title}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe your issue in detail..."
                                        className="min-h-[120px]"
                                        value={formData.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={submitting}>
                                    {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                    {submitting ? 'Submitting...' : 'Submit Complaint'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Complaints History */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>History</CardTitle>
                            <CardDescription>Your recent complaints and their status.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="text-center py-10">
                                        <Loader2 className="w-8 h-8 mx-auto animate-spin text-green-600" />
                                        <p className="mt-2 text-sm text-gray-500">Loading history...</p>
                                    </div>
                                ) : complaints.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No complaints submitted yet.</p>
                                    </div>
                                ) : (
                                    complaints.map((complaint) => {
                                        const status = getStatusInfo(complaint.status);
                                        return (
                                            <div key={complaint.id} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col gap-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <h4 className="font-semibold">{complaint.subject}</h4>
                                                        <p className="text-xs text-muted-foreground">
                                                            {complaint.category} • {complaint.created_at?.split('T')[0]}
                                                        </p>
                                                    </div>
                                                    <Badge className={`${status.color} flex items-center gap-1`}>
                                                        {status.icon}
                                                        {status.label}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {complaint.description}
                                                </p>
                                                {complaint.response && (
                                                    <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-100">
                                                        <p className="text-xs font-bold text-green-800 mb-1">Official Response:</p>
                                                        <p className="text-sm text-green-700 italic">{complaint.response}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
