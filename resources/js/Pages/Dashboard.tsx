import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface VulnerabilityModule {
    id: number;
    name: string;
    category: string;
    description: string;
    severity: string;
}

interface ExploitAttempt {
    id: number;
    target_version: 'vulnerable' | 'fixed';
    payload_used: string;
    result: 'success' | 'blocked' | 'error';
    attempted_at: string;
}

interface PageProps {
    vulnerabilityModules: VulnerabilityModule[];
    exploitAttempts: ExploitAttempt[];
    flash: {
        lab_result?: any;
        lab_status?: string;
    };
}

export default function Dashboard() {
    const { vulnerabilityModules, exploitAttempts, flash } = usePage<PageProps>().props;
    const [activeTab, setActiveTab] = useState<'overview' | 'labs'>('overview');

    const vulnForm = useForm({ username: '', password: '' });
    const fixedForm = useForm({ username: '', password: '' });

    const submitVulnerable = (e: React.FormEvent) => {
        e.preventDefault();
        vulnForm.post('/lab/sqli/vulnerable/login');
    };

    const submitFixed = (e: React.FormEvent) => {
        e.preventDefault();
        fixedForm.post('/lab/sqli/fixed/login');
    };

    const inputClass = "mb-2 w-full rounded border border-gray-300 px-2 py-1 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400";

    const resultColor = (result: string) => {
        if (result === 'success') return 'text-green-400 font-semibold';
        if (result === 'error') return 'text-red-400 font-semibold';
        if (result === 'blocked') return 'text-yellow-400 font-semibold';
        return 'text-gray-200';
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <div className="mb-4 flex gap-4 border-b border-gray-300 text-white dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`pb-2 ${activeTab === 'overview' ? 'border-b-2 border-red-500 font-semibold' : ''}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('labs')}
                            className={`pb-2 ${activeTab === 'labs' ? 'border-b-2 border-red-500 font-semibold' : ''}`}
                        >
                            Vulnerability Labs
                        </button>
                    </div>

                    {activeTab === 'overview' && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                You're logged in!
                            </div>
                        </div>
                    )}

                    {activeTab === 'labs' && (
                        <div className="space-y-6">
                            {vulnerabilityModules.map((mod) => (
                                <div key={mod.id} className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                                    <h3 className="text-lg font-bold text-white">{mod.name}</h3>
                                    <p className="mb-4 text-sm text-gray-300">{mod.description}</p>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <form onSubmit={submitVulnerable} className="rounded border border-red-400 p-4">
                                            <h4 className="mb-2 font-semibold text-red-500">Vulnerable Endpoint</h4>
                                            <input
                                                type="text"
                                                placeholder="username (try: admin' -- )"
                                                value={vulnForm.data.username}
                                                onChange={(e) => vulnForm.setData('username', e.target.value)}
                                                className={inputClass}
                                            />
                                            <input
                                                type="text"
                                                placeholder="password (anything)"
                                                value={vulnForm.data.password}
                                                onChange={(e) => vulnForm.setData('password', e.target.value)}
                                                className={inputClass}
                                            />
                                            <button type="submit" className="rounded bg-red-500 px-4 py-1 text-white">
                                                Try Exploit
                                            </button>
                                        </form>

                                        <form onSubmit={submitFixed} className="rounded border border-green-400 p-4">
                                            <h4 className="mb-2 font-semibold text-green-600">Fixed Endpoint</h4>
                                            <input
                                                type="text"
                                                placeholder="username"
                                                value={fixedForm.data.username}
                                                onChange={(e) => fixedForm.setData('username', e.target.value)}
                                                className={inputClass}
                                            />
                                            <input
                                                type="text"
                                                placeholder="password"
                                                value={fixedForm.data.password}
                                                onChange={(e) => fixedForm.setData('password', e.target.value)}
                                                className={inputClass}
                                            />
                                            <button type="submit" className="rounded bg-green-600 px-4 py-1 text-white">
                                                Try Same Payload
                                            </button>
                                        </form>
                                    </div>

                                    {flash?.lab_status && (
                                        <div className="mt-4 rounded bg-gray-100 p-3 text-sm dark:bg-gray-700">
                                            <span className="text-gray-900 dark:text-gray-100">Status: </span>
                                            <strong className={resultColor(flash.lab_status)}>{flash.lab_status}</strong>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                                <h3 className="mb-4 text-lg font-bold text-white">Exploit History</h3>
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-600">
                                            <th className="py-1 text-white">Target</th>
                                            <th className="text-white">Payload</th>
                                            <th className="text-white">Result</th>
                                            <th className="text-white">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exploitAttempts.map((a) => (
                                            <tr key={a.id} className="border-b border-gray-700">
                                                <td className="py-1 text-gray-200">{a.target_version}</td>
                                                <td className="text-gray-200">{a.payload_used}</td>
                                                <td className={resultColor(a.result)}>{a.result}</td>
                                                <td className="text-gray-200">{a.attempted_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
