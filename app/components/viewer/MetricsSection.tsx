import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ReportData } from '@/app/types/report';

interface MetricsSectionProps {
    data: ReportData;
}

export default function MetricsSection({ data }: MetricsSectionProps) {
    const totalLinks = data.internalLinks.length + data.externalLinks.length;
    const successfulCalls = data.apiCalls.filter(call =>
        call?.response?.status && call.response.status >= 200 && call.response.status < 300
    ).length;
    const failedCalls = data.apiCalls.filter(call =>
        !call?.response?.status || call.response.status < 200 || call.response.status >= 300
    ).length;

    const totalStorage = (data.cookies?.length || 0) +
        (Object.keys(data.localStorage || {}).length) +
        (Object.keys(data.sessionStorage || {}).length);

    const apiChartData = data.apiCalls.length ? [
        { name: 'Success', value: successfulCalls, color: '#22c55e' },
        { name: 'Failed', value: failedCalls, color: '#ef4444' }
    ] : [
        { name: 'No Calls', value: 1, color: '#e5e7eb' }
    ];

    const storageData = [
        { name: 'Cookies', value: data.cookies.length, color: '#3b82f6' },
        { name: 'LocalStorage', value: Object.keys(data.localStorage || {}).length, color: '#8b5cf6' },
        { name: 'SessionStorage', value: Object.keys(data.sessionStorage || {}).length, color: '#f59e0b' }
    ];

    const formMetrics = {
        postForms: data.forms.filter(form => form.method?.toUpperCase() === 'POST').length,
        getForms: data.forms.filter(form => !form.method || form.method?.toUpperCase() === 'GET').length,
        fileUploads: data.forms.filter(form =>
            form.inputs?.some(input => input.type === 'file')
        ).length,
        requiredFields: data.forms.reduce((acc, form) =>
            acc + (form.inputs?.filter(input => input.required)?.length || 0)
            , 0),
        optionalFields: data.forms.reduce((acc, form) =>
            acc + (form.inputs?.filter(input => !input.required)?.length || 0)
            , 0)
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="standard-card">
                <div className="text-sm standard-text-secondary font-bold">Total Links</div>
                <div className="text-lg font-semibold text-gray-900 mt-1">{totalLinks}</div>
                <div className="mt-2 h-1.5 bg-gray-100 overflow-hidden flex">
                    <div
                        className="h-full bg-blue-500"
                        style={{ width: `${Math.round((data.internalLinks.length / totalLinks) * 100)}%` }}
                    />
                    <div
                        className="h-full bg-gray-400"
                        style={{ width: `${Math.round((data.externalLinks.length / totalLinks) * 100)}%` }}
                    />
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-600 font-medium">
                    <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                        {Math.round((data.internalLinks.length / totalLinks) * 100)}% Internal
                    </div>
                    <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-gray-400 mr-1"></span>
                        {Math.round((data.externalLinks.length / totalLinks) * 100)}% External
                    </div>
                </div>
            </div>

            <div className="standard-card">
                <div className="text-sm standard-text-secondary font-bold">API Calls</div>
                <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-gray-900 mt-1">{data.apiCalls.length}</div>
                    <div className="w-16 h-16">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={apiChartData}
                                    dataKey="value"
                                    innerRadius={15}
                                    outerRadius={30}
                                    paddingAngle={2}
                                >
                                    {apiChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {data.apiCalls.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1">
                        <div className="text-xs flex justify-between items-center text-gray-600 font-medium">
                            <span className="flex items-center">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                                Success (2xx)
                            </span>
                            <span>{successfulCalls}</span>
                        </div>
                        <div className="text-xs flex justify-between items-center text-gray-600 font-medium">
                            <span className="flex items-center">
                                <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                                Failed
                            </span>
                            <span>{failedCalls}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="standard-card">
                <div className="text-sm standard-text-secondary font-bold">Forms</div>
                <div className="text-lg font-semibold text-gray-900 mt-1">{data.forms.length}</div>
                <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-xs text-gray-600 font-medium">
                        <span>Form Fields</span>
                        <span>{formMetrics.requiredFields + formMetrics.optionalFields}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 overflow-hidden flex">
                        <div
                            className="h-full bg-indigo-500"
                            style={{
                                width: `${Math.round((formMetrics.requiredFields / (formMetrics.requiredFields + formMetrics.optionalFields)) * 100)}%`
                            }}
                        />
                        <div
                            className="h-full bg-violet-300"
                            style={{
                                width: `${Math.round((formMetrics.optionalFields / (formMetrics.requiredFields + formMetrics.optionalFields)) * 100)}%`
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 font-medium gap-4">
                        <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></span>
                            Required ({formMetrics.requiredFields})
                        </div>
                        <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-violet-300 mr-1"></span>
                            Optional ({formMetrics.optionalFields})
                        </div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-600 font-medium mt-2">
                        <span>File Uploads</span>
                        <span>{formMetrics.fileUploads}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 overflow-hidden">
                        <div
                            className="h-full bg-orange-500"
                            style={{
                                width: `${data.forms.length ? Math.round((formMetrics.fileUploads / data.forms.length) * 100) : 0}%`
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="standard-card">
                <div className="text-sm standard-text-secondary font-bold">Storage Items</div>
                <div className="text-lg font-semibold text-gray-900 mt-1">{totalStorage}</div>
                <div className="mt-3 space-y-2">
                    {storageData.map((item) => (
                        <div key={item.name} className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-600 font-medium">
                                <span>{item.name}</span>
                                <span>{item.value}</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 overflow-hidden">
                                <div
                                    className="h-full"
                                    style={{
                                        width: `${Math.round((item.value / totalStorage) * 100)}%`,
                                        backgroundColor: item.color
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
