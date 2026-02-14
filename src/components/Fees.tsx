import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, Clock, Download, FileText, ExternalLink, CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '../lib/supabase';

export function Fees({ user }: { user: any }) {
    const [status, setStatus] = useState<'paid' | 'unpaid' | 'pending' | 'verified' | 'rejected'>('unpaid');
    const [nutechId, setNutechId] = useState(user?.registrationNo || '');
    const [feeStructure, setFeeStructure] = useState<any>(null);
    const [submission, setSubmission] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [pastPayments, setPastPayments] = useState<any[]>([]);

    useEffect(() => {
        fetchFeeData();
    }, []);

    const fetchFeeData = async () => {
        setLoading(true);

        // 1. Fetch current fee structure for this student
        const { data: structures } = await supabase
            .from('fee_structures')
            .select('*')
            .eq('semester', user.semester)
            .eq('batch', user.batch || '2024')
            .order('created_at', { ascending: false })
            .limit(1);

        if (structures && structures.length > 0) {
            setFeeStructure(structures[0]);
        }

        // 2. Fetch current submission status
        const { data: subs } = await supabase
            .from('fee_submissions')
            .select('*')
            .eq('student_id', user.id)
            .eq('semester', user.semester)
            .order('created_at', { ascending: false })
            .limit(1);

        if (subs && subs.length > 0) {
            setSubmission(subs[0]);
            setStatus(subs[0].status);
        }

        // 3. Fetch past payments
        const { data: history } = await supabase
            .from('fee_submissions')
            .select('*')
            .eq('student_id', user.id)
            .neq('semester', user.semester)
            .eq('status', 'verified');

        if (history) setPastPayments(history);

        setLoading(false);
    };

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        const fileInput = document.getElementById('fee-file') as HTMLInputElement;
        const file = fileInput?.files?.[0];
        if (!file) {
            toast.error("Please select a file first");
            return;
        }

        setUploading(true);
        try {
            // Upload to storage
            const fileExt = file.name.split('.').pop();
            const filePath = `fee-proofs/${user.id}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('portal-docs')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('portal-docs')
                .getPublicUrl(filePath);

            // Record in database
            const { error: dbError } = await supabase
                .from('fee_submissions')
                .insert([{
                    student_id: user.id,
                    full_name: user.full_name,
                    nutech_id: nutechId,
                    semester: user.semester,
                    batch: user.batch || '2024',
                    section: user.section || 'N/A',
                    amount: feeStructure?.amount || 145000,
                    file_url: publicUrl,
                    status: 'pending'
                }]);

            if (dbError) throw dbError;

            toast.success("Payment proof submitted successfully!");
            fetchFeeData();
        } catch (err: any) {
            toast.error("Submission failed: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    // Official NUTECH fee-related forms
    const feeForms = [
        {
            title: 'Tuition Fee Payment Through Installments',
            description: 'Application form for paying semester fees in installments',
            link: 'https://nutech.edu.pk/wp-content/uploads/2023/11/FEE-SEMESTER-HOSTEL-PAYMENT-THROUGH-INSTALLMENTS-POLICY.pdf',
            icon: CreditCard
        },
        {
            title: 'Deferment of Tuition Fee & Hostel Charges',
            description: 'Request form for deferring fee payment',
            link: 'https://nutech.edu.pk/wp-content/uploads/2023/11/Application-Form-for-Deferment-of-Tuition-Fee-Hostel-Charges.pdf',
            icon: Clock
        },
        {
            title: 'Transcript Form',
            description: 'Application for issuance of official transcript',
            link: 'https://nutech.edu.pk/uploads/files/exam-forms/Form%202%20%20-%20APPLICATION-FOR-ISSUANCE-OF-TRANSCRIPT%20%28Revised%29.pdf',
            icon: FileText
        },
        {
            title: 'Hostel Request Form',
            description: 'Apply for hostel accommodation',
            link: 'https://nutech.edu.pk/downloads/',
            icon: FileText
        }
    ];

    // Academic Calendar Key Dates
    const academicDates = {
        spring2024: {
            start: 'Feb 26, 2024',
            midterms: 'Apr 15-21, 2024',
            finals: 'Late May - Jun 2024',
            end: 'Jun 30, 2024'
        },
        fall2024: {
            start: 'Oct 16, 2024',
            midterms: 'Dec 4-10, 2024',
            finals: 'Feb 5-11, 2025',
            break: 'Feb 12-25, 2025'
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Fee Management</h2>
                    <p className="text-muted-foreground">Check your fee status, download forms, and upload payment proof.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20">
                    <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
                    <p className="text-gray-500">Retrieving your financial records...</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Semester Fee</CardTitle>
                            <CardDescription>{user.semester} • {feeStructure?.due_date ? `Due: ${new Date(feeStructure.due_date).toLocaleDateString()}` : 'Standard Admission'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center space-y-4 py-6">
                                <div className="text-4xl font-bold">Rs. {feeStructure?.amount?.toLocaleString() || '145,000'}</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600 font-medium">Status:</span>
                                    {status === 'verified' && <Badge className="bg-green-600 hover:bg-green-700">Paid & Verified</Badge>}
                                    {status === 'unpaid' && <Badge variant="destructive">Unpaid</Badge>}
                                    {status === 'pending' && <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending Verification</Badge>}
                                    {status === 'rejected' && <Badge variant="destructive">Payment Rejected</Badge>}
                                </div>
                                {status === 'rejected' && <p className="text-xs text-red-600 text-center">Your last submission was rejected. Please re-upload a clear copy.</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {status !== 'verified' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Submit Payment Proof</CardTitle>
                                <CardDescription>Upload challan receipt or online payment screenshot</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {status === 'pending' ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                                            <Clock className="w-8 h-8 text-yellow-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">Verification in Progress</h3>
                                            <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">Your payment proof is being verified by the Finance Department. This usually takes 24-48 hours.</p>
                                        </div>
                                        <a href={submission?.file_url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">View Submitted Proof</a>
                                    </div>
                                ) : (
                                    <form onSubmit={handleFileUpload} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nutechId">NUTECH ID / Registration No.</Label>
                                            <Input
                                                id="nutechId"
                                                value={nutechId}
                                                onChange={(e) => setNutechId(e.target.value)}
                                                placeholder="e.g. NUTECH-CS-2023-001"
                                                required
                                            />
                                        </div>

                                        <Tabs defaultValue="bank" className="w-full">
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="bank">Bank Challan</TabsTrigger>
                                                <TabsTrigger value="online">Online Payment</TabsTrigger>
                                            </TabsList>
                                            <div className="space-y-4 pt-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="fee-file">Upload Payment Document</Label>
                                                    <Input id="fee-file" type="file" accept="image/*,.pdf" required />
                                                    <p className="text-xs text-gray-500 italic">Please upload a clear screenshot or picture of your receipt.</p>
                                                </div>
                                            </div>
                                        </Tabs>

                                        <Button type="submit" disabled={uploading} className="w-full bg-green-600 hover:bg-green-700">
                                            {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                                            {uploading ? 'Uploading...' : 'Submit for Verification'}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Fee Related Forms */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-green-600" />
                        Fee & Miscellaneous Forms
                    </CardTitle>
                    <CardDescription>Download official NUTECH forms for fee-related matters</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {feeForms.map((form, index) => {
                            const Icon = form.icon;
                            return (
                                <a
                                    key={index}
                                    href={form.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-green-200 transition-colors">
                                        <Icon className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">{form.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{form.description}</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors shrink-0 mt-1" />
                                </a>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Fee Payment Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">Important Fee Guidelines</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                        <li>• Pay fees before the due date to avoid late payment charges</li>
                        <li>• Keep the original bank challan/receipt for verification</li>
                        <li>• For installment requests, apply at least 2 weeks before the due date</li>
                        <li>• Contact the Finance Office for any fee-related queries</li>
                    </ul>
                </div>
            </div>

            {/* Fee History */}
            <Card>
                <CardHeader>
                    <CardTitle>Fee Payment History</CardTitle>
                    <CardDescription>Your previous semester verified fee payments</CardDescription>
                </CardHeader>
                <CardContent>
                    {pastPayments.length === 0 ? (
                        <p className="text-sm text-center py-6 text-gray-500 italic">No past records found.</p>
                    ) : (
                        <div className="space-y-3">
                            {pastPayments.map((payment, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div>
                                        <p className="font-semibold text-gray-800">{payment.semester}</p>
                                        <p className="text-xs text-gray-500">Verified on {new Date(payment.updated_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800">Rs. {payment.amount?.toLocaleString()}</p>
                                        <Badge className="bg-green-600">Paid</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
