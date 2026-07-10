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

interface XssComment {
    id: number;
    author_name: string;
    body: string;
    target_version: 'vulnerable' | 'fixed';
    created_at: string;
}

interface PageProps {
    vulnerabilityModules: VulnerabilityModule[];
    exploitAttempts: ExploitAttempt[];
    xssComments: {
        vulnerable: XssComment[];
        fixed: XssComment[];
    };
    flash: {
        lab_result?: any;
        lab_status?: string;
    };
}

const inputClass = "mb-2 w-full rounded border border-gray-300 px-2 py-1 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400";

const resultColor = (result: string) => {
    if (result === 'success') return 'text-green-400 font-semibold';
    if (result === 'error') return 'text-red-400 font-semibold';
    if (result === 'blocked') return 'text-yellow-400 font-semibold';
    return 'text-gray-200';
};

const severityColor = (severity: string) => {
    if (severity === 'critical') return 'bg-red-700 text-white';
    if (severity === 'high') return 'bg-orange-600 text-white';
    if (severity === 'medium') return 'bg-yellow-500 text-black';
    if (severity === 'low') return 'bg-blue-500 text-white';
    return 'bg-gray-500 text-white';
};

function SqliLab({ flash }: { flash: PageProps['flash'] }) {
    const vulnForm = useForm({ username: '', password: '' });
    const fixedForm = useForm({ username: '', password: '' });

    return (
        <div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <form onSubmit={(e) => { e.preventDefault(); vulnForm.post('/lab/sqli/vulnerable/login'); }}
                    className="rounded border border-red-400 p-4">
                    <h4 className="mb-2 font-semibold text-red-500">Vulnerable Endpoint</h4>
                    <input type="text" placeholder="username (try: admin' -- )"
                        value={vulnForm.data.username}
                        onChange={(e) => vulnForm.setData('username', e.target.value)}
                        className={inputClass} />
                    <input type="text" placeholder="password (anything)"
                        value={vulnForm.data.password}
                        onChange={(e) => vulnForm.setData('password', e.target.value)}
                        className={inputClass} />
                    <button type="submit" className="rounded bg-red-500 px-4 py-1 text-white">
                        Try Exploit
                    </button>
                </form>

                <form onSubmit={(e) => { e.preventDefault(); fixedForm.post('/lab/sqli/fixed/login'); }}
                    className="rounded border border-green-400 p-4">
                    <h4 className="mb-2 font-semibold text-green-500">Fixed Endpoint</h4>
                    <input type="text" placeholder="username"
                        value={fixedForm.data.username}
                        onChange={(e) => fixedForm.setData('username', e.target.value)}
                        className={inputClass} />
                    <input type="text" placeholder="password"
                        value={fixedForm.data.password}
                        onChange={(e) => fixedForm.setData('password', e.target.value)}
                        className={inputClass} />
                    <button type="submit" className="rounded bg-green-600 px-4 py-1 text-white">
                        Try Same Payload
                    </button>
                </form>
            </div>

            {flash?.lab_status && (
                <div className="mt-4 rounded bg-gray-700 p-3 text-sm">
                    <span className="text-gray-100">Status: </span>
                    <strong className={resultColor(flash.lab_status)}>{flash.lab_status}</strong>
                </div>
            )}
        </div>
    );
}

function XssLab({ comments }: { comments: PageProps['xssComments'] }) {
    const vulnForm = useForm({ author_name: '', body: '' });
    const fixedForm = useForm({ author_name: '', body: '' });

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded border border-red-400 p-4">
                <h4 className="mb-2 font-semibold text-red-500">Vulnerable Endpoint</h4>
                <form onSubmit={(e) => { e.preventDefault(); vulnForm.post('/lab/xss/vulnerable/comment'); }}>
                    <input type="text" placeholder="Author name"
                        value={vulnForm.data.author_name}
                        onChange={(e) => vulnForm.setData('author_name', e.target.value)}
                        className={inputClass} />
                    <input type="text" placeholder='try: <img src=x onerror="alert(1)">'
                        value={vulnForm.data.body}
                        onChange={(e) => vulnForm.setData('body', e.target.value)}
                        className={inputClass} />
                    <button type="submit" className="rounded bg-red-500 px-4 py-1 text-white">
                        Post Comment
                    </button>
                </form>
                <div className="mt-4 space-y-2">
                    {comments.vulnerable.map((c) => (
                        <div key={c.id} className="rounded bg-gray-700 p-2 text-sm">
                            <span className="font-semibold text-gray-200">{c.author_name}: </span>
                            <span dangerouslySetInnerHTML={{ __html: c.body }} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded border border-green-400 p-4">
                <h4 className="mb-2 font-semibold text-green-500">Fixed Endpoint</h4>
                <form onSubmit={(e) => { e.preventDefault(); fixedForm.post('/lab/xss/fixed/comment'); }}>
                    <input type="text" placeholder="Author name"
                        value={fixedForm.data.author_name}
                        onChange={(e) => fixedForm.setData('author_name', e.target.value)}
                        className={inputClass} />
                    <input type="text" placeholder="try same payload"
                        value={fixedForm.data.body}
                        onChange={(e) => fixedForm.setData('body', e.target.value)}
                        className={inputClass} />
                    <button type="submit" className="rounded bg-green-600 px-4 py-1 text-white">
                        Post Comment
                    </button>
                </form>
                <div className="mt-4 space-y-2">
                    {comments.fixed.map((c) => (
                        <div key={c.id} className="rounded bg-gray-700 p-2 text-sm">
                            <span className="font-semibold text-gray-200">{c.author_name}: </span>
                            <span>{c.body}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ModuleLab({ mod, flash, xssComments }: {
    mod: VulnerabilityModule;
    flash: PageProps['flash'];
    xssComments: PageProps['xssComments'];
}) {
    if (mod.category === 'sql_injection') return <SqliLab flash={flash} />;
    if (mod.category === 'xss') return <XssLab comments={xssComments} />;
    return <p className="text-gray-400 text-sm">Lab belum tersedia.</p>;
}

export default function Dashboard() {
    const { vulnerabilityModules, exploitAttempts, xssComments, flash } = usePage<PageProps>().props;
    const [activeTab, setActiveTab] = useState<'overview' | 'labs'>('overview');
    const [activeModule, setActiveModule] = useState<number>(
        vulnerabilityModules[0]?.id ?? 0
    );

    const currentModule = vulnerabilityModules.find((m) => m.id === activeModule);

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

                    {/* Tab utama: Overview vs Vulnerability Labs */}
                    <div className="mb-6 flex gap-4 border-b border-gray-700 text-white">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`pb-2 ${activeTab === 'overview' ? 'border-b-2 border-red-500 font-semibold' : 'text-gray-400'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('labs')}
                            className={`pb-2 ${activeTab === 'labs' ? 'border-b-2 border-red-500 font-semibold' : 'text-gray-400'}`}
                        >
                            Vulnerability Labs
                        </button>
                    </div>

                    {activeTab === 'overview' && (
                        <div className="overflow-hidden rounded-lg bg-gray-800 p-6 shadow-sm">
                            <p className="text-gray-100">You're logged in!</p>
                        </div>
                    )}

                    {activeTab === 'labs' && (
                        <div>
                            {/* Tab modul */}
                            <div className="mb-6 flex gap-2 border-b border-gray-700">
                                {vulnerabilityModules.map((mod) => (
                                    <button
                                        key={mod.id}
                                        onClick={() => setActiveModule(mod.id)}
                                        className={`px-4 py-2 text-sm font-medium ${
                                            activeModule === mod.id
                                                ? 'border-b-2 border-red-500 text-white'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        {mod.name}
                                    </button>
                                ))}
                            </div>

                            {/* Konten modul aktif */}
                            {currentModule && (
                                <div className="rounded-lg bg-gray-800 p-6 shadow-sm">
                                    <div className="mb-4 flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-white">{currentModule.name}</h3>
                                        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${severityColor(currentModule.severity)}`}>
                                            {currentModule.severity.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="mb-6 text-sm text-gray-300">{currentModule.description}</p>
                                    <ModuleLab mod={currentModule} flash={flash} xssComments={xssComments} />
                                </div>
                            )}

                            {/* Exploit History */}
                            <div className="mt-6 rounded-lg bg-gray-800 p-6 shadow-sm">
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